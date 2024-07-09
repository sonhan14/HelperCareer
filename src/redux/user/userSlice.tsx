import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store'; // Đường dẫn tới file rootReducer của bạn
import { iUser } from '../../../types/userType'; // Đường dẫn đến kiểu dữ liệu của bạn

interface UserState {
    userData: iUser | null;
}

const initialState: UserState = {
    userData: null,
};

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setUserData(state, action: PayloadAction<iUser | null>) {
            state.userData = action.payload;
        },
        clearUserData(state) {
            state.userData = null;
        },
    },
});

export const { setUserData, clearUserData } = userSlice.actions;

export default userSlice.reducer;

// Selector để lấy userData từ store
export const selectUserData = (state: RootState) => state.user.userData;
