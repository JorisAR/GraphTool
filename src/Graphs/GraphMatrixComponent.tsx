import {create, all, Matrix, MathArray, forEach, MathCollection} from 'mathjs';
import React, { useState, useEffect } from 'react';
import Graph from './Graph';

const math = create(all);

interface GraphMatrixComponentProps {
    graph: Graph;
    onUpdateGraph: (graph: Graph) => void;
}

const GraphMatrixComponent: React.FC<GraphMatrixComponentProps> = ({ graph, onUpdateGraph }) => {
    const [matrix, setMatrix] = useState<number[][]>(graph.getAdjacencyMatrix().toArray() as number[][]);
    const [nodes, setNodes] = useState<number[]>(graph.getNodeList());

    useEffect(() => {
        setMatrix(graph.getAdjacencyMatrix().toArray() as number[][]);
        setNodes(graph.getNodeList());
    }, [graph]);

    const handleMatrixChange = (i: number, j: number) => {
        const newMatrix = [...matrix];
        newMatrix[i][j] = newMatrix[i][j] === 0 ? 1 : 0;
        if (!graph.getIsDirected()) {
            newMatrix[j][i] = newMatrix[i][j];
        }
        setMatrix(newMatrix);
        onUpdateGraph(Graph.fromAdjacencyMatrix(math.matrix(newMatrix), graph.getNodeList(), graph.getIsDirected()));
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
        onUpdateGraph(Graph.fromAdjacencyMatrix(math.matrix(newMatrix), newNodes, graph.getIsDirected()));
    };

    const handleRemoveNode = (index: number) => {
        const newNodes = nodes.filter((_, i) => i !== index);
        setNodes(newNodes);
        const newMatrix = matrix.filter((_, i) => i !== index).map(row => row.filter((_, j) => j !== index));
        setMatrix(newMatrix);
        onUpdateGraph(Graph.fromAdjacencyMatrix(math.matrix(newMatrix), newNodes, graph.getIsDirected()));
    };

    const handleComplement = () => {
        const newGraph = Graph.fromAdjacencyMatrix(graph.getComplementGraph(), nodes, graph.getIsDirected());
        onUpdateGraph(newGraph);
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
                                        type="checkbox"
                                        checked={cell === 1}
                                        onChange={() => handleMatrixChange(i, j)}
                                        disabled={!graph.getIsDirected() && j < i || j === i}
                                    />
                                </td>
                            ))}
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default GraphMatrixComponent;
