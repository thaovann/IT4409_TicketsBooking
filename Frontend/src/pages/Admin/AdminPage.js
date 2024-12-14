import React from "react";
import { Routes, Route } from "react-router-dom";
import ManageUsers from "./ManageUsers";
import ManageEvents from "./ManageEvents";
import ManageOrders from "./ManageOrders";
import AdminEventDetail from "./AdminEventDetail";

function AdminPage() {
    return (
        <>
            <Routes>
                <Route path="/" element={<ManageUsers />} />
                <Route path="/manage-events" element={<ManageEvents />} />
                <Route path="/manage-users" element={<ManageUsers />} />
                <Route path="/manage-events/:id" element={<AdminEventDetail />} />
                <Route path="/manage-orders" element={<ManageOrders />} />
            </Routes>
        </>
    );
}


export default AdminPage;