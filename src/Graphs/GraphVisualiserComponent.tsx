import React, { useRef, useEffect } from 'react';
import Graph from './Graph';
import GraphVisualiser from './GraphVisualiser';

interface GraphVisualiserComponentProps {
    graph: Graph;
}

const GraphVisualiserComponent: React.FC<GraphVisualiserComponentProps> = ({ graph }) => {
    const canvasRef = useRef<HTMLDivElement | null>(null);
    const visualiserRef = useRef<GraphVisualiser | null>(null);

    useEffect(() => {
        if (canvasRef.current) {
            visualiserRef.current = new GraphVisualiser(graph, canvasRef.current);
        }

        return () => {
            // Clean up p5 instance on unmount
            visualiserRef.current?.p5Instance.remove();
        };
    }, [graph]);

    useEffect(() => {
        visualiserRef.current?.updateGraph(graph);
    }, [graph]);

    return <div ref={canvasRef} style={{ width: '100%', height: '100%' }} />;
};

export default GraphVisualiserComponent;
