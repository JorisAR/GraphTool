import React, { useState } from 'react';
import Graph from 'Graphs/Graph';
import CollapsibleTab from 'Tabs/CollapsibleTab';

interface GraphLocalMetricsTabProps {
    graph: Graph;
}

const GraphLocalMetricsTab: React.FC<GraphLocalMetricsTabProps> = ({ graph }) => {
    const [selectedNode, setSelectedNode] = useState<number | null>(null);

    let degree = 0;
    let clusteringCoefficient = 0;
    let betweenness = 0;

    if (selectedNode !== null) {
        degree = graph.getDegree(selectedNode.valueOf());
        clusteringCoefficient = graph.calculateClusteringCoefficient(selectedNode);
        betweenness = graph.calculateBetweenness(selectedNode);
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
                    <p>Node degree: {degree}</p>
                    <p>Clustering Coefficient: {clusteringCoefficient.toFixed(4)}</p>
                    <p>Betweenness Centrality: {betweenness.toFixed(4)}</p>
                </div>
            )}
        </CollapsibleTab>
    );
};

export default GraphLocalMetricsTab;
