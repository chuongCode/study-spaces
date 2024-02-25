import React from 'react';

export const Button = ({ children, className, ...rest }) => {
    return (
        <button
            className={`px-4 py-2 border border-white rounded-lg hover:bg-white hover:bg-opacity-20 transition duration-500 hover:scale-95 font-extralight  uppercase ${className}`}
            {...rest}>
            {children}
        </button>
    );
};
