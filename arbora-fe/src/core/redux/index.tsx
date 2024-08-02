import {AuthSlice, GlobalAuthState} from "./auth/auth_slice.ts";
import storage from "redux-persist/lib/storage";
import {combineReducers, configureStore, Reducer} from "@reduxjs/toolkit";
import {persistReducer, persistStore} from "redux-persist";
import {Provider} from "react-redux";
import {PersistGate} from "redux-persist/integration/react";
import React from "react";
import {PersistConfig} from "redux-persist/es/types";
import {BrowserRouter} from "react-router-dom";
import {GlobalHomeState, HomeSlice} from "./home/home_slice.ts";

export interface GlobalStoreState {
    auth: GlobalAuthState
    home: GlobalHomeState
}

const reducers: { [key in keyof GlobalStoreState]: Reducer<GlobalStoreState[key]> } = {
    auth: AuthSlice.reducer,
    home: HomeSlice.reducer
}

const persist_config: PersistConfig<GlobalStoreState> = {
    key: 'root',
    storage,
    // do not persist home state
    blacklist: ['home']
}


const persisted_reducer = persistReducer(persist_config, combineReducers(reducers))

export const store = configureStore({
    reducer: persisted_reducer,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({
        serializableCheck: false
    })
})

interface GlobalProviderProps {
    children: React.ReactNode
}

export default function GlobalProvider({children}: GlobalProviderProps) {
    return (
        <Provider store={store}>
            <PersistGate persistor={persistStore(store)} loading={null}>
                <BrowserRouter>
                    {children}
                </BrowserRouter>
            </PersistGate>
        </Provider>
    )
}