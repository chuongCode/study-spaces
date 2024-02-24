import { Inter } from 'next/font/google';
import { useRouter } from 'next/navigation';

const inter = Inter({ subsets: ['latin'] });

const GROUPS = [
    { name: 'Group 1', id: '1', playerCount: 0 },
    { name: 'Group 2', id: '2', playerCount: 1 },
    { name: 'Group 3', id: '3', playerCount: 2 },
    { name: 'Group 4', id: '4', playerCount: 3 },
    { name: 'Group 5', id: '5', playerCount: 4 },
];

export default function Home() {
    const router = useRouter();
    const onJoinGroup = groupId => {
        router.push(`/group/${groupId}`);
    };

    return (
        <div className={`${inter.className} w-full h-screen flex flex-col justify-center items-center`}>
            <div>
                <h1
                    className='uppercase tracking-widest text-3xl font-extralight pb-8'
                    style={{ letterSpacing: '0.5rem' }}>
                    Study Spaces
                </h1>
                <ul className='flex flex-col gap-4'>
                    {GROUPS.map(group => (
                        <li
                            key={group.id}
                            className='font-extralight uppercase w-80 flex justify-between items-center border-b border-white pb-4'>
                            <h3>{group.name}</h3>
                            <div className='flex gap-4 items-center'>
                                <div>{group.playerCount} / 5</div>
                                <button
                                    onClick={() => {
                                        onJoinGroup(group.id);
                                    }}
                                    className='px-4 py-2 border border-white rounded-lg hover:bg-white hover:bg-opacity-20 transition duration-500 hover:scale-105'>
                                    Join
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}
