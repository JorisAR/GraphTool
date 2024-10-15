import React, { useState } from 'react';
import Graph from 'Graphs/Graph';
import CollapsibleTab from 'Tabs/CollapsibleTab';

interface GraphLocalMetricsTabProps {
    graph: Graph;
}

const GraphLocalMetricsTab: React.FC<GraphLocalMetricsTabProps> = ({ graph }) => {
    const [selectedNode, setSelectedNode] = useState<number | null>(null);

    let degree = 0;

    if(selectedNode !== null) {
        degree = graph.getDegree(selectedNode.valueOf());
    }

    const handleNodeSelect = (node: number) => {
        setSelectedNode(node);
    };

    return (
        <CollapsibleTab title="Local Metrics">
            <div>
                {graph.getNodeList().map(node => (
                    <button
                        key={node}
                        onClick={() => handleNodeSelect(node)}
                        style={{ margin: '5px' }}
                    >
                        Node {node}
                    </button>
                ))}
            </div>
            {selectedNode !== null && (
                <div>
                    <h4>Metrics for Node {selectedNode}</h4>
                    {/* Add specific metrics calculations here for the selected node */}
                    <p>Node degree: {degree}</p>
                </div>
            )}
        </CollapsibleTab>
    );
};

export default GraphLocalMetricsTab;
