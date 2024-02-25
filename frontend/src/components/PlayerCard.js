import React from 'react';
import { SpaceShip1 } from './SpaceShip1';
import { motion } from 'framer-motion';
const PlayerCard = ({ playerName, idx }) => {
    return (
        <motion.div
            transition={{ delay: 0.3 * idx, duration: 0.5, ease: 'easeIn' }}
            animate={{
                opacity: [0, 100],
                y: [10, 0],
            }}
            className='w-[300px] flex flex-col items-center justify-center p-5 h-[400px]   border-2 border-solid rounded'>
            <div style={{ opacity: playerName ? '100%' : '30%' }}>
                <SpaceShip1 size={100} className='rotate-[45deg] relative left-[0px] top-[-20px]' />
            </div>
            {playerName ? (
                <h2 className='text-2xl font-extralight uppercase'>{playerName}</h2>
            ) : (
                <h2 className='text-lg font-extralight bg-white text-black uppercase px-4 py-2'>Invite Friend</h2>
            )}
        </motion.div>
    );
};

export default PlayerCard;
