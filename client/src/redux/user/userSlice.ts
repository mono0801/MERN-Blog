import { createSlice } from "@reduxjs/toolkit";

interface IUser {
    nickname: string;
    email: string;
    password: string;
    socialLogin: boolean;
    createdAt: Date;
    updatedAt: Date;
    profileUrl: string;
}

export interface IUserToken {
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
    },
});

export const { logInStart, logInSuccess, logInFailure } = userSlice.actions;

export default userSlice.reducer;
