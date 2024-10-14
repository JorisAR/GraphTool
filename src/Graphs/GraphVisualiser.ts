import p5 from 'p5';
import Graph from './Graph';

class GraphVisualiser {
    public p5Instance: p5;
    private graph: Graph;
    private canvasParent: HTMLElement;

    constructor(graph: Graph, canvasParent: HTMLElement) {
        this.graph = graph;
        this.canvasParent = canvasParent;
        this.p5Instance = new p5((p: p5) => {
            p.setup = () => {
                p.createCanvas(this.canvasParent.clientWidth, this.canvasParent.clientHeight);
            };

            p.draw = () => {
                p.background(255);
                this.drawGraph(p);
            };
        }, this.canvasParent);
    }

    private drawGraph(p: p5) {
        const adjacencyMatrix = this.graph.getAdjacencyMatrix();
        const size = adjacencyMatrix.size()[0];
        const nodeList = this.graph.getNodeList();

        const radius = Math.min(p.width, p.height) / 2 - 20;
        const centerX = p.width / 2;
        const centerY = p.height / 2;

        for (let i = 0; i < size; i++) {
            const angle = (i / size) * p.TWO_PI;
            const x = centerX + radius * p.cos(angle);
            const y = centerY + radius * p.sin(angle);

            for (let j = 0; j < size; j++) {
                if (adjacencyMatrix.get([i, j]) !== 0) {
                    const angleJ = (j / size) * p.TWO_PI;
                    const xJ = centerX + radius * p.cos(angleJ);
                    const yJ = centerY + radius * p.sin(angleJ);

                    p.line(x, y, xJ, yJ);
                }
            }

            p.fill(0);
            p.ellipse(x, y, 30, 30);
            p.fill(255);
            p.textAlign(p.CENTER, p.CENTER);
            p.text(nodeList[i], x, y);
        }
    }


    public updateGraph(newGraph: Graph) {
        this.graph = newGraph;
        this.p5Instance.redraw();
    }
}

export default GraphVisualiser;
