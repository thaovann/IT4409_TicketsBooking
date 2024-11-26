// route cho organizer center
import React from "react";
import { Routes, Route } from "react-router-dom";
import MyEvents from "./MyEvents";
import CreateEventPage from "./CreateEventPage";
// import SideNav from "./components/SideNav";
// import NavBar from "./components/NavBar";

function OrganizerPage() {
    return (
        <>
            <Routes>
                <Route path="/" element={<MyEvents />} />
                <Route path="/events" element={<MyEvents />} />
                <Route path="/create-event" element={<CreateEventPage />} />
            </Routes>
        </>
    );
}


export default OrganizerPage;