import { createSlice } from "@reduxjs/toolkit";

interface ILayout {
    layout: boolean;
}

const initialState: ILayout = {
    layout: true,
};

const layoutSlice = createSlice({
    name: "theme",
    initialState,
    reducers: {
        toggleLayout: (state: ILayout) => {
            state.layout = !state.layout;
        },
    },
});

export const { toggleLayout } = layoutSlice.actions;

export default layoutSlice.reducer;
