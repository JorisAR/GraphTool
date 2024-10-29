import React from 'react';
import { GraphGenerator } from './GraphGenerator';
import Graph from "Graphs/Graph";

export class GraphGeneratorLattice extends GraphGenerator {
    private x: number;
    private y: number;

    constructor() {
        super();
        this.x = 4;
        this.y = 4;
    }

    public getUI(onSettingsUpdate: (name: string, value: any) => void) {
        return (
            <div>
                <label>
                    X Dimension:
                    <input
                        type="number"
                        min="1"
                        value={this.x}
                        onChange={(e) => { this.x = parseInt(e.target.value); onSettingsUpdate('x', this.x); }}
                    />
                </label>
                <br />
                <label>
                    Y Dimension:
                    <input
                        type="number"
                        min="1"
                        value={this.y}
                        onChange={(e) => { this.y = parseInt(e.target.value); onSettingsUpdate('y', this.y); }}
                    />
                </label>
            </div>
        );
    }

    public generate(): Graph {
        const nodes = Array.from({ length: this.x * this.y }, (_, i) => i);
        const links: [number, number][] = [];

        for (let i = 0; i < this.x; i++) {
            for (let j = 0; j < this.y; j++) {
                const node = i * this.y + j;
                if (j + 1 < this.y) {
                    links.push([node, node + 1]);
                    links.push([node + 1, node]);
                }
                if (i + 1 < this.x) {
                    links.push([node, node + this.y]);
                    links.push([node + this.y, node]);
                }
            }
        }
        return Graph.fromNodesAndLinks(nodes, links);
    }

    public getName(): String {
        return "Lattice";
    }
}
