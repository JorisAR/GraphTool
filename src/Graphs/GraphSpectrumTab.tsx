import React from 'react';
import Graph from './Graph';
import CollapsibleTab from './CollapsibleTab';
import { InlineMath } from 'react-katex';
import 'katex/dist/katex.min.css';

interface GraphSpectrumTabProps {
    graph: Graph;
}

const GraphSpectrumTab: React.FC<GraphSpectrumTabProps> = ({ graph }) => {
    const { X, Diag } = graph.getSpectralDecomposition();


    const XString = `\\begin{bmatrix} ${(X.toArray() as number[][]).map(row => row.join(' & ')).join(' \\\\ ')} \\end{bmatrix}`;
    const DiagString = `\\begin{bmatrix} ${(Diag.toArray() as number[][]).map(row => row.join(' & ')).join(' \\\\ ')} \\end{bmatrix}`;

    return (
        <CollapsibleTab title="Spectrum Matrices">
            <div>
                <div>
                    <h3>Eigenvector Matrix X</h3>
                    <InlineMath math={XString} />
                </div>
                <div>
                    <h3>Eigenvalue Matrix A</h3>
                    <InlineMath math={DiagString} />
                </div>
            </div>
        </CollapsibleTab>
    );
};

export default GraphSpectrumTab;
