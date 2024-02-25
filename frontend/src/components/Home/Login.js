import React from 'react';
import { Button } from '@/components/Button';
import { Header } from '@/components/Header';
import { useUserName } from '@/zustand/store';

export const Login = ({ setIsSubmit }) => {
    const { setUsername, username } = useUserName();

    const submit = e => {
        e.preventDefault();
        setIsSubmit(true);
    };

    return (
        <div className='flex flex-col items-center justify-center h-screen gap-4'>
            <Header>Login</Header>
            <input
                type='text'
                placeholder='Username'
                className='focus:text-white focus:ring-2 focus:ring-white px-4 py-2 border-b border-b-slate-50 bg-transparent text-white'
                value={username ?? ''}
                onChange={e => setUsername(e.target.value)}
            />
            <Button onClick={submit}>Login</Button>
        </div>
    );
};
