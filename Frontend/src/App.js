import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/Auth/Login/LoginPage";
import RegisterPage2 from "./pages/Auth/Register/RegisterPage2";
import HomePage from "./pages/User/HomePage";
import AdminPage from "./pages/Admin/AdminPage";
import EventsPage from "./pages/User/EventsPage";
import EventDetail from "./components/events/EventDetail";
import SearchResults from "./components/events/SearchResult";
import ProtectedRoute from "./components/ProtectedRoute";
import OrganizerEvents from "./pages/EventManager/OrganizerEvents";
import CreateEventForm from "./pages/EventManager/CreateEventForm";
import CreateTicketCategoryForm from "./pages/EventManager/CreateTicketCategoryForm";
import ForgotPassword from "./pages/Auth/ChangePassword/ForgotPassword";
import ResetPassword from "./pages/Auth/ChangePassword/ResetPassword";
import VerifyOTP from "./pages/Auth/ChangePassword/VerifyOTP";
import TicketBookingPage from "./pages/User/TicketBookingPage";
import PurchasedTickets from "./components/events/PurchasedTickets";
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Trang home */}
          <Route path="/" element={<HomePage />} />

          {/* Auth routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage2 />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/verify-otp" element={<VerifyOTP />} />

          {/* Trang event */}
          <Route path="/events" element={<EventsPage />} />
          <Route path="/events/:id" element={<EventDetail />} />
          <Route path="/search" element={<SearchResults />} />
          <Route path="organizer/events" element={<OrganizerEvents />} />
          <Route
            path="organizer/create-event"
            element={<CreateEventForm />}
          />
          <Route
            path="organizer/create-ticket"
            element={<CreateTicketCategoryForm />}
          />
          <Route path="/booking/:eventId" element={<TicketBookingPage />} />
          <Route path="/purchased-tickets" element={<PurchasedTickets />} />


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
  );
}

export default App;
