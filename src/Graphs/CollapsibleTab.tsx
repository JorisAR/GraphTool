import React, { useState, ReactNode } from 'react';
import Graph from './Graph';

interface CollapsibleTabProps {
    title: string;
    children: ReactNode;
}

const CollapsibleTab: React.FC<CollapsibleTabProps> = ({ title, children }) => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleOpen = () => setIsOpen(!isOpen);

    return (
        <div style={{ marginBottom: '10px' }}>
            <button
                onClick={toggleOpen}
                style={{
                    display: 'block',
                    width: '100%',
                    textAlign: 'left',
                    padding: '10px',
                    background: '#f0f0f0',
                    border: '1px solid #ccc',
                    borderRadius: '4px',
                    cursor: 'pointer'
                }}
            >
                {title} {isOpen ? '▼' : '▲'}
            </button>
            {isOpen && (
                <div style={{ padding: '10px', border: '1px solid #ccc', borderTop: 'none', borderRadius: '0 0 4px 4px' }}>
                    {children}
                </div>
            )}
        </div>
    );
};

export default CollapsibleTab;
