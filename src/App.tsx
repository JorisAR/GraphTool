import React, { useState } from 'react';
import Graph from './Graphs/Graph';
import GraphInputComponent from './Graphs/GraphInputComponent';
import GraphVisualiserComponent from './Graphs/GraphVisualiserComponent';
import GraphMatrixComponent from './Graphs/GraphMatrixComponent';
import GraphMetricsComponent from "Graphs/GraphMetricsTab";
import GraphMetricsTab from "Graphs/GraphMetricsTab";
import GraphMatricesTab from "Graphs/GraphMatricesTab";
import GraphLocalMetricsTab from "Graphs/GraphLocalMetricsTab";
import GraphSpectrumTab from "Graphs/GraphSpectrumTab";
import {boolean} from "mathjs";

const App: React.FC = () => {
    const initialNodes = [0, 1, 2, 3];
    const initialLinks: [number, number][] = [
        [0, 1],
        [1, 2],
        [2, 3],
        [3, 0],
    ];

    const [graph, setGraph] = useState(Graph.fromNodesAndLinks(initialNodes, initialLinks));

    const handleUpdateGraph = (graph: Graph) => {
        setGraph(graph);
    };

    return (
        <div style={{ display: 'flex', height: '100vh' }}>
            <div style={{ width: '50%', display: 'flex', flexDirection: 'column' }}>
                <div>
                    <h1 style={{textAlign: "center"}}>
                        Graph Visualization Tool
                    </h1>
                </div>
                <div style={{ height: '40%' }}>
                    <GraphVisualiserComponent graph={graph} />
                </div>
                <div style={{ height: '50%' }}>
                    <GraphInputComponent graph={graph} onUpdateGraph={handleUpdateGraph} />
                    <GraphMatrixComponent graph={graph} onUpdateGraph={handleUpdateGraph} />
                </div>
            </div>
            <div style={{ width: '50%', padding: '10px' }}>
                <GraphMatricesTab graph={graph} />
                <GraphMetricsTab graph={graph} />
                <GraphLocalMetricsTab graph={graph} />
                <GraphSpectrumTab graph={graph} />
                {/* Add more tabs here */}
            </div>
        </div>
    );
};

export default App;
