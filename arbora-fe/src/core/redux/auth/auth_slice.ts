import {createSlice} from "@reduxjs/toolkit";
import {User} from "../../services/users/types.ts";

export interface GlobalAuthState {
    user: User | null
    access_token: string
    refresh_token: string
    authentication_failed: boolean
}


const initial_state: GlobalAuthState = {
    user: null,
    access_token: '',
    refresh_token: '',
    authentication_failed: false
}

export const AuthSlice = createSlice({
    name: 'auth',
    initialState: initial_state,
    reducers: {
        setUser: (state, action) => {
            state.user = action.payload
            state.authentication_failed = false
        },
        setAccessToken: (state, action) => {
            state.access_token = action.payload
        },
        setRefreshToken: (state, action) => {
            state.refresh_token = action.payload
        },
        logOutUser: (state) => {
            state.authentication_failed = true
        },
        // to be used when user logs out
        clearAuth: (state) => {
            state.user = null
            state.access_token = ''
            state.refresh_token = ''
        }
    }
})

export const {
    setUser,
    setAccessToken,
    setRefreshToken,
    clearAuth,
    logOutUser
} = AuthSlice.actions