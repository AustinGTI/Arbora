import {AuthSlice, GlobalAuthState} from "./auth/auth_slice.ts";
import storage from "redux-persist/lib/storage";
import {combineReducers, configureStore, Reducer} from "@reduxjs/toolkit";
import {persistReducer, persistStore} from "redux-persist";
import {Provider} from "react-redux";
import {PersistGate} from "redux-persist/integration/react";
import React from "react";
import {PersistConfig} from "redux-persist/es/types";
import {BrowserRouter} from "react-router-dom";

export interface GlobalStoreState {
    auth: GlobalAuthState
}

const reducers: { [key in keyof GlobalStoreState]: Reducer<GlobalStoreState[key]> } = {
    auth: AuthSlice.reducer
}

const persist_config: PersistConfig<GlobalStoreState> = {
    key: 'root',
    storage
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