import React from 'react';
import { CalculatorBase } from './CalculatorBase';
import { InlineMath } from 'react-katex';
import 'katex/dist/katex.min.css';

interface GeneralGraphCalculatorState {
    n?: number;
    expectedDegree?: number;
    varianceDegree?: number;
    largestLambda?: number;
    l?: number;
    dMax?: number;
}

export class GeneralGraphCalculator extends CalculatorBase {
    state: GeneralGraphCalculatorState = {
        n: undefined,
        expectedDegree: undefined,
        varianceDegree: undefined,
        largestLambda: undefined,
        l: undefined,
        dMax: undefined,
    };

    reset = () => {
        this.setState({
            n: undefined,
            expectedDegree: undefined,
            varianceDegree: undefined,
            largestLambda: undefined,
            l: undefined,
            dMax: undefined,
        });
    }

    getUI(onSettingsUpdate: (name: string, value: any) => void): JSX.Element {
        return (
            <div>
                <label>
                    Nodes (N):
                    <input
                        type="number"
                        value={this.state.n ?? ''}
                        onChange={(e) => onSettingsUpdate('n', parseInt(e.target.value))}
                    />
                </label><br/>
                <label>
                    Links (L):
                    <input
                        type="number"
                        value={this.state.l ?? ''}
                        onChange={(e) => onSettingsUpdate('l', parseInt(e.target.value))}
                    />
                </label><br/>
                <label>
                    Expected Degree (E[D]):
                    <input
                        type="number"
                        value={this.state.expectedDegree ?? ''}
                        step="1.0"
                        onChange={(e) => onSettingsUpdate('expectedDegree', parseFloat(e.target.value))}
                    />
                </label><br/>
                <label>
                    Variance Degree (V[D]):
                    <input
                        type="number"
                        value={this.state.varianceDegree ?? ''}
                        step="1.0"
                        onChange={(e) => onSettingsUpdate('varianceDegree', parseFloat(e.target.value))}
                    />
                </label><br/>
                <label>
                    Largest Lambda (λ1):
                    <input
                        type="number"
                        value={this.state.largestLambda ?? ''}
                        step="1.0"
                        onChange={(e) => onSettingsUpdate('largestLambda', parseFloat(e.target.value))}
                    />
                </label><br/>
                <label>
                    Max Degree (Dmax):
                    <input
                        type="number"
                        value={this.state.dMax ?? ''}
                        onChange={(e) => onSettingsUpdate('dMax', parseInt(e.target.value))}
                    />
                </label><br/>
                <button onClick={this.reset}>Reset</button>
            </div>
        );
    }

    calculate() {
        var formula1 = this.getFormula1();
        var formula2 = this.getFormula2();

        return [
            {
                formula: formula1,
                result: NaN
            },
            {
                formula: formula2,
                result: NaN
            }
        ];
    }

    private getFormula1() {
        const {n, expectedDegree, largestLambda, l, dMax} = this.state;
        var formula = ' E[D] = \\frac{2L}{N}';
        if ((n !== undefined && l !== undefined)) {
            var Ed = (2 * l) / n;
            this.state.expectedDegree = Ed;
            formula = formula + `= ${Ed}`;
        } else {
            if (expectedDegree !== undefined) {
                Ed = expectedDegree;
                this.state.n = Ed;
                this.state.l = Ed / this.state.n;
                formula = formula + `= ${Ed}`
            }
        }

        if (largestLambda === undefined) {
            formula = formula = '\\lambda_1 \\geqslant' + formula;
        } else {
            formula = formula = `${largestLambda} \\geqslant` + formula
        }

        if (dMax === undefined) {
            formula = 'D_(max) \\geqslant' + formula;
        } else {
            formula = `${dMax} \\geqslant` + formula;
        }
        return formula
    }

    private getFormula2() {
        const { expectedDegree, varianceDegree, largestLambda } = this.state;
        let formula = ' ';

        if (expectedDegree === undefined || varianceDegree === undefined) {
            formula += ` E[D] \\sqrt{1 + \\frac{Var[D]}{(E[D])^2}}`;
        } else {
            const result = expectedDegree * Math.sqrt(varianceDegree / (expectedDegree * expectedDegree) + 1);
            formula += `= ${result} `;
        }

        if (largestLambda === undefined) {
            formula = `\\lambda_1 \\geqslant` + formula;
        } else {
            formula = `${largestLambda} \\geqslant` + formula;
        }
        return formula;
    }

}
