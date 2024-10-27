import React, { useState } from 'react';
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import GraphVisualiserComponent from "Graphs/GraphVisualiserComponent";
import GraphInputComponent from "Graphs/GraphInputComponent";
import GraphMatricesTab from "Tabs/GraphMatricesTab";
import GraphMetricsTab from "Tabs/GraphMetricsTab";
import GraphLocalMetricsTab from "Tabs/GraphLocalMetricsTab";
import GraphSpectrumPlotTab from "Tabs/GraphSpectrumSplotTab";
import GraphSpectrumTab from "Tabs/GraphSpectrumTab";
import DegreeHistogramTab from "Tabs/DegreeHistogramTab";
import Graph from "Graphs/Graph";
import ElectricalTab from "Tabs/ElectricalTab";

const initialNodes = [0, 1, 2, 3];
const initialLinks: [number, number][] = [
    [0, 1],
    [1, 2],
    [2, 3],
    [3, 0],
];
const initialGraph = Graph.fromNodesAndLinks(initialNodes, initialLinks, false);

const GraphTool: React.FC = () => {
    const [graph, setGraph] = useState(initialGraph);

    const handleUpdateGraph = (graph: Graph) => {
        setGraph(graph);
    };

    return (
        <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', height: 'calc(100vh - 40px)' }}>
                <PanelGroup direction="horizontal">
                    <Panel defaultSize={65} minSize={10}>
                        <PanelGroup direction="vertical">
                            <Panel defaultSize={50} minSize={10}>
                                <GraphVisualiserComponent graph={graph} />
                            </Panel>
                            <PanelResizeHandle />
                            <Panel minSize={10}>
                                <div style={{ height: '5px', width: '100%', backgroundColor: '#333' }}></div>
                                <GraphInputComponent graph={graph} onUpdateGraph={handleUpdateGraph} />
                            </Panel>
                        </PanelGroup>
                    </Panel>
                    <PanelResizeHandle />
                    <Panel minSize={10}>
                        <div style={{ display: 'flex', height: '100%', overflow: 'hidden' }}>
                            <div style={{ width: '5px', height: '100%', backgroundColor: '#333' }}></div>
                            <div style={{ flex: 1, padding: '10px', overflowY: 'auto', height: '100%' }}>
                                <GraphMatricesTab graph={graph} />
                                <GraphMetricsTab graph={graph} />
                                <GraphLocalMetricsTab graph={graph} />
                                <GraphSpectrumPlotTab graph={graph} />
                                <GraphSpectrumTab graph={graph} />
                                <DegreeHistogramTab graph={graph} />
                                <ElectricalTab graph={graph} />
                                {/* Add more tabs here */}
                            </div>
                        </div>
                    </Panel>
                </PanelGroup>
            </div>
        </div>
    );
};

export default GraphTool;
