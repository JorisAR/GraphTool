import React, { useState } from 'react';
import { GraphGenerator } from './GraphGenerator';
import { GraphGeneratorErdosRenyi } from './GraphGeneratorErdosRenyi';
import Graph from "Graphs/Graph";
import {GraphGeneratorSmallWorld} from "GraphGenerator/GraphGeneratorSmallWorld";
import {GraphGeneratorLine} from "GraphGenerator/LineGraphGenerator";
import {GraphGeneratorStar} from "GraphGenerator/StarGraphGenerator";
import {GraphGeneratorTree} from "GraphGenerator/TreeGraphGenerator";
import {GraphGeneratorFullyConnected} from "GraphGenerator/FullyConnectedGraphGenerator";
import {GraphGeneratorBarabasiAlbert} from "GraphGenerator/BarabasiAlbertGraphGenerator";
import "./Popup.css"
import {GraphGeneratorLattice} from "GraphGenerator/GraphGeneratorLattice";

const GraphGeneratorPopup: React.FC<{ onClose: () => void, onUpdateGraph: (graph: Graph) => void }> = ({ onClose, onUpdateGraph }) => {
    const [selectedGenerator, setSelectedGenerator] = useState<GraphGenerator | null>(null);
    const [generatorSettings, setGeneratorSettings] = useState({});

    const graphGenerators = [
        new GraphGeneratorLine(),
        new GraphGeneratorStar(),
        new GraphGeneratorTree(),
        new GraphGeneratorFullyConnected(),
        new GraphGeneratorLattice(),
        new GraphGeneratorStar(),
        new GraphGeneratorErdosRenyi(),
        new GraphGeneratorSmallWorld(),
        new GraphGeneratorBarabasiAlbert(),
        // Add other graph generators here
    ];

    const handleSettingsUpdate = (name: string, value: any) => {
        setGeneratorSettings(prev => ({ ...prev, [name]: value }));
    };

    const handleGenerate = () => {
        if (selectedGenerator) {
            const newGraph = selectedGenerator.generate(); // Assume generate method returns the new Graph object
            onUpdateGraph(newGraph);
            onClose();
        }
    };

    return (
        <div className="popup-overlay">
            <div className="popup-content">
                <h3>Generate Graph</h3>
                <label>
                    Graph Type:
                    <select onChange={(e) => {
                        const generator = graphGenerators[parseInt(e.target.value)];
                        setSelectedGenerator(generator);
                    }}>
                        <option value="">Select a type</option>
                        {graphGenerators.map((generator, index) => (
                            <option key={index} value={index}>{generator.getName()}</option>
                        ))}
                    </select>
                </label>
                {selectedGenerator && selectedGenerator.getUI(handleSettingsUpdate)}
                {selectedGenerator && <br/>}
                {selectedGenerator && <button onClick={handleGenerate}>Generate</button>}
                <button onClick={onClose}>Cancel</button>
            </div>
        </div>
    );
};

export default GraphGeneratorPopup;
