import React, { useState } from 'react';
import Graph from 'Graphs/Graph';
import CollapsibleTab from 'Tabs/CollapsibleTab';
import { InlineMath } from 'react-katex';
import 'katex/dist/katex.min.css';

interface GraphLaplacianTabProps {
    graph: Graph;
}

const GraphMatricesTab: React.FC<GraphLaplacianTabProps> = ({ graph }) => {
    const [adjacencyPower, setAdjacencyPower] = useState(1);

    const laplacianString = Graph.LatexMatrix(graph.getLaplacianMatrix(false));
    const adjacencyString = Graph.LatexMatrix(graph.getRaisedAdjacencyMatrix(adjacencyPower));
    const incidenceString = Graph.LatexMatrix(graph.getIncidenceMatrix());
    const degreeString = Graph.LatexMatrix(graph.getDegreeMatrix(false));
    const weightsString = Graph.LatexMatrix(graph.getWeightMatrix());
    const weightedPseudoInverseString = Graph.LatexMatrix(graph.getPseudoInverse(true), 3);
    const modularityString = Graph.LatexMatrix(graph.getModularityMatrix(), 3);

    return (
        <CollapsibleTab title="Matrices">
            <div>
                <div>
                    <label>
                        Adjacency Power (k):
                        <input
                            type="range"
                            min="1"
                            max="10"
                            value={adjacencyPower}
                            onChange={(e) => setAdjacencyPower(parseInt(e.target.value))}
                        />
                        {adjacencyPower}
                    </label>
                </div>
                <div>
                    <h3>Adjacency Matrix A^<InlineMath math={`{${adjacencyPower}}`} /></h3>
                    <InlineMath math={adjacencyString} />
                </div>
                <div>
                    <h3>Degree Matrix D</h3>
                    <InlineMath math={degreeString} />
                </div>
                <div>
                    <h3>Laplacian Matrix Q</h3>
                    <InlineMath math={laplacianString} />
                </div>
                <div>
                    <h3>Weights Matrix Delta</h3>
                    <InlineMath math={weightsString} />
                </div>
                <div>
                    <h3>Incidence Matrix B</h3>
                    <InlineMath math={incidenceString} />
                </div>
                <div>
                    <h3>PseudoInverse Matrix Q</h3>
                    <InlineMath math={weightedPseudoInverseString} />
                </div>
                <div>
                    <h3>Modularity Matrix M</h3>
                    <InlineMath math={modularityString} />
                </div>
            </div>
        </CollapsibleTab>
    );
};

export default GraphMatricesTab;
