// route cho organizer center
import React from "react";
import { Routes, Route } from "react-router-dom";
import MyEvents from "./pages/MyEvents";
import CreateEventPage from "./pages/CreateEventPage";
import EventDetailPage from "./pages/EventDetailPage";
// import SideNav from "./components/SideNav";
// import NavBar from "./components/NavBar";

function OrganizerPage() {
    return (
        <>
            <Routes>
                <Route path="/" element={<MyEvents />} />
                <Route path="/events" element={<MyEvents />} />
                <Route path="/create-event" element={<CreateEventPage />} />
                <Route path="/events/:id" element={<EventDetailPage />} />
            </Routes>
        </>
    );
}


export default OrganizerPage;