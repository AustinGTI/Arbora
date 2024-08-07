import useGlobalAuthState from "./useGlobalAuthState.tsx";

export default function useUserLoggedOut(): boolean {
    const {authentication_failed} = useGlobalAuthState()
    return authentication_failed
}