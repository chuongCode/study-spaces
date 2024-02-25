import React from 'react';

export const Header = ({ children }) => {
    
    return (
        <h1 className='uppercase tracking-widest text-3xl font-extralight pb-8' style={{ letterSpacing: '0.5rem' }}>
            {children}
        </h1>
    );
};
