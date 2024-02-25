import React, { useState } from 'react';
import { Login } from './Login';
import { Spaces } from './Spaces';
import { useUserName } from '@/zustand/store';

export const Home = () => {
    const [isSubmit, setIsSubmit] = useState(false);

    return <>{!isSubmit ? <Spaces /> : <Login setIsSubmit={setIsSubmit} />}</>;
};
