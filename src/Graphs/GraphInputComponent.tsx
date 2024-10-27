import {create, all, Matrix} from 'mathjs';
import React, { useState, useEffect } from 'react';
import Graph from './Graph';
import GraphGeneratorPopup from "GraphGenerator/GraphGeneratorPopup";
const math = create(all);

interface GraphInputComponentProps {
    graph: Graph;
    onUpdateGraph: (graph: Graph) => void;
}

const GraphInputComponent: React.FC<GraphInputComponentProps> = ({ graph, onUpdateGraph }) => {
    const [input, setInput] = useState(graph.toString());
    const [presets, setPresets] = useState<{ name: string, content: string, directed: boolean }[]>([]);
    const [selectedPreset, setSelectedPreset] = useState<string | null>(null);
    const [isDirected, setIsDirected] = useState(graph.getIsDirected());
    const [matrix, setMatrix] = useState<Matrix>(graph.getAdjacencyMatrix());
    const [isPopupOpen, setIsPopupOpen] = useState(false);

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
                const lines = content.split('\n');
                let name = "";
                let directed = false;
                for (const line of lines) {
                    const contentParts = line.split(':');
                    if (contentParts.length >= 2) {
                        if (contentParts[0].trim().toLowerCase() === "name")
                            name = contentParts[1].trim();
                        if (contentParts[0].trim().toLowerCase() === "directed")
                            directed = contentParts[1].trim() === "true";
                    }
                }
                return { name, content, directed };
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
            const newGraph = Graph.stringToGraph(preset.content, preset.directed);
            setSelectedPreset(preset.name);
            setInput(preset.content);
            setIsDirected(preset.directed);
            onUpdateGraph(newGraph);
        }
    };



    const handleToggleDirected = () => {
        const directed = !graph.getIsDirected();
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

    const handleOpenPopup = () => {
        setIsPopupOpen(true);
    };

    const handleClosePopup = () => {
        setIsPopupOpen(false);
    };

    return (
        <div style={{ padding: '20px', backgroundColor: '#f9f9f9', border: '1px solid #ccc', height: '100%', overflow:'scroll' }}>

            <div style={{ display: 'flex', justifyContent: 'space-between', gap: '20px' }}>
                <div style={{ width: '20%' }}>
                    <i>Format: i | i,j(:w)<br />i & j are numeric node ids, and w is an edge weight</i><br/>
                    <button onClick={handleUpdate} style={{ padding: '2px 2px', borderRadius: '5px', border: '1px solid #ccc', backgroundColor: '#ddd', marginBottom: '00px', width: '100%' }}>
                        Update Graph
                    </button><br/>
                    <textarea rows={10} cols={30} value={input} onChange={handleChange} style={{ resize: 'vertical', width: '100%', height: '100%', borderRadius: '5px', border: '1px solid #ccc', marginTop: '00px' }} />
                </div>
                <div style={{ width: '20%' }}>
                    <div style={{ marginBottom: '-15px', width: '100%', padding: '10px 00px', borderRadius: '5px', textAlign: 'center' }}>
                        <h3> Graph Settings</h3>
                    </div>
                    <select onChange={handlePresetChange} value={''} style={{ marginBottom: '5px', width: '100%', padding: '5px', borderRadius: '5px', border: '1px solid #ccc', backgroundColor: '#555', color:'#fff' }}>
                        <option value="" disabled>Select a preset</option>
                        {presets.map(preset => (
                            <option key={preset.name} value={preset.name}>{preset.name}</option>
                        ))}
                    </select>
                    <br/>

                    <button onClick={handleOpenPopup} style={{ marginBottom: '5px', width: '100%', padding: '10px 20px', borderRadius: '5px', border: '1px solid #ccc', backgroundColor: '#555', color:'#fff' }}>Open Generator</button>
                    {isPopupOpen && <GraphGeneratorPopup onClose={handleClosePopup} onUpdateGraph={onUpdateGraph} />}

                    <button onClick={handleToggleDirected} style={{ marginBottom: '5px', width: '100%', padding: '10px 20px', borderRadius: '5px', border: '1px solid #ccc', backgroundColor: '#ddd' }}>
                        {graph.getIsDirected() ? "Make Undirected" : "Make Directed"}
                    </button><br/>
                    <button onClick={handleToggleWeights} style={{ marginBottom: '5px', width: '100%', padding: '10px 20px', borderRadius: '5px', border: '1px solid #ccc', backgroundColor: '#ddd' }}>
                        {graph.getIsWeighted() ? "Remove Weights" : "Initialize Weights"}
                    </button><br/>
                    <button onClick={handleComplement} style={{ marginBottom: '5px', width: '100%', padding: '10px 20px', borderRadius: '5px', border: '1px solid #ccc', backgroundColor: '#ddd' }}>
                        Get Complement Graph
                    </button>
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
