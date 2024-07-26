import { configureStore } from '@reduxjs/toolkit';
import userReducer from './user/userSlice';
import employeeReducer from './chat/chatSlice'

export const store = configureStore({
    reducer: {
        user: userReducer,
        employee: employeeReducer,
        // Add other reducers as needed
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
