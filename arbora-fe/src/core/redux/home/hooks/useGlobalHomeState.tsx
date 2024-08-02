import {useArboraSelector} from "../../types.ts";

export default function useGlobalHomeState() {
    return useArboraSelector(state => state.home)
}
