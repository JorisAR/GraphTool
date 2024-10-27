import React from 'react';
import { InlineMath } from 'react-katex';
import 'katex/dist/katex.min.css';

export abstract class CalculatorBase extends React.Component {
    abstract getUI(onSettingsUpdate: (name: string, value: any) => void): JSX.Element;
    abstract calculate(): { formula: string, result: number }[];

    render() {
        return (
            <div>
                {this.getUI(this.handleSettingsUpdate)}
                <div>
                    <h3>Results</h3>
                    {this.renderResults()}
                </div>
            </div>
        );
    }

    handleSettingsUpdate = (name: string, value: any) => {
        this.setState({ [name]: value });
    }

    renderResults() {
        const results = this.calculate();
        return (
            <div>
                {results.map((res, index) => (
                    <div key={index}>
                        <InlineMath math={res.formula} /><br/><br/>
                    </div>
                ))}
            </div>
        );
    }
}
