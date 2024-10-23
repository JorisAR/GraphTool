import React from 'react';
import Graph from 'Graphs/Graph';
import CollapsibleTab from 'Tabs/CollapsibleTab';
import { InlineMath } from 'react-katex';
import 'katex/dist/katex.min.css';
import { Line } from 'react-chartjs-2';

interface GraphSpectrumTabProps {
    graph: Graph;
}

const GraphSpectrumTab: React.FC<GraphSpectrumTabProps> = ({ graph }) => {
    const { vectors, values } = graph.getSpectralDecomposition();
    const eigenValues = (values.toArray() as number[][]).map((row: number[], index) => Math.abs(row[index]));

    const data = {
        labels: eigenValues.map((_, index) => `${index + 1}`),
        datasets: [{
            label: 'Eigenvalues',
            data: eigenValues,
            borderColor: 'rgba(75,192,192,1)',
            borderWidth: 1,
            fill: false,
            tension: 0.1 // Tension to make the line smooth
        }]
    };

    const options = {
        scales: {
            y: {
                beginAtZero: true // Ensure y-axis starts at 0
            }
        }
    };

    const XString = Graph.LatexMatrix(vectors, 3);
    const DiagString = Graph.LatexMatrix(values, 3);

    return (
        <CollapsibleTab title="Spectrum Matrices">
            <div>
                <Line data={data} options={options} />
            </div>
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
