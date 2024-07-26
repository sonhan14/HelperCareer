// src/redux/employee/employeeSlice.ts

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';

interface EmployeeState {
    newChat: number;
    lastChat: number;
}

const initialState: EmployeeState = {
    newChat: 0,
    lastChat: 0,
};

const employeeSlice = createSlice({
    name: 'employee',
    initialState,
    reducers: {
        setNewChat(state, action: PayloadAction<number>) {
            state.newChat = action.payload;
        },
        setLastChat(state, action: PayloadAction<number>) {
            state.lastChat = action.payload;
        },
    },
});

export const { setNewChat, setLastChat } = employeeSlice.actions;

export default employeeSlice.reducer;

export const selectNewChat = (state: RootState) => state.employee.newChat;
export const selectLastChat = (state: RootState) => state.employee.lastChat;
