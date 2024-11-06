import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Provider } from "react-redux";
import  store from "./redux/store";
import LoginPage from "./pages/Auth/Login/LoginPage";
import RegisterPage from "./pages/Auth/Register/RegisterPage";
import HomePage from "./pages/User/HomePage";
import AdminPage from "./pages/Admin/AdminPage";
import EventsPage from "./pages/User/EventsPage";
import EventDetail from "./components/events/EventDetail";
import SearchResults from "./components/events/SearchResult";
import NavBar from "./components/NavBar/NavBar";
import ProtectedRoute from "./components/ProtectedRoute";
import TicketBookingPage from "./pages/User/TicketBookingPage";
import PurchasedTickets from "./components/events/PurchasedTickets";
import './App.css';

function App() {
  return (
    <Provider store={store}>
      <Router>
        <NavBar />
        <div className="App">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/events" element={<EventsPage />} />
            <Route path="/events/:id" element={<EventDetail />} />
            <Route path="/search" element={<SearchResults />} />
            <Route path="/booking/:eventId" element={<TicketBookingPage />} />
            <Route path="/purchased-tickets" element={<PurchasedTickets />} />


            {/* Admin route */}
            <Route
              path="/admin"
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
