import React, { useState } from 'react';
import { ErdosRenyiCalculator } from './Calculators/ErdosRenyiCalculator';

const calculators = [
    { name: 'Erdős-Rényi Random Graph', component: ErdosRenyiCalculator },
    // Add more calculators here
];

const Calculator: React.FC = () => {
    const [selectedCalculator, setSelectedCalculator] = useState(calculators[0].name);

    const SelectedCalculatorComponent = calculators.find(c => c.name === selectedCalculator)?.component || calculators[0].component;

    return (
        <div>
            <h1>Calculator</h1>
            <label>
                Select Calculator:
                <select onChange={(e) => setSelectedCalculator(e.target.value)} value={selectedCalculator}>
                    {calculators.map(calculator => (
                        <option key={calculator.name} value={calculator.name}>{calculator.name}</option>
                    ))}
                </select>
            </label>
            <SelectedCalculatorComponent />
        </div>
    );
}

export default Calculator;
