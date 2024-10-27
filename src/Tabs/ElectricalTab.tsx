import React, { useState } from 'react';
import Graph from 'Graphs/Graph';
import CollapsibleTab from 'Tabs/CollapsibleTab';
import { InlineMath } from 'react-katex';
import 'katex/dist/katex.min.css';
import { all, create, Matrix } from 'mathjs';
import 'bootstrap/dist/css/bootstrap.min.css';

const math = create(all);

interface ElectricalTabProps {
    graph: Graph;
}

const ElectricalTab: React.FC<ElectricalTabProps> = ({ graph }) => {
    const [currentInjection, setCurrentInjection] = useState<string>('');
    const [nodePotentials, setNodePotentials] = useState<Matrix | null>(null);
    const [currentVector, setCurrentVector] = useState<Matrix | null>(null);

    const laplacianPseudoInverse = graph.getPseudoInverse(true);
    const n = graph.getNodeCount();
    const u = math.ones(n, 1);
    const zeta = math.reshape(math.diag(laplacianPseudoInverse), [n, 1]) as Matrix;

    // Effective Resistance Matrix (Ω)
    const omega = math.subtract(math.add(math.multiply(u, math.transpose(zeta)), math.multiply(zeta, math.transpose(u))), math.multiply(2, laplacianPseudoInverse)) as Matrix;
    // Effective Graph Resistance
    const effectiveGraphResistance = (math.sum(omega) as number) / 2;

    const ZetaString = Graph.LatexMatrix(math.transpose(zeta), 3);
    const OmegaString = Graph.LatexMatrix(omega, 3);
    const ResistanceString = `R_G = ${effectiveGraphResistance.toFixed(4)}`;

    const handleCalculatePotentials = () => {
        let injectionArray = currentInjection.split(',').map(Number);
        const n = graph.getNodeCount();
        if (injectionArray.length !== n) injectionArray = Array(n).fill(0);

        // Remove the last node to use as a reference
        const reducedLaplacian = math.subset(graph.getLaplacianMatrix(true), math.index(math.range(0, n - 1), math.range(0, n - 1))) as Matrix;
        const reducedX = math.subset(math.reshape(math.matrix(injectionArray), [n, 1]), math.index(math.range(0, n - 1), 0)) as Matrix;
        const vReduced = math.multiply(math.pinv(reducedLaplacian), reducedX) as Matrix;

        // Append 0 to vReduced
        const vArray = vReduced.toArray().flat()
        vArray.push(0);
        const v = math.reshape(math.matrix(vArray), [n, 1]);

        const B = graph.getIncidenceMatrix();
        const y = math.multiply(math.transpose(B), v) as Matrix;

        setNodePotentials(v);
        setCurrentVector(y);
    };



    const NodePotentialsString = nodePotentials ? Graph.LatexMatrix(nodePotentials, 3) : '';
    const CurrentVectorString = currentVector ? Graph.LatexMatrix(currentVector, 3) : '';

    return (
        <CollapsibleTab title="Electrical Circuits">
            <div>
                <h3>Effective Resistance Matrix Ω</h3>
                <InlineMath math={OmegaString} />
            </div>
            <div>
                <h3>ζ Vector</h3>
                <InlineMath math={ZetaString} />
            </div>
            <div>
                <h3>Effective Graph Resistance</h3>
                <InlineMath math={ResistanceString} />
            </div>
            <div>
                <h3>Current Injection Vector (x)</h3>
                <input
                    type="text"
                    value={currentInjection}
                    onChange={(e) => setCurrentInjection(e.target.value)}
                    placeholder="e.g. 2,0,0,-2"
                />
                <button onClick={handleCalculatePotentials}>Calculate Node Potentials</button>
            </div>
            {nodePotentials && (
                <div>
                    <h3>Node Potentials (v)</h3>
                    <InlineMath math={NodePotentialsString} />
                </div>
            )}
            {currentVector && (
                <div>
                    <h3>Current Vector (y)</h3>
                    <InlineMath math={CurrentVectorString} />
                </div>
            )}
        </CollapsibleTab>
    );
};

export default ElectricalTab;
