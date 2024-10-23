import {all, create, Matrix} from 'mathjs';

const math = create(all);

class Graph {
    private readonly adjacencyMatrix: Matrix;
    private readonly nodeAliasMap: Map<number, number>;
    private readonly nodeList: number[];
    private readonly isDirected: boolean;
    private readonly weights: number[];

    constructor(private readonly matrix: Matrix, nodeList?: number[], isDirected = false, weights?: number[]) {
        this.adjacencyMatrix = matrix;
        this.nodeAliasMap = new Map();
        this.nodeList = nodeList || [];
        this.isDirected = isDirected;
        this.weights = weights || [];

        if (nodeList) {
            nodeList.forEach((node, index) => {
                this.nodeAliasMap.set(node, index);
            });
        }

        if(!isDirected) this.makeSymmetric();
    }

    public makeSymmetric() {
        const size = this.adjacencyMatrix.size()[0];
        for(let i = 0; i < size; i++) {
            for(let j = 0; j < size; j++) {
                this.adjacencyMatrix.set([i,j], math.max(this.adjacencyMatrix.get([j,i]), this.adjacencyMatrix.get([i,j])));
            }
        }
    }

    // ----------------------------------------- Static Functions -----------------------------------------

    public static LatexMatrix(matrix : Matrix, round?:number) : string {
        if(round) {
            matrix = math.round(matrix, round);
        }
        return `\\begin{bmatrix} ${(matrix.toArray() as number[][]).map(row => row.join(' & ')).join(' \\\\ ')} \\end{bmatrix}`;
    }

    public static stringToGraph(newGraphString: string, isDirected: boolean): Graph {
        const lines = newGraphString.split('\n').map(line => line.trim()).filter(line => line);
        // @ts-ignore
        const nodes = [...new Set(lines.filter(line => !line.includes(',') && !isNaN(Number(line))).map(Number))];
        const links: [number, number][] = [];
        const weights: (number | undefined)[] = [];

        lines.filter(line => line.includes(',')).forEach(line => {
            const parts = line.split(':');
            const [a, b] = parts[0].split(',').map(Number);

            if(nodes.indexOf(a) > -1 && nodes.indexOf(b) > -1) {
                links.push([a, b]);
                weights.push(parts[1] ? parseFloat(parts[1]) : undefined);
            }
        });

        const hasWeights = weights.some(w => w !== undefined);
        const finalWeights: number[] = hasWeights ? weights.map(w => (w === undefined ? 1 : w)) : [];

        const result = Graph.fromNodesAndLinks(nodes, links, isDirected, finalWeights);
        result.makeSymmetric();
        return result;
    }

    private static createAliasMap(nodes: number[]): Map<number, number> {
        const aliasMap = new Map();
        nodes.forEach((node, index) => {
            aliasMap.set(node, index);
        });
        return aliasMap;
    }

    public static fromNodesAndLinks(nodes: number[], links: [number, number][], isDirected = false, weights?: number[]): Graph {
        const aliasMap = Graph.createAliasMap(nodes);
        const size = nodes.length;
        const adjacencyMatrix = math.matrix(math.zeros([size, size]));

        links.forEach(([i, j]) => {
            const aliasI = aliasMap.get(i);
            const aliasJ = aliasMap.get(j);
            if (aliasI !== undefined && aliasJ !== undefined) {
                adjacencyMatrix.set([aliasI, aliasJ], 1);
                if (!isDirected) {
                    adjacencyMatrix.set([aliasJ, aliasI], 1);
                }
            }
        });

        return new Graph(adjacencyMatrix as Matrix, nodes, isDirected, weights);
    }

    public static fromAdjacencyMatrix(matrix: Matrix, nodeList: number[], isDirected = false, weights?: number[]): Graph {
        return new Graph(matrix, nodeList, isDirected, weights);
    }

    // ----------------------------------------- GETTERS / SETTERS -----------------------------------------

    public getIsDirected() : boolean {
        return this.isDirected;
    }

    public getIsWeighted() : boolean {
        return this.weights.length === this.getLinkCount();
    }

    public getAdjacencyMatrix(): Matrix {
        return this.adjacencyMatrix;
    }

    public getNodeList(): number[] {
        return this.nodeList;
    }

    public getEdgeWeightList(): number[] {
        return this.weights;
    }

    public getNodeCount(): number {
        return this.nodeList.length;
    }

    // ----------------------------------------- Compute Matrices -----------------------------------------

    public getLinks(): [number, number][] {
        const links: [number, number][] = [];
        this.adjacencyMatrix.forEach((value, [i, j]) => {
            if (value !== 0 && (this.isDirected || i <= j)) {
                links.push([i, j]);
            }
        });
        return links;
    }

    public getIncidenceMatrix(): Matrix {
        const size = this.adjacencyMatrix.size()[0];
        const links = this.getLinks();
        const incidenceMatrix = math.matrix(math.zeros(size, links.length));

        links.forEach(([i, j], index) => {
            incidenceMatrix.set([i, index], 1);
            incidenceMatrix.set([j, index], this.isDirected ? -1 : 1);
        });

        return incidenceMatrix as Matrix;
    }

    public getPseudoInverse(weighted: boolean = false): Matrix {
        const { values, vectors } = this.getSpectralDecomposition();
        const epsilon = 1e-10; // small value to prevent division by zero

        try {
            let pseudoInverse = math.matrix(math.zeros(this.adjacencyMatrix.size()));

            for (let i = 0; i < this.getNodeCount(); i++) {
                const column = math.column(vectors, i);
                const eigenvalue = values.get([i, i]);
                const term = math.multiply(math.multiply(column, math.transpose(column)), 1 / (eigenvalue + epsilon)); // Adjusting for zero eigenvalues
                pseudoInverse = math.add(pseudoInverse, term);
            }

            return pseudoInverse as Matrix;
        } catch (error) {
            console.error("Error calculating pseudoinverse: ", error);
            // Handle gracefully: Return a zero matrix of the same size as a fallback
            return math.matrix(math.zeros(this.adjacencyMatrix.size())) as Matrix;
        }
    }


    // public getPseudoInverse(weighted: boolean = false): Matrix {
    //     const laplacian = this.getLaplacianMatrix(weighted);
    //     try {
    //         const pseudoInverse = math.pinv(laplacian);
    //         return pseudoInverse as Matrix;
    //     } catch (error) {
    //         console.error("Error calculating pseudoinverse: ", error);
    //         // Handle gracefully: Return a zero matrix of the same size as a fallback
    //         return math.matrix(math.zeros(laplacian.size())) as Matrix;
    //     }
    // }


    public getDegreeMatrix(weighted: boolean = false): Matrix {
        const size = this.adjacencyMatrix.size()[0];
        const degrees = Array(size).fill(0);
        const seenEdges = new Set<string>();

        this.adjacencyMatrix.forEach((value, index) => {
            if (value !== 0) {
                const i = index[0];
                const j = index[1];
                const edge = i < j ? `${i},${j}` : `${j},${i}`; // Ensure undirected edges are counted once

                if (!seenEdges.has(edge)) {
                    degrees[i] += value * (weighted ? (this.weights[j] || 1) : 1);
                    degrees[j] += value * (weighted ? (this.weights[i] || 1) : 1);
                    seenEdges.add(edge);
                }
            }
        });

        return math.matrix(math.diag(degrees));
    }


    public getLaplacianMatrix(weighted: boolean = false): Matrix {
        const degreeMatrix = this.getDegreeMatrix(weighted);
        const weightedAdjacencyMatrix = this.adjacencyMatrix.map((value, index) => value * (weighted ? (this.weights[index[0]] || 1) : 1));
        return math.subtract(degreeMatrix, weightedAdjacencyMatrix) as Matrix;
    }

    public getComplementGraph(): Matrix {
        const size = this.adjacencyMatrix.size();
        const I = math.identity(size[0]);
        const J = math.matrix(math.ones(size[0], size[1]));
        const result =  math.matrix(math.subtract(math.subtract(J, I), this.adjacencyMatrix) as Matrix);
        console.log(`result; ${result}`);
        return math.matrix(result);
    }

    public getWeightMatrix(): Matrix {
        const links = this.getLinks();
        const size = links.length;
        const weightMatrix = math.matrix(math.zeros(size, size));

        links.forEach((_, index) => {
            weightMatrix.set([index, index], this.weights[index] || 1);
        });
        return weightMatrix as Matrix;
    }

    private linkCount = -1;
    public getLinkCount(): number {
        if(this.linkCount >= 0) return this.linkCount;
        let count = 0;
        this.adjacencyMatrix.forEach(value => {
            if (value !== 0) count++;
        });
        count = this.isDirected ? count : count / 2
        this.linkCount = count;
        return count;
    }

    public getAllDegrees(): number[] {
        return this.nodeList.map(node => this.getDegree(node));
    }


    public getDegree(selectedNode: number): number {
        const nodeIndex = this.nodeAliasMap.get(selectedNode);
        if (nodeIndex !== undefined) {
            const row = this.adjacencyMatrix.subset(math.index(nodeIndex, math.range(0, this.adjacencyMatrix.size()[1])));
            return math.sum(row) as number;
        }
        return 0;
    }

    public getAverageDegree(): number {
        const nodeCount = this.getNodeCount();
        const linkCount = this.getLinkCount();
        return nodeCount ? (2 * linkCount) / nodeCount : 0;
    }

    public getClusteringCoefficient(): number {
        const size = this.adjacencyMatrix.size()[0];
        let triangles = 0;
        let triples = 0;

        for (let i = 0; i < size; i++) {
            for (let j = i + 1; j < size; j++) {
                if (this.adjacencyMatrix.get([i, j]) !== 0) {
                    for (let k = j + 1; k < size; k++) {
                        if (this.adjacencyMatrix.get([i, k]) !== 0 && this.adjacencyMatrix.get([j, k]) !== 0) {
                            triangles++;
                        }
                        if (this.adjacencyMatrix.get([i, k]) !== 0 || this.adjacencyMatrix.get([j, k]) !== 0) {
                            triples++;
                        }
                    }
                }
            }
        }

        return triples ? (3 * triangles) / triples : 0;
    }

    public getDiameter(): number {
        const size = this.adjacencyMatrix.size()[0];
        const distances = math.clone(this.adjacencyMatrix);

        // Initialize distances
        for (let i = 0; i < size; i++) {
            for (let j = 0; j < size; j++) {
                if (i !== j && distances.get([i, j]) === 0) {
                    distances.set([i, j], Infinity);
                }
            }
        }

        // Floyd-Warshall algorithm
        for (let k = 0; k < size; k++) {
            for (let i = 0; i < size; i++) {
                for (let j = 0; j < size; j++) {
                    const newDist = distances.get([i, k]) + distances.get([k, j]);
                    if (newDist < distances.get([i, j])) {
                        distances.set([i, j], newDist);
                    }
                }
            }
        }

        // Find the longest shortest path
        let diameter = 0;
        distances.forEach((value) => {
            if (value !== Infinity && value > diameter) {
                diameter = value;
            }
        });

        return diameter;
    }

    public getSpectralDecomposition(): { vectors: Matrix, values: Matrix } {
        try {
            let { eigenvectors } = math.eigs(this.adjacencyMatrix);
            eigenvectors = eigenvectors.sort((a, b) => (b.value as number) - (a.value as number));
            const eigenVectors = eigenvectors.map((obj: any) => obj.vector);
            const Values = eigenvectors.map((obj: any) => obj.value);
            const X = math.transpose(math.matrix(eigenVectors)) as Matrix;
            const Diag = math.matrix(math.diag(Values)) as Matrix;
            return { vectors: X, values: Diag };
        } catch (error) {
            console.error("Eigenvalues failed to converge:", error);
            const size = this.adjacencyMatrix.size();
            const I = math.identity(size[0]) as Matrix;
            const Z = math.matrix(math.zeros(size[0], size[1]));
            return { vectors: I, values: Z };
        }
    }

    /// converts to user readable format!
    public toString(): string {
        const links: [number, number][] = this.getLinks();
        const nodes = this.nodeList;
        const weights = this.weights;

        // Map links to their string representation with weights if present
        const linkStr = links.map((link, index) => {
            const weight = this.getIsWeighted() ? `:${weights[index]}` : '';
            return `${nodes[link[0]]},${nodes[link[1]]}${weight}`;
        }).join('\n');

        return `${nodes.join('\n')}\n${linkStr}`;
    }
}

export default Graph;
