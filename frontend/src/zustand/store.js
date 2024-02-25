import { create } from 'zustand';

export const useUserName = create(set => ({
    username: null,
    spaceName: null,
    //function to set the username
    setUsername: username => set({ username }),
    removeUsername: () => set({ username: null }),
    setSpaceName: spaceName => set({ spaceName }),
    removeSpaceName: () => set({ spaceName: null }),
}));
