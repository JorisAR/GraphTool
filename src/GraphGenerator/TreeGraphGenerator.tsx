import React from 'react';
import { GraphGenerator } from './GraphGenerator';
import Graph from "Graphs/Graph";
import {number} from "mathjs";

export class GraphGeneratorTree extends GraphGenerator {
    private depth: number;

    constructor() {
        super();
        this.depth = 3; // Default depth of the tree
    }

    public getUI(onSettingsUpdate: (name: string, value: any) => void) {
        return (
            <div>
                <label>
                    Depth of the Tree:
                    <input
                        type="number"
                        min="1"
                        value={this.depth}
                        onChange={(e) => { this.depth = parseInt(e.target.value); onSettingsUpdate('depth', this.depth); }}
                    />
                </label>
            </div>
        );
    }

    public generate(): Graph {
        const nodes : number[] = [];
        const links: [number, number][] = [];
        let currentIndex = 0;

        // Create nodes and links to form a tree
        const createTree = (currentDepth: number, parentIndex: number | null) => {
            if (currentDepth > this.depth) return;

            const nodeIndex = currentIndex++;
            nodes.push(nodeIndex);

            if (parentIndex !== null) {
                links.push([parentIndex, nodeIndex]);
            }

            createTree(currentDepth + 1, nodeIndex); // Left child
            createTree(currentDepth + 1, nodeIndex); // Right child
        };

        createTree(1, null);

        return Graph.fromNodesAndLinks(nodes, links);
    }

    public getName(): String {
        return "Tree";
    }
}
