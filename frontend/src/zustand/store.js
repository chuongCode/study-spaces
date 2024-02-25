import { create } from 'zustand';

const useStore = create(set => ({
    username: null,
    //function to set the username
    setUsername: username => set({ username }),
    removeUsername: () => set({ username: null }),
}));

export default useStore;
