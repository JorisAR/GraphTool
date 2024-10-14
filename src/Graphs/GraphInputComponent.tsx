import React, { useState, useEffect } from 'react';
import Graph from "Graphs/Graph";

interface GraphInputComponentProps {
    graph: Graph;
    onUpdateGraph: (graph: Graph) => void;
}

const GraphInputComponent: React.FC<GraphInputComponentProps> = ({ graph, onUpdateGraph }) => {
    const [input, setInput] = useState(graph.toString());
    const [presets, setPresets] = useState<{ name: string, content: string }[]>([]);
    const [selectedPreset, setSelectedPreset] = useState<string | null>(null);
    const [isDirected, setIsDirected] = useState(graph.getIsDirected());

    useEffect(() => {
        setInput(graph.toString());
        setIsDirected(graph.getIsDirected());
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

    const stringToGraph = (newGraphString: string, isDirected: boolean) => {
        const lines = newGraphString.split('\n').map(line => line.trim()).filter(line => line);
        const nodes = lines.filter(line => !line.includes(',') && !isNaN(Number(line))).map(Number);
        const links = lines.filter(line => line.includes(',')).map(line => {
            const [a, b] = line.split(',').map(Number);
            return [a, b] as [number, number];
        });
        let result = Graph.fromNodesAndLinks(nodes, links, isDirected);
        result.makeSymmetric();
        return result;
    };

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setInput(e.target.value);
    };

    const handleUpdate = () => {
        const newGraph = stringToGraph(input, isDirected);
        onUpdateGraph(newGraph);
    };

    const handlePresetChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const preset = presets.find(p => p.name === e.target.value);
        if (preset) {
            setSelectedPreset(preset.name);
            setInput(preset.content);
            const newGraph = stringToGraph(preset.content, isDirected);
            onUpdateGraph(newGraph);
        }
    };

    const handleToggleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const directed = e.target.checked;
        setIsDirected(directed);
        const newGraph = Graph.fromAdjacencyMatrix(graph.getAdjacencyMatrix(), graph.getNodeList(), directed);
        onUpdateGraph(newGraph);
    };

    return (
        <div>
            <h3>Input</h3>
            <select onChange={handlePresetChange} value={''}>
                <option value="" disabled>Select a preset</option>
                {presets.map(preset => (
                    <option key={preset.name} value={preset.name}>{preset.name}</option>
                ))}
            </select>
            <br/>
            <label>
                Directed Graph:
                <input
                    type="checkbox"
                    checked={isDirected}
                    onChange={handleToggleChange}
                />
            </label>
            <br/>
            <button onClick={handleUpdate}>Update Graph</button>
            <br/>
            <textarea rows={10} cols={30} value={input} onChange={handleChange} />
        </div>
    );
};

export default GraphInputComponent;
