import React from 'react';
import { GraphGenerator } from './GraphGenerator';
import Graph from "Graphs/Graph";

export class GraphGeneratorSmallWorld extends GraphGenerator {
    private n: number;
    private k: number;
    private p: number;

    constructor() {
        super();
        this.n = 10;
        this.k = 2;
        this.p = 0.1;
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
        Each Node's Degree (k):
        <input
        type="number"
        min="1"
        value={this.k}
        onChange={(e) => { this.k = parseInt(e.target.value); onSettingsUpdate('k', this.k); }}
        />
        </label><br/>
        <label>
        Rewiring Probability (p):
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

        // Create a regular ring lattice
        for (let i = 0; i < this.n; i++) {
            for (let j = 1; j <= this.k / 2; j++) {
                links.push([i, (i + j) % this.n]);
                links.push([(i + j) % this.n, i]); // Ensure undirected edges
            }
        }

        // Rewire edges with probability p
        for (let i = 0; i < this.n; i++) {
            for (let j = 1; j <= this.k / 2; j++) {
                if (Math.random() < this.p) {
                    let newTarget;
                    do {
                        newTarget = Math.floor(Math.random() * this.n);
                    } while (newTarget === i || links.includes([i, newTarget]) || links.includes([newTarget, i]));

                    links.push([i, newTarget]);
                    links.push([newTarget, i]); // Ensure undirected edges

                    // Remove the original edge
                    links.splice(links.indexOf([i, (i + j) % this.n]), 1);
                    links.splice(links.indexOf([(i + j) % this.n, i]), 1);
                }
            }
        }

        return Graph.fromNodesAndLinks(nodes, links);
    }

    public getName(): String {
        return "Watts-Strogatz Small World";
    }
}
