import useUserStore from '../../stores/user/user.store';

const useUser = () => {
    const profile = useUserStore((state) => state.profile);
    const setProfile = useUserStore((state) => state.setProfile);
    const deleteProfile = useUserStore((state) => state.deleteProfile);

    return { profile, setProfile, deleteProfile };
};

export default useUser;
