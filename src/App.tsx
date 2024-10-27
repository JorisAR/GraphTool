import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import TopBar from 'Components/TopBar';
import GraphTool from 'GraphTool';
import Calculator from './Calculator'; // Assuming you have this component

const App: React.FC = () => {
    return (
        <Router basename="/GraphTool">
            <TopBar />
            <Routes>
                <Route path="/" element={<GraphTool />} />
                <Route path="/calculator" element={<Calculator />} />
                <Route path="*" element={<Navigate to="/" />} />
            </Routes>
        </Router>
    );
};

export default App;
