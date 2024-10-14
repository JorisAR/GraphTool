import p5 from 'p5';
import Graph from './Graph';

class GraphVisualiser {
    public p5Instance: p5;
    private graph: Graph;
    private canvasParent: HTMLElement;
    private nodesPositions: { x: number; y: number; vx: number; vy: number }[];
    private draggedNodeIndex: number | null;
    private nodeSize = 30;

    constructor(graph: Graph, canvasParent: HTMLElement) {
        this.graph = graph;
        this.canvasParent = canvasParent;
        this.nodesPositions = [];
        this.draggedNodeIndex = null;

        this.p5Instance = new p5((p: p5) => {
            p.setup = () => {
                p.createCanvas(this.canvasParent.clientWidth, this.canvasParent.clientHeight);
                this.initializeNodePositions(p);
                p.frameRate(60);
            };

            p.draw = () => {
                p.background(255);
                this.applyForces(p);
                this.updatePositions(p);
                this.drawGraph(p);
            };

            p.mousePressed = () => {
                this.nodesPositions.forEach((node, index) => {
                    if (p.dist(p.mouseX, p.mouseY, node.x, node.y) < 15) {
                        this.draggedNodeIndex = index;
                    }
                });
            };

            p.mouseDragged = () => {
                if (this.draggedNodeIndex !== null) {
                    const node = this.nodesPositions[this.draggedNodeIndex];
                    node.x = p.mouseX;
                    node.y = p.mouseY;
                }
            };

            p.mouseReleased = () => {
                this.draggedNodeIndex = null;
            };
        }, this.canvasParent);
    }

    private initializeNodePositions(p: p5) {
        const adjacencyMatrix = this.graph.getAdjacencyMatrix();
        const size = adjacencyMatrix.size()[0];
        const radius = Math.min(p.width, p.height) / 2 - 20;
        const centerX = p.width / 2;
        const centerY = p.height / 2;

        this.nodesPositions = [];
        for (let i = 0; i < size; i++) {
            const angle = (i / size) * p.TWO_PI;
            const x = centerX + radius * p.cos(angle);
            const y = centerY + radius * p.sin(angle);
            this.nodesPositions.push({ x, y, vx: 0, vy: 0 });
        }
    }

    private applyForces(p: p5) {
        const k = 0.01; // Spring constant for Hooke's law
        const damping = 0.9; // Damping factor to slow down movements
        const adjacencyMatrix = this.graph.getAdjacencyMatrix();
        const size = adjacencyMatrix.size()[0];
        const desiredDistance = 150; // Desired distance between connected nodes
        const desiredDisconnectedDistance = 300; // Desired distance between disconnected nodes

        for (let i = 0; i < size; i++) {
            for (let j = i + 1; j < size; j++) {
                const dx = this.nodesPositions[j].x - this.nodesPositions[i].x;
                const dy = this.nodesPositions[j].y - this.nodesPositions[i].y;
                const distance = Math.max(p.dist(this.nodesPositions[i].x, this.nodesPositions[i].y, this.nodesPositions[j].x, this.nodesPositions[j].y), 1);

                let force = 0;
                if (adjacencyMatrix.get([i, j]) !== 0) {
                    // Nodes are linked, apply attractive force
                    force = k * (distance - desiredDistance);
                } else if(distance < desiredDisconnectedDistance)  {
                    // Nodes are not linked, apply repulsive force only

                    force = -k * desiredDisconnectedDistance / (distance * 0.1);
                }

                const fx = (dx / distance) * force;
                const fy = (dy / distance) * force;

                if (this.draggedNodeIndex !== i) {
                    this.nodesPositions[i].vx += fx;
                    this.nodesPositions[i].vy += fy;
                }
                if (this.draggedNodeIndex !== j) {
                    this.nodesPositions[j].vx -= fx;
                    this.nodesPositions[j].vy -= fy;
                }
            }
        }

        this.nodesPositions.forEach(node => {
            if (node.vx !== 0 || node.vy !== 0) {
                node.vx *= damping;
                node.vy *= damping;
            }
        });
    }



    private updatePositions(p: p5) {
        const halfSize = this.nodeSize  * 0.5;
        this.nodesPositions.forEach(node => {
            node.x += node.vx;
            node.y += node.vy;

            // Keep nodes within the bounds of the canvas
            node.x = p.constrain(node.x, halfSize, p.width - halfSize);
            node.y = p.constrain(node.y, halfSize, p.height - halfSize);
        });


    }

    private drawGraph(p: p5) {
        const adjacencyMatrix = this.graph.getAdjacencyMatrix();
        const size = adjacencyMatrix.size()[0];
        const nodeList = this.graph.getNodeList();
        const halfSize = this.nodeSize * 0.5;

        for (let i = 0; i < size; i++) {
            const { x, y } = this.nodesPositions[i];
            for (let j = 0; j < size; j++) {
                if (adjacencyMatrix.get([i, j]) !== 0) {
                    const { x: xJ, y: yJ } = this.nodesPositions[j];

                    // Draw line
                    p.line(x, y, xJ, yJ);

                    // Draw arrowhead for directed edges
                    if (this.graph.isDirected) {
                        const angle = Math.atan2(yJ - y, xJ - x);
                        const arrowSize = 10;

                        const xEnd = xJ - halfSize * Math.cos(angle);
                        const yEnd = yJ - halfSize * Math.sin(angle);

                        p.push();
                        p.translate(xEnd, yEnd);
                        p.rotate(angle);
                        p.line(0, 0, -arrowSize, arrowSize / 2);
                        p.line(0, 0, -arrowSize, -arrowSize / 2);
                        p.pop();
                    }
                }
            }
        }

        // Draw nodes
        for (let i = 0; i < size; i++) {
            const { x, y } = this.nodesPositions[i];
            p.fill(0);
            p.ellipse(x, y, this.nodeSize, this.nodeSize);
            p.fill(255);
            p.textAlign(p.CENTER, p.CENTER);
            p.text(nodeList[i], x, y);
        }
    }


    public updateGraph(newGraph: Graph) {
        this.graph = newGraph;
        this.initializeNodePositions(this.p5Instance);
        this.p5Instance.redraw();
    }
}

export default GraphVisualiser;
