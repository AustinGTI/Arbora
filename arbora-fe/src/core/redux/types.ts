import {TypedUseSelectorHook, useSelector} from "react-redux";
import {GlobalStoreState} from "./index.tsx";

export const useArboraSelector: TypedUseSelectorHook<GlobalStoreState> = useSelector