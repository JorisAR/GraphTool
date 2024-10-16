import React from 'react';
import { GraphGenerator } from './GraphGenerator';
import Graph from "Graphs/Graph";

export class GraphGeneratorErdosRenyi extends GraphGenerator {
    private n: number;
    private p: number;

    constructor() {
        super();
        this.n = 10;
        this.p = 0.5;
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
                </label><br/>
                <label>
                    Probability (p):
                    <input
                        type="number"
                        value={this.p}
                        step="0.01"
                        min="0"
                        max="1"
                        onChange={(e) => { this.p = parseFloat(e.target.value); onSettingsUpdate('p', this.p); }}
                    />
                </label>
            </div>
        );
    }

    public generate(): Graph {
        const nodes = Array.from({ length: this.n }, (_, i) => i);
        const links: [number, number][] = [];
        for (let i = 0; i < this.n; i++) {
            for (let j = 0; j < i; j++) {
                if (Math.random() < this.p) {
                    links.push([i, j]);
                }
            }
        }
        return Graph.fromNodesAndLinks(nodes, links);
    }

    public getName(): String {
        return "Erdos Renyi";
    }
}
