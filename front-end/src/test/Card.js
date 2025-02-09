import React from 'react';

const Card = ({ title, description }) => {
    return (
        <div style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '8px' }}>
            <h4>{title}</h4>
            <p>{description}</p>
        </div>
    );
};

export default Card;
