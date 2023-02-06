import create from 'zustand';

const useAuthStore = create((set) => ({
    isAuthenticated: false,
    setIsAuthenticated: (isAuthenticated) => set(() => ({ isAuthenticated })),
}));

export default useAuthStore;
