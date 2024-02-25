import { Button } from '@/components/Button';
import { SpaceShip1 } from '@/components/SpaceShip1';
import { SpaceShip2 } from '@/components/SpaceShip2';
import { SpaceShip3 } from '@/components/SpaceShip3';
import { Header } from '@/components/header';
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
                    <Header>Study Spaces</Header>
                    <ul className='flex flex-col gap-4 h-[500px]  overflow-auto'>
                        {groups?.map(group => (
                            <li
                                key={group.id}
                                className='font-extralight uppercase w-88 flex justify-between items-center border-b border-white pb-4'>
                                <h3>{group.name}</h3>
                                <div className='flex gap-4 items-center'>
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
                    </ul>
                </div>
            </div>
        </div>
    );
}
