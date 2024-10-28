import React from 'react';
import Graph from 'Graphs/Graph';
import CollapsibleTab from 'Tabs/CollapsibleTab';

interface GraphMetricsTabProps {
    graph: Graph;
}

const GraphMetricsTab: React.FC<GraphMetricsTabProps> = ({ graph }) => {
    const nodeCount = graph.getNodeCount();
    const linkCount = graph.getLinkCount();
    const clusteringCoefficient = graph.getClusteringCoefficient();
    const averageDegree = graph.getAverageDegree();
    const diameter = graph.getDiameter();
    const algebraicConnectivity = graph.calculateAlgebraicConnectivity();
    const triangleCount = graph.getTriangleCount();
    const betweennessCentrality = graph.calculateAverageBetweenness(); // Add this line

    return (
        <CollapsibleTab title="Global Metrics">
            <p>Node Count: {nodeCount}</p>
            <p>Link Count: {linkCount}</p>
            <p>Diameter: {diameter}</p>
            <p>Clustering Coefficient: {clusteringCoefficient.toFixed(3)}</p>
            <p>Average Degree: {averageDegree.toFixed(3)}</p>
            <p>Algebraic Connectivity: {algebraicConnectivity.toFixed(3)}</p>
            <p>Triangle Count: {triangleCount}</p>
            <p>Average Betweenness: {betweennessCentrality}</p>
        </CollapsibleTab>
    );
};

export default GraphMetricsTab;
