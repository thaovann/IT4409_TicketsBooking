import { Routes, Route } from 'react-router-dom';
import AdminLayout from './pages/AdminLayout';
import DashBoard from './pages/Dashboard';
import ManageEvents from './pages/ManageEvents';
import ManageOrders from './pages/ManageOrders';
import ManageUsers from './pages/ManageUsers';

export default function AdminRoutes() {
    return (
        <Routes>
            <Route path='/' element={<AdminLayout />}>
                <Route index element={<DashBoard />} />
                <Route path='events' element={<ManageEvents />} />
                <Route path='orders' element={<ManageOrders />} />
                <Route path='users' element={<ManageUsers />} />
            </Route>
        </Routes>
    );
}