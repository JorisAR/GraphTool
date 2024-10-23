import React from 'react';
import { GraphGenerator } from './GraphGenerator';
import Graph from "Graphs/Graph";

export class GraphGeneratorStar extends GraphGenerator {
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
        for (let i = 1; i < this.n; i++) {
            links.push([0, i]);
            links.push([i, 0]);
        }
        return Graph.fromNodesAndLinks(nodes, links);
    }

    public getName(): String {
        return "Star";
    }
}
