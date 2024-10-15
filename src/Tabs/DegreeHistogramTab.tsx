import React, { useState } from 'react';
import CollapsibleTab from './CollapsibleTab';
import { Bar } from 'react-chartjs-2';
import 'chart.js/auto';
import Graph from "Graphs/Graph";

interface GraphDegreeHistogramTabProps {
    graph: Graph;
}

const GraphDegreeHistogramTab: React.FC<GraphDegreeHistogramTabProps> = ({ graph }) => {
    const degrees = graph.getAllDegrees();
    const degreeCounts = degrees.reduce((acc, degree) => {
        acc[degree] = (acc[degree] || 0) + 1;
        return acc;
    }, {} as Record<number, number>);

    const data = {
        labels: Object.keys(degreeCounts),
        datasets: [{
            label: 'Occurances',
            data: Object.values(degreeCounts),
            backgroundColor: 'rgba(75,192,192,0.4)',
            borderColor: 'rgba(75,192,192,1)',
            borderWidth: 1
        }]
    };

    return (
        <CollapsibleTab title="Degree Histogram">
            <div>
                <Bar data={data} options={{ maintainAspectRatio: false }} />
            </div>
            <div>
                <h4>All Degrees</h4>
                <p>{JSON.stringify(degrees)}</p>
            </div>
        </CollapsibleTab>
    );
};

export default GraphDegreeHistogramTab;
