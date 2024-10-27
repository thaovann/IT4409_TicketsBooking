import React from 'react';
import { Route, Routes } from 'react-router-dom';
import LoginPage from '../pages/Auth/LoginPage';

const UserRoutes = () => {
    return (
        <Routes>
            <Route path='/login' element={<LoginPage />} />
        </Routes>
    )
}

export default UserRoutes;