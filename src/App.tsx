import React, { useState } from 'react';
import Graph from './Graphs/Graph';
import GraphInputComponent from './Graphs/GraphInputComponent';
import GraphVisualiserComponent from './Graphs/GraphVisualiserComponent';
import GraphMatrixComponent from './Graphs/GraphMatrixComponent';
import GraphMetricsComponent from "Graphs/GraphMetricsTab";
import GraphMetricsTab from "Graphs/GraphMetricsTab";
import GraphLaplacianTab from "Graphs/GraphLaplacianTab";
import GraphLocalMetricsTab from "Graphs/ReactLocalMetricsTab";

const App: React.FC = () => {
    const initialNodes = [0, 1, 2, 3];
    const initialLinks: [number, number][] = [
        [0, 1],
        [1, 2],
        [2, 3],
        [3, 0],
    ];

    const [graph, setGraph] = useState(Graph.fromNodesAndLinks(initialNodes, initialLinks));
    const [graphString, setGraphString] = useState(graph.toString());

    const handleUpdateGraph = (nodes: number[], links: [number, number][]) => {
        const newGraph = Graph.fromNodesAndLinks(nodes, links);
        setGraph(newGraph);
        setGraphString(newGraph.toString());
    };

    const handleUpdateGraphString = (newGraphString: string) => {
        setGraphString(newGraphString);

        const lines = newGraphString.split('\n').map(line => line.trim()).filter(line => line);
        const nodes = lines.filter(line => !line.includes(',')).map(Number);
        const links = lines.filter(line => line.includes(',')).map(line => {
            const [a, b] = line.split(',').map(Number);
            return [a, b] as [number, number];
        });

        setGraph(Graph.fromNodesAndLinks(nodes, links));
    };

    return (
        <div style={{ display: 'flex', height: '100vh' }}>
            <div style={{ width: '50%', display: 'flex', flexDirection: 'column' }}>
                <div style={{ height: '40%' }}>
                    <GraphVisualiserComponent graph={graph} />
                </div>
                <div style={{ height: '50%' }}>
                    <GraphInputComponent graphString={graphString} onUpdateGraphString={handleUpdateGraphString} />
                    <GraphMatrixComponent graph={graph} onUpdateGraphString={handleUpdateGraphString} />
                </div>
            </div>
            <div style={{ width: '50%', padding: '10px' }}>
                <GraphMetricsTab graph={graph} />
                <GraphLaplacianTab graph={graph} />
                <GraphLocalMetricsTab graph={graph} />
                {/* Add more tabs here */}
            </div>
        </div>
    );
};

export default App;
