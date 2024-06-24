import { createSlice } from "@reduxjs/toolkit";

interface IUser {
    _id: number;
    nickname: string;
    email: string;
    profileUrl: string;
    socialLogin: boolean;
    admin: boolean;
    createdAt: Date;
    updatedAt: Date;
}

interface IUserToken {
    currentUser: IUser | null;
    error?: any;
    loading: boolean;
}

const initialState: IUserToken = {
    currentUser: null,
    error: null,
    loading: false,
};

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        errorReset: (state) => {
            state.loading = false;
            state.error = null;
        },
        logInStart: (state) => {
            state.loading = true;
            state.error = null;
        },
        logInSuccess: (state, action) => {
            state.currentUser = action.payload;
            state.loading = false;
            state.error = null;
        },
        logInFailure: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },
        updateToken: (state, action) => {
            state.currentUser = action.payload;
            state.loading = false;
            state.error = null;
        },
        deleteUserStart: (state) => {
            state.loading = true;
            state.error = null;
        },
        deleteUserSuccess: (state) => {
            state.currentUser = null;
            state.loading = false;
            state.error = null;
        },
        deleteUserFailure: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },
        logoutSuccess: (state) => {
            state.currentUser = null;
            state.loading = false;
            state.error = null;
        },
    },
});

export const {
    errorReset,
    logInStart,
    logInSuccess,
    logInFailure,
    updateToken,
    deleteUserStart,
    deleteUserSuccess,
    deleteUserFailure,
    logoutSuccess,
} = userSlice.actions;

export default userSlice.reducer;
