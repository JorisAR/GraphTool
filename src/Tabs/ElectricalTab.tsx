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

    const [currentVectorInput, setCurrentVectorInput] = useState<string>('');
    const [potentialVectorInput, setPotentialVectorInput] = useState<string>('');
    const [dissipatedPower, setDissipatedPower] = useState<number | null>(null);


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

        setNodePotentials(math.transpose(v));
        setCurrentVector(math.transpose(y));
    };

    const handleCalculatePower = () => {
        const B = graph.getIncidenceMatrix();
        let currentVector : Matrix = B;
        let calculate = false;

        if (currentVectorInput) {
            const currentVectorArray = currentVectorInput.split(',').map(Number);
            currentVector = math.reshape(math.matrix(currentVectorArray), [currentVectorArray.length, 1]);
            calculate = true;

        } else if (potentialVectorInput) {
            const potentialVectorArray = potentialVectorInput.split(',').map(Number);
            const potentialVector = math.reshape(math.matrix(potentialVectorArray), [potentialVectorArray.length, 1]);
            currentVector = math.multiply(B, potentialVector);
            calculate = true;
        }
        if(calculate) {
            const resistanceMatrix = math.diag(graph.getEdgeWeightList());
            const power = math.divide(math.sum(math.dotMultiply(currentVector, currentVector)), math.sum(resistanceMatrix)) as number;

            setDissipatedPower(power);
        } else {
            setDissipatedPower(0);
        }


    };





    const NodePotentialsString = nodePotentials ? Graph.LatexMatrix(nodePotentials, 3) : '';
    const CurrentVectorString = currentVector ? Graph.LatexMatrix(currentVector, 3) : '';

    return (
        <CollapsibleTab title="Electrical Circuits">
            <h2>Resistance</h2>
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
            <br/>
            <h2>Current Injection</h2>
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
            {/*<h2>Power Calculation</h2>*/}
            {/*<div>*/}
            {/*    <h3>Current Vector (CSV)</h3>*/}
            {/*    <input*/}
            {/*        type="text"*/}
            {/*        value={currentVectorInput}*/}
            {/*        onChange={(e) => setCurrentVectorInput(e.target.value)}*/}
            {/*        placeholder="e.g. 2,0,-2"*/}
            {/*    />*/}
            {/*</div>*/}
            {/*<div>*/}
            {/*    <h3>Potential Vector (CSV)</h3>*/}
            {/*    <input*/}
            {/*        type="text"*/}
            {/*        value={potentialVectorInput}*/}
            {/*        onChange={(e) => setPotentialVectorInput(e.target.value)}*/}
            {/*        placeholder="e.g. 5,3,1"*/}
            {/*    />*/}
            {/*</div>*/}
            {/*<button onClick={handleCalculatePower}>Calculate Dissipated Power</button>*/}
            {/*{dissipatedPower !== null && (*/}
            {/*    <div>*/}
            {/*        <h3>Dissipated Power</h3>*/}
            {/*        <InlineMath math={`P = ${dissipatedPower.toFixed(4)}`} />*/}
            {/*    </div>*/}
            {/*)}*/}

        </CollapsibleTab>
    );
};

export default ElectricalTab;
