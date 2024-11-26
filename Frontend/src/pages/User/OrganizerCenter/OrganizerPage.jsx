// route cho organizer center
import React from "react";
import { Routes, Route } from "react-router-dom";
import MyEvents from "./MyEvents";
// import SideNav from "./components/SideNav";
// import NavBar from "./components/NavBar";

function OrganizerPage() {
    return (
        <>
            <Routes>
                <Route path="/" element={<MyEvents />} />
            </Routes>
        </>
    );
}


export default OrganizerPage;