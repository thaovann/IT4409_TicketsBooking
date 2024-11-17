import React from "react";
import { Routes, Route } from "react-router-dom";
import SideBar from "./SideBar";
import ManageUsers from "./ManageUsers";
import ManageEvents from "./ManageEvents";
import SideNav from "./components/SideNav";

function AdminPage() {
    return (
        <div>
            <SideNav />
            <Routes>
                <Route path="manage-events" element={<ManageEvents />} />
                <Route path="manage-users" element={<ManageUsers />} />
            </Routes>
        </div>
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