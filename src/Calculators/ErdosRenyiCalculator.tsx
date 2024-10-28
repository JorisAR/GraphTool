import React from 'react';
import { CalculatorBase } from './CalculatorBase';
import { InlineMath } from 'react-katex';
import 'katex/dist/katex.min.css';

interface ErdosRenyiCalculatorState {
    n?: number;
    p?: number;
}

export class ErdosRenyiCalculator extends CalculatorBase {
    state: ErdosRenyiCalculatorState = {
        n: undefined,
        p: undefined
    };

    reset = () => {
        this.setState({
            n: undefined,
            p: undefined
        });
    }

    getUI(onSettingsUpdate: (name: string, value: any) => void): JSX.Element {
        return (
            <div>
                <label>
                    Nodes (n):
                    <input
                        type="number"
                        value={this.state.n ?? ''}
                        onChange={(e) => onSettingsUpdate('n', parseInt(e.target.value))}
                    />
                </label><br/>
                <label>
                    Probability (p):
                    <input
                        type="number"
                        value={this.state.p ?? ''}
                        step="0.01"
                        min="0"
                        max="1"
                        onChange={(e) => onSettingsUpdate('p', parseFloat(e.target.value))}
                    />
                </label><br/>
                <button onClick={this.reset}>Reset</button>
            </div>
        );
    }

    calculate() {
        const { n, p } = this.state;

        if (n === undefined || p === undefined) {
            return [
                {
                    formula: `p_c = \\frac{\\log(n)}{n}`,
                    result: NaN
                },
                {
                    formula: `E[L] = \\frac{n(n - 1)}{2} * p`,
                    result: NaN
                },
                {
                    formula: `E[ClusterCoefficient] = p`,
                    result: NaN
                },

                {formula: `\\large{-- DegreeDistributionStatistics --}`, result: NaN},
                {
                    formula: `E[D] = (N - 1)p = \\mu`,
                    result: NaN
                },
                {
                    formula: `V[D] = (N - 1)p(1-p) = \\sigma^{2}`,
                    result: NaN
                },
                {
                    formula: `E[\\lambda] = 0`,
                    result: NaN
                },
                {
                    formula: `V[\\lambda] = E[D] `,
                    result: NaN
                }
            ];
        }

        const pc = Math.log(n) / n;
        const expectedLinkCount = (n * (n - 1)) / 2 * p;
        const expectedDegree = (n-1) * p;
        const varDegree = (n-1) * p * (1-p);

        return [
            {
                formula: `p_c = \\frac{\\log(n)}{n} = \\frac{\\log(${n})}{${n}} = ${pc.toFixed(4)}`,
                result: pc
            },
            {
                formula: `E[L] = \\frac{n(n - 1)}{2} * p = \\frac{${n}(${n} - 1)}{2} * ${p} = ${expectedLinkCount.toFixed(4)}`,
                result: expectedLinkCount
            },
            {
                formula: `E[ClusterCoefficient] = p = ${p}`,
                result: p
            },

            {formula: `\\large{-- DegreeDistributionStatistics --}`, result: NaN},
            {
                formula: `E[D] = (${n} - 1)${p} = \\mu = ${expectedDegree}`,
                result: expectedDegree
            },
            {
                formula: `V[D] = (${n} - 1)${p}(1-${p}) = \\sigma^{2} = ${varDegree}`,
                result: varDegree
            },
            {
                formula: `E[\\lambda] = 0`,
                result: NaN
            },
            {
                formula: `V[\\lambda] = E[D] = ${expectedDegree}`,
                result: expectedDegree
            }
        ];
    }
}
