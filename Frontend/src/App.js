import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Provider } from "react-redux";
import store from "./redux/store";
import LoginPage from "./pages/Auth/Login/LoginPage";
import RegisterPage from "./pages/Auth/Register/RegisterPage";
import HomePage from "./pages/User/HomePage";
//import HomePage from "./pages/HomePage"
import AdminPage from "./pages/Admin/AdminPage";
import EventsPage from "./pages/EventsPage";
import EventDetail from "./components/events/EventDetail";
import SearchResults from "./components/events/SearchResult";
import NavBar from "./components/NavBar/NavBar";
import ProtectedRoute from "./components/ProtectedRoute";
import PublicRoute from "./components/PublicRoute";
import ForgotPassword from "./pages/Auth/ChangePassword/ForgotPassword";
import ResetPassword from "./pages/Auth/ChangePassword/ResetPassword";
import VerifyOTP from "./pages/Auth/ChangePassword/VerifyOTP";
import OrganizerEvents from "./pages/EventManager/OrganizerEvents";
import CreateEventForm from "./pages/EventManager/CreateEventForm"

function App() {
  return (
    <Provider store={store}>
      <Router>
        <NavBar />
        <div className="App">
          <Routes>
            {/* Trang home */}
            <Route path="/" element={<HomePage />} />

            {/* Auth routes */}
            {/* <Route path="/login" element={
              <PublicRoute>
                <LoginPage />
              </PublicRoute>
            } />
            <Route path="/register" element={
              <PublicRoute>
                <RegisterPage />
              </PublicRoute>
            } /> */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/verify-otp" element={<VerifyOTP />} />

            {/* Trang event */}
            <Route path="/events" element={<EventsPage />} />
            <Route path="/events/:id" element={<EventDetail />} />
            <Route path="/search" element={<SearchResults />} />
            <Route path="organizer/events" element={<OrganizerEvents />} />
            <Route path="organizer/create-event" element={<CreateEventForm />} />

            {/* Admin route */}
            <Route
              path="/admin/*"
              element={
                <ProtectedRoute role={1}>
                  <AdminPage />
                </ProtectedRoute>
              }
            />
          </Routes>
        </div>
      </Router>
    </Provider>
  );
}

export default App;
