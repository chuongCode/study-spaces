import { Button } from '@/components/Button';
import { SpaceShip1 } from '@/components/SpaceShip1';
import { SpaceShip2 } from '@/components/SpaceShip2';
import { SpaceShip3 } from '@/components/SpaceShip3';
import { Header } from '@/components/Header';
import { api } from '@/lib/axios';
import { Inter } from 'next/font/google';
import { useRouter } from 'next/navigation';
import { useQuery } from 'react-query';
import { useState } from 'react';
import { useUserName } from '@/zustand/store';

const inter = Inter({ subsets: ['latin'] });

const getGroups = async () => {
    const res = await api.get('/getGroups');
    return res.data;
};

export function Spaces() {
    const router = useRouter();
    const { username } = useUserName();

    const onJoinGroup = id => {
        router.push(`/group/${id}`);
    };
    const { isLoading, data: groups, error } = useQuery(['groups'], getGroups);
    const [spaceName, setSpaceName] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleCreateGroup = async event => {
        event.preventDefault();
        if (spaceName) {
            await api.post('/createGroup', { name: spaceName });
            router.push(`/group/${spaceName}`);
            setIsModalOpen(false);
        }
    };

    return (
        <div className={`${inter.className} w-full h-screen flex flex-col justify-center items-center`}>
            <div className='flex gap-10'>
                <div className='relative w-96'>
                    <SpaceShip1 size={150} className='absolute top-6' />
                    <SpaceShip2 size={250} className='absolute bottom-24' />
                    <SpaceShip3 size={150} className='absolute bottom-48 right-10' />
                </div>
                <div>
                    <Header>Study Spaces</Header>

                    <ul className='flex flex-col gap-4 h-[500px]  overflow-auto'>
                        <p className='font-extralight'>Welcome back {username}</p>
                        {groups?.map(group => (
                            <li
                                key={group.id}
                                className='flex items-center justify-between pb-4 uppercase border-b border-white font-extralight w-88'>
                                <h3>{group.name}</h3>
                                <div className='flex items-center gap-4'>
                                    <div>{group.playerCount} / 5</div>
                                    <Button
                                        onClick={() => {
                                            onJoinGroup(group.id);
                                        }}>
                                        {group.status === 'inactive' ? 'Join' : 'Full'}
                                    </Button>
                                </div>
                            </li>
                        ))}
                        <Button onClick={() => setIsModalOpen(!isModalOpen)}>Create Your Space</Button>
                    </ul>
                </div>
            </div>

            <div
                className='absolute flex-col items-center justify-center h-screen bg-slate-900 w-full bg-opacity-80'
                style={{ display: isModalOpen ? 'flex' : 'none' }}>
                <form className='flex flex-col gap-4 min-w-2.5 ' onClick={handleCreateGroup}>
                    <input
                        type='text'
                        placeholder='Space Name'
                        className='px-4 py-2 border-b border-b-slate-50 bg-transparent text-black placeholder-white'
                        value={spaceName}
                        onChange={e => setSpaceName(e.target.value)}
                    />
                    <Button type='submit'>Confirm</Button>
                    <Button onClick={() => setIsModalOpen(false)}>Cancel</Button>
                </form>
            </div>
        </div>
    );
}
