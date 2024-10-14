import React from 'react';
import Graph from './Graph';
import CollapsibleTab from './CollapsibleTab';
import { InlineMath } from 'react-katex';
import 'katex/dist/katex.min.css';

interface GraphLaplacianTabProps {
    graph: Graph;
}

const GraphMatricesTab: React.FC<GraphLaplacianTabProps> = ({ graph }) => {
    const laplacianMatrix = graph.getLaplacianMatrix().toArray() as number[][];
    const laplacianString = `\\begin{bmatrix} ${laplacianMatrix.map(row => row.join(' & ')).join(' \\\\ ')} \\end{bmatrix}`;
    const adjacencyMatrix = graph.getAdjacencyMatrix().toArray() as number[][];
    const adjacencyString = `\\begin{bmatrix} ${adjacencyMatrix.map(row => row.join(' & ')).join(' \\\\ ')} \\end{bmatrix}`;

    return (
        <CollapsibleTab title="Matrices">
            <div>
            <div>
                <h3>Adjacency Matrix</h3>
                <InlineMath math={adjacencyString} />
            </div>
            <div>
                <h3>Laplacian Matrix</h3>
                <InlineMath math={laplacianString} />
            </div>
            </div>
        </CollapsibleTab>
    );
};

export default GraphMatricesTab;
