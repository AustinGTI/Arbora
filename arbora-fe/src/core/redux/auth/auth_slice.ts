import {createSlice} from "@reduxjs/toolkit";

export interface GlobalAuthState {
    user: Object | null
    access_token: string
    refresh_token: string
}


const initial_state: GlobalAuthState = {
    user: null,
    access_token: '',
    refresh_token: ''
}

export const AuthSlice = createSlice({
    name: 'auth',
    initialState: initial_state,
    reducers: {
        setUser: (state, action) => {
            state.user = action.payload
        },
        setAccessToken: (state, action) => {
            state.access_token = action.payload
        },
        setRefreshToken: (state, action) => {
            state.refresh_token = action.payload
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
    clearAuth
} = AuthSlice.actions