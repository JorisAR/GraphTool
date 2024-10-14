import React, { useState, useEffect } from 'react';

interface GraphInputComponentProps {
    graphString: string;
    onUpdateGraphString: (graphString: string, isDirected: boolean) => void;
}

const GraphInputComponent: React.FC<GraphInputComponentProps> = ({ graphString, onUpdateGraphString }) => {
    const [input, setInput] = useState(graphString);
    const [presets, setPresets] = useState<{ name: string, content: string }[]>([]);
    const [selectedPreset, setSelectedPreset] = useState<string | null>(null);
    const [isDirected, setIsDirected] = useState(false);

    useEffect(() => {
        setInput(graphString);
    }, [graphString]);

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
        onUpdateGraphString(input, isDirected);
    };

    const handlePresetChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const preset = presets.find(p => p.name === e.target.value);
        if (preset) {
            setSelectedPreset(preset.name);
            setInput(preset.content);
            onUpdateGraphString(preset.content, isDirected);
        }
    };

    const handleToggleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setIsDirected(e.target.checked);
        onUpdateGraphString(graphString, e.target.checked);
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
