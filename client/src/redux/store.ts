import { combineReducers, configureStore } from "@reduxjs/toolkit";
import userReducer from "./user/userSlice";
import themeReducer from "./theme/themeSlice";
import localStorage from "redux-persist/lib/storage";
import sessionStorage from "redux-persist/lib/storage/session";
import { persistReducer, persistStore } from "redux-persist";

const userPersistConfig = {
    key: "user",
    storage: sessionStorage,
    version: 1,
};

const themePersistConfig = {
    key: "theme",
    storage: localStorage,
    version: 1,
};

const persistanceUserReducer = persistReducer(userPersistConfig, userReducer);
const persistanceThemeReducer = persistReducer(
    themePersistConfig,
    themeReducer
);

const rootReducer = combineReducers({
    user: persistanceUserReducer,
    theme: persistanceThemeReducer,
});

export const store = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({ serializableCheck: false }),
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;

export const persistor = persistStore(store);
