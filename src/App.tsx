import React, { useState } from 'react';
import Graph from './Graphs/Graph';
import GraphInputComponent from './Graphs/GraphInputComponent';
import GraphVisualiserComponent from './Graphs/GraphVisualiserComponent';
import GraphMetricsTab from './Graphs/GraphMetricsTab';
import GraphMatricesTab from './Graphs/GraphMatricesTab';
import GraphLocalMetricsTab from './Graphs/GraphLocalMetricsTab';
import GraphSpectrumTab from './Graphs/GraphSpectrumTab';
import { ResizableBox } from 'react-resizable';
import 'react-resizable/css/styles.css';
import useWindowDimensions from "Hooks/useWindowDimensions";

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
    const { width, height } = useWindowDimensions();

    const [topWidth, setTopWidth] = useState(0.5 * width); // Initialize using pixels
    const [topHeight, setTopHeight] = useState(0.5 * height); // Initialize using pixels

    return (
        <div style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
            <div style={{
                backgroundColor: '#333',
                color: '#fff',
                padding: '10px',
                textAlign: 'center',
                fontWeight: 'bold'
            }}>
                Graph Visualization Tool
            </div>
            <div style={{ display: 'flex', height: 'calc(100vh - 40px)' }}>
                <ResizableBox
                    width={topWidth}
                    height={Infinity}
                    axis="x"
                    minConstraints={[100, Infinity]}
                    maxConstraints={[width - 100, Infinity]}
                    onResize={(e, data) => setTopWidth(data.size.width)}
                    resizeHandles={['e']}>
                    <div style={{
                        width: '100%',
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        overflow: 'hidden'
                    }}>
                        <ResizableBox
                            width={Infinity}
                            height={topHeight}
                            axis="y"
                            minConstraints={[Infinity, 100]}
                            maxConstraints={[Infinity, height - 100]}
                            onResize={(e, data) => setTopHeight(data.size.height)}
                            resizeHandles={['s']}
                        ><GraphVisualiserComponent graph={graph} />
                        </ResizableBox>
                        <GraphInputComponent graph={graph} onUpdateGraph={handleUpdateGraph} />
                    </div>
                </ResizableBox>
                <div style={{ flex: 1, padding: '10px', overflowY: 'scroll' }}>
                    <GraphMatricesTab graph={graph} />
                    <GraphMetricsTab graph={graph} />
                    <GraphLocalMetricsTab graph={graph} />
                    <GraphSpectrumTab graph={graph} />
                    {/* Add more tabs here */}
                </div>
            </div>
        </div>
    );
}

export default App;
