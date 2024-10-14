import React from 'react';
import Graph from './Graph';
import CollapsibleTab from './CollapsibleTab';
import { InlineMath } from 'react-katex';
import 'katex/dist/katex.min.css';

interface GraphLaplacianTabProps {
    graph: Graph;
}

const GraphLaplacianTab: React.FC<GraphLaplacianTabProps> = ({ graph }) => {
    const laplacianMatrix = graph.getLaplacianMatrix().toArray() as number[][];
    const latexString = `\\begin{bmatrix} ${laplacianMatrix.map(row => row.join(' & ')).join(' \\\\ ')} \\end{bmatrix}`;

    return (
        <CollapsibleTab title="Laplacian Matrix">
            <InlineMath math={latexString} />
        </CollapsibleTab>
    );
};

export default GraphLaplacianTab;
