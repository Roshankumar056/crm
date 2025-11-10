import { configureStore } from "@reduxjs/toolkit";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import auth from "./slices/auth";
import leads from "./slices/leads";
import users from "./slices/users";
import activities from "./slices/activities";
import analytics from "./slices/analytics";

export const store = configureStore({
  reducer: { auth, leads, users, activities, analytics }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
