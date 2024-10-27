import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './TopBar.css';

const TopBar: React.FC = () => {
    const location = useLocation();
    return (
        <div className="top-bar">
            <Link to="/" className={`nav-link ${location.pathname === "/" ? "active" : ""}`}>Graph Tool</Link>
            <Link to="/calculator" className={`nav-link ${location.pathname === "/calculator" ? "active" : ""}`}>Calculator</Link>
        </div>
    );
};

export default TopBar;
