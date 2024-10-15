import {create, all, Matrix} from 'mathjs';
import React, { useState, useEffect } from 'react';
import Graph from './Graph';
const math = create(all);

interface GraphInputComponentProps {
    graph: Graph;
    onUpdateGraph: (graph: Graph) => void;
}

const GraphInputComponent: React.FC<GraphInputComponentProps> = ({ graph, onUpdateGraph }) => {
    const [input, setInput] = useState(graph.toString());
    const [presets, setPresets] = useState<{ name: string, content: string }[]>([]);
    const [selectedPreset, setSelectedPreset] = useState<string | null>(null);
    const [isDirected, setIsDirected] = useState(graph.getIsDirected());
    const [matrix, setMatrix] = useState<Matrix>(graph.getAdjacencyMatrix());

    useEffect(() => {
        setInput(graph.toString());
        setIsDirected(graph.getIsDirected());
        setMatrix(graph.getAdjacencyMatrix());
    }, [graph]);

    useEffect(() => {
        const loadPresets = async () => {
            const root = process.env.PUBLIC_URL + '/presets';
            const response = await fetch(root + '/list.json');
            const files = await response.json();
            const presetPromises = files.map(async (file: string) => {
                const response = await fetch(root + `/${file}`);
                const content = await response.text();
                const name = content.split('\n')[0].split(':')[1].trim();
                return { name, content };
            });
            const loadedPresets = await Promise.all(presetPromises);
            setPresets(loadedPresets);
        };
        loadPresets();
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setInput(e.target.value);
    };

    const handleUpdate = () => {
        const newGraph = Graph.stringToGraph(input, isDirected);
        onUpdateGraph(newGraph);
    };

    const handlePresetChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const preset = presets.find(p => p.name === e.target.value);
        if (preset) {
            setSelectedPreset(preset.name);
            setInput(preset.content);
            const newGraph = Graph.stringToGraph(preset.content, isDirected);
            onUpdateGraph(newGraph);
        }
    };

    const handleToggleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const directed = e.target.checked;
        setIsDirected(directed);
        const newGraph = Graph.fromAdjacencyMatrix(graph.getAdjacencyMatrix(), graph.getNodeList(), directed);
        onUpdateGraph(newGraph);
    };

    const handleComplement = () => {
        const newGraph = Graph.fromAdjacencyMatrix(graph.getComplementGraph(), graph.getNodeList(), graph.getIsDirected());
        onUpdateGraph(newGraph);
    };

    const handleToggleWeights = () => {
        const weights = graph.getIsWeighted() ? [] : new Array(graph.getLinkCount()).fill(1);
        const newGraph = Graph.fromAdjacencyMatrix(graph.getAdjacencyMatrix(), graph.getNodeList(), graph.getIsDirected(), weights);
        onUpdateGraph(newGraph);
    };

    const handleMatrixChange = (i: number, j: number) => {
        const newMatrix = matrix;
        newMatrix.set([i, j], newMatrix.get([i, j]) === 0 ? 1 : 0);
        if (!graph.getIsDirected()) {
            newMatrix.set([j, i], newMatrix.get([i, j]));
        }
        setMatrix(newMatrix);
        onUpdateGraph(Graph.fromAdjacencyMatrix(math.matrix(newMatrix), graph.getNodeList(), graph.getIsDirected()));
    };

    return (
        <div style={{ padding: '20px', backgroundColor: '#f9f9f9', border: '1px solid #ccc', height: '100%' }}>
            <h3>Graph Controls</h3>
            <div style={{ marginBottom: '15px' }}>
                <label style={{ marginRight: '10px', fontWeight: 'bold' }}>Select a Preset:</label>
                <select onChange={handlePresetChange} value={selectedPreset || ''} style={{ padding: '5px', borderRadius: '5px', border: '1px solid #ccc' }}>
                    <option value="" disabled>Select a preset</option>
                    {presets.map(preset => (
                        <option key={preset.name} value={preset.name}>{preset.name}</option>
                    ))}
                </select>
            </div>
            <div style={{ marginBottom: '15px' }}>
                <label style={{ marginRight: '10px', fontWeight: 'bold' }}>Directed Graph:</label>
                <input
                    type="checkbox"
                    checked={isDirected}
                    onChange={handleToggleChange}
                    style={{ transform: 'scale(1.5)', marginLeft: '10px' }}
                />
            </div>
            <div style={{ marginBottom: '15px', display: 'flex', gap: '10px' }}>
                <button onClick={handleToggleWeights} style={{ padding: '10px 20px', borderRadius: '5px', border: '1px solid #ccc', backgroundColor: '#ddd' }}>
                    {graph.getIsWeighted() ? "Remove Weights" : "Initialize Weights"}
                </button>
                <button onClick={handleComplement} style={{ padding: '10px 20px', borderRadius: '5px', border: '1px solid #ccc', backgroundColor: '#ddd' }}>
                    Get Complement Graph
                </button>
            </div>
            <button onClick={handleUpdate} style={{ padding: '10px 20px', borderRadius: '5px', border: '1px solid #ccc', backgroundColor: '#ddd', marginBottom: '20px' }}>
                Update Graph
            </button>
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: '20px' }}>
                <div style={{ width: '40%' }}>
                    <h3>Input</h3>
                    <i>Format: i | i,j(:w)<br />i & j are numeric node ids, and w is an edge weight</i>
                    <textarea rows={10} cols={30} value={input} onChange={handleChange} style={{ width: '100%', borderRadius: '5px', border: '1px solid #ccc', marginTop: '10px' }} />
                </div>
                <div style={{ width: '55%' }}>
                    <h3>Adjacency Matrix</h3>
                    <table style={{ borderCollapse: 'collapse' }}>
                        <tbody>
                        {(matrix.toArray() as number[][]).map((row, i) => (
                            <tr key={i}>
                                {row.map((cell, j) => (
                                    <td key={j} style={{ padding: '0px', textAlign: 'center' }}>
                                        <input
                                            type="checkbox"
                                            checked={cell === 1}
                                            onChange={() => handleMatrixChange(i, j)}
                                            disabled={(!graph.getIsDirected() && j < i) || j === i}
                                        />
                                    </td>
                                ))}
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>

    );
};

export default GraphInputComponent;
