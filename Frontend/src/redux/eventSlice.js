import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  events: [],
  isLoading: false,
  error: null,
};

const eventSlice = createSlice({
  name: "event",
  initialState,
  reducers: {
    createEventStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    createEventSuccess: (state, action) => {
      state.isLoading = false;
      state.events.push(action.payload); // Add the new event to the events array
    },
    createEventFailed: (state, action) => {
      state.isLoading = false;
      state.error = action.payload || "Failed to create event"; // Capture error message
    },
  },
});

// Export actions
export const { createEventStart, createEventSuccess, createEventFailed } =
  eventSlice.actions;

// Export reducer
export default eventSlice.reducer;
