import { SpaceShip1 } from '@/components/SpaceShip1';
import { SpaceShip2 } from '@/components/SpaceShip2';
import { SpaceShip3 } from '@/components/SpaceShip3';
import { api } from '@/lib/axios';
import { Inter } from 'next/font/google';
import { useRouter } from 'next/navigation';
import { useQuery } from 'react-query';

const inter = Inter({ subsets: ['latin'] });

const getGroups = async () => {
    const res = await api.get('/getGroups');
    return res.data;
};

export default function Home() {
    const router = useRouter();
    const onJoinGroup = groupId => {
        router.push(`/group/${groupId}`);
    };
    const { isLoading, data: groups, error } = useQuery(['groups'], getGroups);

    return (
        <div className={`${inter.className} w-full h-screen flex flex-col justify-center items-center`}>
            <div className='flex gap-10'>
                <div className='w-96 relative'>
                    <SpaceShip1 size={150} className='absolute top-6' />
                    <SpaceShip2 size={250} className='absolute bottom-24' />
                    <SpaceShip3 size={150} className='absolute bottom-48 right-10' />
                </div>
                <div>
                    <h1
                        className='uppercase tracking-widest text-3xl font-extralight pb-8'
                        style={{ letterSpacing: '0.5rem' }}>
                        Study Spaces
                    </h1>
                    <ul className='flex flex-col gap-4 h-[500px]  overflow-auto'>
                        {groups?.map(group => (
                            <li
                                key={group.id}
                                className='font-extralight uppercase w-88 flex justify-between items-center border-b border-white pb-4'>
                                <h3>{group.name}</h3>
                                <div className='flex gap-4 items-center'>
                                    <div>{group.playerCount} / 5</div>
                                    <button
                                        onClick={() => {
                                            onJoinGroup(group.id);
                                        }}
                                        className='px-4 py-2 border border-white rounded-lg hover:bg-white hover:bg-opacity-20 transition duration-500 hover:scale-95'>
                                        {group.status === 'inactive' ? 'Join' : 'Full'}
                                    </button>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
}
