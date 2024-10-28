import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/Auth/Login/LoginPage';
import RegisterPage from './pages/Auth/Register/RegisterPage';
import HomePage from './pages/User/HomePage';
import AdminPage from './pages/Admin/AdminPage';
import NavBar from './components/NavBar/NavBar';
import ProtectedRoute from './components/ProtectedRoute';
import { useState } from "react";

function App() {
  return (
    <Router>
      <NavBar />
      <div className='App'>
        <Routes>
          <Route path='/' element={<HomePage />} />
          <Route path='/login' element={<LoginPage />} />
          <Route path='/register' element={<RegisterPage />} />

          {/* admin route */}
          <Route
            path='/admin'
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
