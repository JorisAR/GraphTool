import React from 'react';
import Graph from 'Graphs/Graph';
import CollapsibleTab from 'Tabs/CollapsibleTab';
import { InlineMath } from 'react-katex';
import 'katex/dist/katex.min.css';
import { all, create } from 'mathjs';
import 'bootstrap/dist/css/bootstrap.min.css';
const math = create(all);

interface GraphSpectrumTabProps {
    graph: Graph;
}
const GraphSpectrumTab: React.FC<GraphSpectrumTabProps> = ({ graph }) => {
    const { vectors, values } = graph.getSpectralDecomposition();

    const XString = Graph.LatexMatrix(vectors, 3);
    const DiagString = Graph.LatexMatrix(values, 3);

    return (
        <CollapsibleTab title="Spectrum Matrices">
                <div>
                    <h3>Eigenvector Matrix X</h3>
                    <InlineMath math={XString} />
                </div>
                <div>
                    <h3>Eigenvalue Matrix A</h3>
                    <InlineMath math={DiagString} />
                </div>
        </CollapsibleTab>
    );
};

export default GraphSpectrumTab;