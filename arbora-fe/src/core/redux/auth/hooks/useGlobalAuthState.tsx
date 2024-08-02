import {useArboraSelector} from "../../types.ts";

export default function useGlobalAuthState() {
    return useArboraSelector(state => state.auth)
}