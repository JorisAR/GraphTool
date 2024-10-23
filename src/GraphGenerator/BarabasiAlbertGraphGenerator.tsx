import React from 'react';
import { GraphGenerator } from './GraphGenerator';
import Graph from "Graphs/Graph";

export class GraphGeneratorBarabasiAlbert extends GraphGenerator {
    private n: number;
    private m: number;

    constructor() {
        super();
        this.n = 10;
        this.m = 2;  // Number of edges to attach from a new node to existing nodes
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
                    Number of edges per new node (m):
                    <input
                        type="number"
                        min="1"
                        value={this.m}
                        onChange={(e) => { this.m = parseInt(e.target.value); onSettingsUpdate('m', this.m); }}
                    />
                </label>
            </div>
        );
    }

    public generate(): Graph {
        const nodes = Array.from({ length: this.n }, (_, i) => i);
        const links: [number, number][] = [];
        const nodeDegrees = Array(this.n).fill(0);

        // Initial complete graph with m nodes
        for (let i = 0; i < this.m; i++) {
            for (let j = i + 1; j < this.m; j++) {
                links.push([i, j]);
                links.push([j, i]);
                nodeDegrees[i]++;
                nodeDegrees[j]++;
            }
        }

        // Add remaining nodes using preferential attachment
        for (let i = this.m; i < this.n; i++) {
            let targets = new Set<number>();
            while (targets.size < this.m) {
                const totalDegree = nodeDegrees.reduce((sum, deg) => sum + deg, 0);
                const r = Math.random() * totalDegree;
                let cumulativeDegree = 0;
                for (let j = 0; j < i; j++) {
                    cumulativeDegree += nodeDegrees[j];
                    if (cumulativeDegree > r && !targets.has(j)) {
                        targets.add(j);
                        break;
                    }
                }
            }
            targets.forEach(target => {
                links.push([i, target]);
                links.push([target, i]);
                nodeDegrees[i]++;
                nodeDegrees[target]++;
            });
        }

        return Graph.fromNodesAndLinks(nodes, links);
    }

    public getName(): String {
        return "Barabasi-Albert";
    }
}
