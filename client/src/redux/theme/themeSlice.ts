import { createSlice } from "@reduxjs/toolkit";

interface ITheme {
    theme: string;
}

const initialState: ITheme = {
    theme: "light",
};

const themeSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        toggleTheme: (state: ITheme) => {
            state.theme = state.theme === "light" ? "dark" : "light";
        },
    },
});

export const { toggleTheme } = themeSlice.actions;

export default themeSlice.reducer;
