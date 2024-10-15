import React, { useRef, useEffect } from 'react';
import Graph from './Graph';
import GraphVisualiser from './GraphVisualiser';
import styles from "mystyle.module.css";

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
    }, []);

    useEffect(() => {
        visualiserRef.current?.updateGraph(graph);
    }, [graph]);

    useEffect(() => {
        const handleResize = () => {
            if (visualiserRef.current && canvasRef.current) {
                const { clientWidth, clientHeight } = canvasRef.current;
                visualiserRef.current.p5Instance.resizeCanvas(clientWidth, clientHeight);
            }
        };

        const resizeObserver = new ResizeObserver(() => {
            window.requestAnimationFrame(handleResize);
        });
        if (canvasRef.current) {
            resizeObserver.observe(canvasRef.current);
        }

        return () => {
            if (canvasRef.current) {
                resizeObserver.unobserve(canvasRef.current);
            }
        };
    }, []);

    return <div ref={canvasRef} style={{ width: '100%', height: '100%' }} className={styles.GraphWindow} />;
};

export default GraphVisualiserComponent;
