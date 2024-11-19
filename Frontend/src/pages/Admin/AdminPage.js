import React from "react";
import { Routes, Route } from "react-router-dom";
import ManageUsers from "./ManageUsers";
import ManageEvents from "./ManageEvents";
import DashBoard from "./DashBoard";

function AdminPage() {
    return (
        <>
            <Routes>
                <Route path="/" element={<DashBoard />} />
                <Route path="/manage-events" element={<ManageEvents />} />
                <Route path="/manage-users" element={<ManageUsers />} />
            </Routes>
        </>
        // <div style={{ display: 'flex', minHeight: '100vh' }}>
        //     <SideBar />
        //     <div style={{ flex: 1, marginLeft: 100, overflow: 'auto' }}>
        //         <Routes>
        //             <Route path="manage-events" element={<ManageEvents />} />
        //             <Route path="manage-users" element={<ManageUsers />} />
        //         </Routes>
        //     </div>
        // </div>
    );
}


export default AdminPage;