import React, { useState } from 'react';
import Graph from 'Graphs/Graph';
import CollapsibleTab from 'Tabs/CollapsibleTab';
import { InlineMath } from 'react-katex';
import 'katex/dist/katex.min.css';
import { Line } from 'react-chartjs-2';
import { all, create } from 'mathjs';
import { Dropdown } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { DensityPlot} from "Components/DensityPlot";
const math = create(all);

interface GraphSpectrumTabProps {
    graph: Graph;
}
const GraphSpectrumPlotTab: React.FC<GraphSpectrumTabProps> = ({ graph }) => {
    const [viewMode, setViewMode] = useState('eigenvalues');
    const { vectors, values } = graph.getSpectralDecomposition();
    const eigenValues = (values.toArray() as number[][]).map((row: number[], index) => Math.abs(row[index]));
    const transposedVectors = math.transpose(vectors).toArray() as number[][];

    function pseudoRandom(n: number) {
        return 0.5 * (math.sin(n * 423876387) + 1);
    }

    const eigenvalueData = {
        labels: eigenValues.map((_, index) => `${index + 1}`),
        datasets: [{
            label: 'Eigenvalues',
            data: eigenValues,
            borderColor: 'rgba(75,192,192,1)',
            borderWidth: 1,
            fill: false,
            tension: 0.1
        }]
    };

    const eigenvectorData = {
        labels: eigenValues.map((value, index) => value.toString()),
        datasets: transposedVectors.map((vector, index) => ({
            label: `Eigenvector ${index + 1}`,
            data: vector,
            borderColor: `rgba(${pseudoRandom(eigenValues[index] + 87634786563) * 255}, ${pseudoRandom(eigenValues[index] + 9283749832) * 255}, ${pseudoRandom(eigenValues[index] + 958347) * 255}, 1)`,
            borderWidth: 1,
            fill: false,
            tension: 0.1
        }))
    };

    const options = {
        scales: {
            y: {
                beginAtZero: true
            }
        }
    };

    return (
        <CollapsibleTab title="Spectrum Plots">
            <div>
                <select onChange={(e) => setViewMode(e.target.value)}>
                    <option value="eigenvalues">Eigenvalues</option>
                    <option value="eigenvectors">Eigenvectors</option>
                    <option value="density">Eigenvalue Density</option>
                </select><br/>
                {viewMode === 'eigenvalues' && <Line data={eigenvalueData} options={options} />}
                {viewMode === 'eigenvectors' && <Line data={eigenvectorData} options={options} />}
                {viewMode === 'density' && <DensityPlot width={600} height={400} data={eigenValues} />}
                    </div>
        </CollapsibleTab>
    );
};

export default GraphSpectrumPlotTab;