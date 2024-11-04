import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import eventReducer from "./eventSlice"; // Import the event slice

const store = configureStore({
  reducer: {
    auth: authReducer,
    event: eventReducer, // Add the event slice here
  },
});

export default store;
