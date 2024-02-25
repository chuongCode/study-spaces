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
        <div className={`${inter.className} w-full h-screen flex flex-col justify-center items-center no-scrollbar`}>
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
                </motion.div>
                <motion.div
                    className='relative w-96 overflow-clip'
                    transition={{ duration: 1, delay: 0.5, ease: 'easeIn' }}
                    animate={{
                        opacity: [0, 100],
                        y: [10, 0],
                    }}>
                    <div>
                        <Header className='w-full text-center'>Study Spaces</Header>
                        <p className='font-extralight uppercase text-xs w-full text-center relative top-[-30px]'>
                            Welcome back {username}
                        </p>
                    </div>

                    <ul className='flex flex-col gap-4 overflow-auto'>
                        <div className='flex flex-col gap-4 max-h-[500px] overflow-auto no-scrollbar'>
                            {groups?.map((group, idx) => (
                                <motion.li
                                    transition={{ delay: 0.3 * idx, duration: 0.5, ease: 'easeIn' }}
                                    animate={{
                                        opacity: [0, 100],
                                        y: [10, 0],
                                    }}
                                    key={group.id}
                                    className='flex items-center justify-between pb-4 uppercase border-b border-white font-extralight w-88'>
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
                className='absolute flex-col items-center justify-center w-full h-screen bg-slate-900 bg-opacity-80'
                style={{ display: isModalOpen ? 'flex' : 'none' }}>
                <form
                    className='flex flex-col gap-4 min-w-2.5 focus:text-white focus:ring-2 focus:ring-white'
                    onClick={handleCreateGroup}>
                    <input
                        type='text'
                        placeholder='Space Name'
                        className='px-4 py-2 text-black placeholder-white bg-transparent border-b focus:border-blue-500 border-b-slate-50'
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
