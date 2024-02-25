import React from 'react';
import { Button } from '@/components/Button';
import { Header } from '@/components/Header';
import { useUserName } from '@/zustand/store';
import { motion } from 'framer-motion';

export const Login = ({ setIsSubmit }) => {
    const { setUsername, username } = useUserName();

    const submit = e => {
        e.preventDefault();
        setIsSubmit(true);
    };

    return (
        <div className='flex flex-col items-center justify-center h-screen gap-4'>
            <motion.div
                className='flex flex-col gap-4 items-center justify-center'
                transition={{ duration: 0.8, ease: 'easeIn' }}
                animate={{
                    opacity: [0, 100],
                    y: [10, 0],
                }}>
                <Header>Study Spaces</Header>
                <p className='font-extralight uppercase text-xl w-full text-center relative top-[-30px]'>Login</p>
                <input
                    type='text'
                    placeholder='Username'
                    className='focus:border-blue-500 focus:text-white focus:ring-2 focus:ring-white px-4 py-2 border-b border-b-slate-50 bg-transparent text-white'
                    value={username ?? ''}
                    onChange={e => setUsername(e.target.value)}
                />
                <Button onClick={submit}>Login</Button>
            </motion.div>
        </div>
    );
};
