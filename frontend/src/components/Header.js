import React from 'react';

export const Header = ({ children, className }) => {
    return (
        <>
            <h1
                className={`uppercase tracking-widest text-3xl font-extralight pb-8 ${className} glitch-1`}
                style={{ letterSpacing: '0.5rem' }}>
                {children}
            </h1>
        </>
    );
};
