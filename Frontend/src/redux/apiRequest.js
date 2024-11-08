import axios from "axios";
import {
  loginFailed,
  loginStart,
  loginSuccess,
  registerStart,
  registerSuccess,
  registerFailed,
} from "./authSlice";

import {
  createEventStart,
  createEventSuccess,
  createEventFailed,
} from "./eventSlice";

// Create an instance with default config
const api = axios.create({
  baseURL: "http://localhost:3001",
  headers: {
    "Content-Type": "application/json",
  },
});

// Axios interceptors to attach the Authorization header if token exists
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const loginUser = async (user, dispatch, navigate) => {
  dispatch(loginStart());
  try {
    const res = await api.post("/auth/login", user);
    const token = res.data.body.token;
    const role = res.data.body._doc.Role;
    localStorage.setItem("token", token);
    localStorage.setItem("role", role);

    dispatch(loginSuccess(res.data));
    navigate("/");
  } catch (error) {
    dispatch(loginFailed());
  }
};

export const registerUser = async (user, dispatch, navigate) => {
  dispatch(registerStart());
  try {
    await api.post("/auth/register", user);
    dispatch(registerSuccess());
    navigate("/login");
  } catch (error) {
    dispatch(registerFailed());
  }
};

export const createEvent = async (eventData, dispatch) => {
  dispatch(createEventStart());
  try {
    // Adjust headers if sending FormData
    const headers =
      eventData instanceof FormData
        ? { "Content-Type": "multipart/form-data" }
        : {};

    // Post the event data to the API
    const response = await api.post("/api/event/create", eventData, {
      headers,
    });
    dispatch(createEventSuccess(response.data));
  } catch (error) {
    console.error("Error creating event:", error);

    // Log detailed error if available
    if (error.response) {
      console.error("Response data:", error.response.data);
      console.error("Response status:", error.response.status);
      console.error("Response headers:", error.response.headers);
    }

    if (eventData instanceof FormData) {
      const data = Object.fromEntries(eventData.entries());
      console.log("FormData contents:", data);
    } else {
      console.log("Event Data:", eventData);
    }

    dispatch(
      createEventFailed(
        error.message || "An error occurred while creating the event."
      )
    );
  }
};
