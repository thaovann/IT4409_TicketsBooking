import { configureStore } from "@reduxjs/toolkit";
import authReducer from './authSlice';

// khởi tạo redux store với authReducer
export default configureStore({
    reducer: {
        auth: authReducer,
    },
})

