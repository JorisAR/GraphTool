import {all, create, Matrix} from 'mathjs';

const math = create(all);

class Graph {
    private adjacencyMatrix: Matrix;
    private nodeAliasMap: Map<number, number>;
    private nodeList: number[];
    public isDirected: boolean;

    constructor(matrix?: Matrix, nodeList?: number[], isDirected = false) {
        this.adjacencyMatrix = matrix || math.matrix();
        this.nodeAliasMap = new Map();
        this.nodeList = nodeList || [];
        this.isDirected = isDirected;

        if (nodeList) {
            nodeList.forEach((node, index) => {
                this.nodeAliasMap.set(node, index);
            });
        }
    }

    private static createAliasMap(nodes: number[]): Map<number, number> {
        const aliasMap = new Map();
        nodes.forEach((node, index) => {
            aliasMap.set(node, index);
        });
        return aliasMap;
    }

    public static fromNodesAndLinks(nodes: number[], links: [number, number][], isDirected = false): Graph {
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

        return new Graph(adjacencyMatrix as Matrix, nodes, isDirected);
    }

    public static fromAdjacencyMatrix(matrix: Matrix, nodeList: number[], isDirected = false): Graph {
        return new Graph(matrix, nodeList, isDirected);
    }

    public getAdjacencyMatrix(): Matrix {
        return this.adjacencyMatrix;
    }

    public getLaplacianMatrix(): Matrix {
        const size = this.adjacencyMatrix.size()[0];
        const degrees = Array(size).fill(0);

        this.adjacencyMatrix.forEach((value, index) => {
            degrees[index[0]] += value;
        });

        const degreeMatrix = math.diag(degrees) as Matrix;
        return math.subtract(degreeMatrix, this.adjacencyMatrix) as Matrix;
    }

    public getComplementGraph(): Matrix {
        const size = this.adjacencyMatrix.size();
        const I = math.identity(size[0]);
        const J = math.matrix(math.ones(size[0], size[1]));
        const result =  math.matrix(math.subtract(math.subtract(J, I), this.adjacencyMatrix) as Matrix);
        console.log(`result; ${result}`);
        return math.matrix(result);
    }


    public getNodeList(): number[] {
        return this.nodeList;
    }

    public getNodeCount(): number {
        return this.nodeList.length;
    }

    public getLinkCount(): number {
        let count = 0;
        this.adjacencyMatrix.forEach(value => {
            if (value !== 0) count++;
        });
        return this.isDirected ? count : count / 2;
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

    public getSpectralDecomposition(): { X: Matrix, Diag: Matrix } {
        let { eigenvectors } = math.eigs(this.adjacencyMatrix);

        eigenvectors = eigenvectors.sort((a, b) => (b.value as number) - (a.value as number));

        const eigenVectors = eigenvectors.map((obj: any) => obj.vector);
        const Values = eigenvectors.map((obj: any) => obj.value);

        const X = math.round(math.transpose(math.matrix(eigenVectors)), 3) as Matrix;
        const Diag = math.round(math.matrix(math.diag(Values)), 3) as Matrix;

        return { X, Diag };
    }


    public toString(): string {
        const links: [number, number][] = [];
        const nodes = this.nodeList;

        this.adjacencyMatrix.forEach((value, [i, j]) => {
            if (value !== 0 && (this.isDirected || i <= j)) {
                links.push([nodes[i], nodes[j]]);
            }
        });

        const linkStr = links.map(([i, j]) => `${i},${j}`).join('\n');
        return `${nodes.join('\n')}\n${linkStr}`;
    }
}

export default Graph;
