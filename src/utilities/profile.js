import { useAuthState, useDbData } from "./firebase";

export const useProfile = () => {
    const [user] = useAuthState();
    const [data, error] =  useDbData(`/users/${user?.uid || 'guest'}`);
    return [user, data, error];
};