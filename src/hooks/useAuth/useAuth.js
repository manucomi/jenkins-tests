import useAuthStore from 'Stores/auth/auth.store';

const useAuth = () => {
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
    const setIsAuthenticated = useAuthStore(
        (state) => state.setIsAuthenticated
    );

    return { isAuthenticated, setIsAuthenticated };
};

export default useAuth;
