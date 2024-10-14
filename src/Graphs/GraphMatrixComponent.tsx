import {create, all, Matrix, MathArray, forEach, MathCollection} from 'mathjs';
import React, { useState, useEffect } from 'react';
import Graph from './Graph';

const math = create(all);

interface GraphMatrixComponentProps {
    graph: Graph;
    onUpdateGraphString: (graphString: string, isDirected: boolean) => void;
}

const GraphMatrixComponent: React.FC<GraphMatrixComponentProps> = ({ graph, onUpdateGraphString }) => {
    const [matrix, setMatrix] = useState<number[][]>([]);
    const [nodes, setNodes] = useState<number[]>([]);

    useEffect(() => {
        setMatrix(graph.getAdjacencyMatrix().toArray() as number[][]);
        setNodes(graph.getNodeList());
    }, [graph]);

    const handleMatrixChange = (e: React.ChangeEvent<HTMLInputElement>, i: number, j: number) => {
        const newMatrix = [...matrix];
        newMatrix[i][j] = Number(e.target.value);
        if (!graph.isDirected) {
            newMatrix[j][i] = Number(e.target.value);
        }
        setMatrix(newMatrix);
    };

    const handleNodesChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
        const newNodes = [...nodes];
        newNodes[index] = Number(e.target.value);
        setNodes(newNodes);
    };

    const handleAddNode = () => {
        const newNodes = [...nodes, nodes.length];
        setNodes(newNodes);

        const newMatrix = matrix.map(row => [...row, 0]);
        newMatrix.push(Array(newNodes.length).fill(0));
        setMatrix(newMatrix);

        onUpdateGraphString(Graph.fromAdjacencyMatrix(math.matrix(newMatrix), newNodes, graph.isDirected).toString(), graph.isDirected);
    };

    const handleRemoveNode = (index: number) => {
        const newNodes = nodes.filter((_, i) => i !== index);
        setNodes(newNodes);

        const newMatrix = matrix.filter((_, i) => i !== index).map(row => row.filter((_, j) => j !== index));
        setMatrix(newMatrix);

        onUpdateGraphString(Graph.fromAdjacencyMatrix(math.matrix(newMatrix), newNodes, graph.isDirected).toString(), graph.isDirected);
    };

    const handleUpdate = () => {
        const newLinks: [number, number][] = [];
        for (let i = 0; i < matrix.length; i++) {
            for (let j = 0; j < matrix[i].length; j++) {
                if (matrix[i][j] !== 0) {
                    newLinks.push([nodes[i], nodes[j]]);
                }
            }
        }
        const newGraph = Graph.fromNodesAndLinks(nodes, newLinks, graph.isDirected);
        onUpdateGraphString(newGraph.toString(), graph.isDirected);
    };

    const handleComplement = () => {
        const newGraph = Graph.fromAdjacencyMatrix(graph.getComplementGraph(), nodes, graph.isDirected);
        onUpdateGraphString(newGraph.toString(), graph.isDirected);
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <div style={{ width: '25%' }}>
                <button onClick={handleComplement}>Get Complement Graph</button>
                <h3>Nodes</h3>
                <ul style={{ listStyleType: 'none', paddingLeft: 0 }}>
                    {nodes.map((node, index) => (
                        <li key={index} style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                            <input
                                type="number"
                                value={node}
                                onChange={(e) => handleNodesChange(e, index)}
                                style={{ marginRight: '10px' }}
                                disabled={true}
                            />
                            <button onClick={() => handleRemoveNode(index)}>Remove</button>
                        </li>
                    ))}
                </ul>
                <button onClick={handleAddNode}>Add Node</button>
                {/*<button onClick={handleUpdate}>Update Graph</button>*/}
            </div>
            <div style={{ width: '75%' }}>
                <h3>Adjacency Matrix</h3>
                <table>
                    <tbody>
                    {matrix.map((row, i) => (
                        <tr key={i}>
                            {row.map((cell, j) => (
                                <td key={j}>
                                    <input
                                        type="number"
                                        value={cell}
                                        onChange={(e) => handleMatrixChange(e, i, j)}
                                        style={{ width: '40px' }}
                                        disabled={!graph.isDirected && j < i || j === i}
                                    />
                                </td>
                            ))}
                        </tr>
                    ))}
                    </tbody>
                </table>
                <button onClick={handleUpdate}>Update Graph</button>
            </div>

        </div>
    );
};

export default GraphMatrixComponent;
