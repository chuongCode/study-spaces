import React, { useState, useEffect } from 'react';
import { Button } from '@/components/Button';
import { Header } from '@/components/Header';
import { api } from '@/lib/axios';
import { Inter } from 'next/font/google';
import { useRouter } from 'next/navigation';
import { useQuery } from 'react-query';

const login = () => {
    const [username, setUsername] = useState('');
    const router = useRouter();
    const handleOnClick = (e) => {
        e.preventDefault();
        if (username !== '') {
            console.log(username);
            router.push(`/group`);
        }
    };

    return (
        <div className='flex flex-col items-center justify-center h-screen'>
            <Header>Login</Header>
            <form className='flex flex-col gap-4 w-1/3 ' onClick={handleOnClick}>
                <input
                    type='text'
                    placeholder='Username'
                    className='rounded-lg px-4 py-2 border-b border-b-slate-50 bg-transparent text-white'
                    value={username}
                    onChange={e => setUsername(e.target.value)}
                />
                <Button type='submit'>Login</Button>
            </form>
        </div>
    );
};

export default login;
