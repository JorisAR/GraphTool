import React, { useState, useEffect } from 'react';

interface GraphInputComponentProps {
    graphString: string;
    onUpdateGraphString: (graphString: string) => void;
}

const GraphInputComponent: React.FC<GraphInputComponentProps> = ({ graphString, onUpdateGraphString }) => {
    const [input, setInput] = useState(graphString);

    useEffect(() => {
        setInput(graphString);
    }, [graphString]);

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setInput(e.target.value);
    };

    const handleUpdate = () => {
        onUpdateGraphString(input);
    };

    return (
        <div>
            <h3>Input</h3>
            <textarea rows={10} cols={30} value={input} onChange={handleChange} />
            <button onClick={handleUpdate}>Update Graph</button>
        </div>
    );
};

export default GraphInputComponent;
