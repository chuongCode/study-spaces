import React from 'react';

export const Modal = ({ isOpen, setIsOpen, children }) => {
    return (
        <>
            {isOpen && (
                <div className='z-40 flex flex-col w-full h-screen'>
                    <div className='bg-[#120917] w-96 h-96'>
                        <h1>test</h1>
                    </div>
                    {children}
                    <button
                        onClick={() => {
                            setIsOpen(false);
                        }}>
                        Close
                    </button>
                </div>
            )}
        </>
    );
};
