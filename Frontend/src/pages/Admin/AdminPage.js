// const AdminPage = () => {
//     return (
//         <div>
//             ADMIN PAGE
//         </div>
//     )
// }

import React from "react";
import { Routes, Route } from "react-router-dom";
import SideBar from "./SideBar";
import ManageUsers from "./ManageUsers";

function AdminPage() {
    return (
        <div style={{ display: 'flex' }}>
            <SideBar />
            <div style={{ flex: 1 }}>
                <Routes>
                    <Route path="manage-users" element={<ManageUsers />} />
                </Routes>
            </div>
        </div>
    )
}

export default AdminPage;