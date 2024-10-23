import React from 'react';
import { GraphGenerator } from './GraphGenerator';
import Graph from "Graphs/Graph";

export class GraphGeneratorFullyConnected extends GraphGenerator {
    private n: number;

    constructor() {
        super();
        this.n = 10;
    }

    public getUI(onSettingsUpdate: (name: string, value: any) => void) {
        return (
            <div>
                <label>
                    Nodes (n):
                    <input
                        type="number"
                        min="1"
                        value={this.n}
                        onChange={(e) => { this.n = parseInt(e.target.value); onSettingsUpdate('n', this.n); }}
                    />
                </label>
            </div>
        );
    }

    public generate(): Graph {
        const nodes = Array.from({ length: this.n }, (_, i) => i);
        const links: [number, number][] = [];
        for (let i = 0; i < this.n; i++) {
            for (let j = i + 1; j < this.n; j++) {
                links.push([i, j]);
                links.push([j, i]);
            }
        }
        return Graph.fromNodesAndLinks(nodes, links);
    }

    public getName(): String {
        return "Fully Connected";
    }
}
