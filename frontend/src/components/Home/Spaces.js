import { Button } from '@/components/Button';
import { SpaceShip1 } from '@/components/SpaceShip1';
import { SpaceShip2 } from '@/components/SpaceShip2';
import { SpaceShip3 } from '@/components/SpaceShip3';
import { Header } from '@/components/Header';
import { api } from '@/lib/axios';
import { Inter } from 'next/font/google';
import { useRouter } from 'next/navigation';
import { useQuery } from 'react-query';
import { useEffect, useState } from 'react';
import { useUserName } from '@/zustand/store';
import { motion } from 'framer-motion';
const inter = Inter({ subsets: ['latin'] });
import { useAnimate } from 'framer-motion';

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
                <motion.div
                    className='relative w-96'
                    transition={{ delay: 0.5, duration: 0.5, ease: 'easeIn' }}
                    animate={{
                        opacity: [0, 100],
                        y: [10, 0],
                    }}>
                    <motion.div
                        className='absolute bottom-48 right-[100px]'
                        animate={{
                            opacity: [0, 0.5, 0.75, 1, 1],
                            translateY: [700, 0],
                            translateX: [700, 0],
                        }}
                        // @ts-ignore no problem in operation, although type error appears.
                        transition={{
                            duration: 2,
                            ease: 'easeInOut',
                            times: [0, 0.2, 0.5, 0.8, 1],
                        }}>
                        <SpaceShip1 size={300} />
                    </motion.div>
                    {/* <SpaceShip2 size={250} className='absolute bottom-24' />
                    <SpaceShip3 size={150} className='absolute bottom-48 right-10' /> */}
                </motion.div>
                <motion.div
                    className='relative w-96'
                    transition={{ duration: 1, delay: 0.5, ease: 'easeIn' }}
                    animate={{
                        opacity: [0, 100],
                        y: [10, 0],
                    }}>
                    <Header className='w-full text-center'>Study Spaces</Header>

                    <ul className='flex flex-col gap-4 overflow-auto'>
                        <p className='font-extralight uppercase text-sm w-full text-center pb-4'>
                            Welcome back {username}
                        </p>
                        <div className='flex flex-col gap-4 max-h-[500px]overflow-auto'>
                            {groups?.map((group, idx) => (
                                <motion.li
                                    transition={{ delay: 0.3 * idx, duration: 0.5, ease: 'easeIn' }}
                                    animate={{
                                        opacity: [0, 100],
                                        y: [10, 0],
                                    }}
                                    key={group.id}
                                    className='flex items-center justify-between pb-4 uppercase border-b border-white
                                    font-extralight w-88'>
                                    <h3>{group.name}</h3>
                                    <div className='flex items-center gap-4'>
                                        <Button
                                            onClick={() => {
                                                onJoinGroup(group.id);
                                            }}>
                                            {group.status === 'inactive' ? 'Join' : 'Full'}
                                        </Button>
                                    </div>
                                </motion.li>
                            ))}
                        </div>
                        <Button onClick={() => setIsModalOpen(!isModalOpen)}>Create Your Space</Button>
                    </ul>
                </motion.div>
            </div>

            <div
                className='absolute flex-col items-center justify-center h-screen bg-slate-900 w-full bg-opacity-80'
                style={{ display: isModalOpen ? 'flex' : 'none' }}>
                <form
                    className='flex flex-col gap-4 min-w-2.5 focus:text-white focus:ring-2 focus:ring-white'
                    onClick={handleCreateGroup}>
                    <input
                        type='text'
                        placeholder='Space Name'
                        className='focus:border-blue-500 px-4 py-2 border-b border-b-slate-50 bg-transparent text-black placeholder-white'
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
