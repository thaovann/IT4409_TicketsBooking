import React from 'react';
import { Provider } from 'react-redux';
import { store } from './redux/store';
import LoginPage from './pages/Auth/LoginPage';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import EventsPage from "./pages/EventsPage";
import EventDetail from "./components/events/EventDetail"; // Import trang chi tiết sự kiện
import SearchResults from "./components/events/SearchResult"; // Import trang chi tiết sự kiện

function App() {
  return (
    <Provider store={store}>
      <Router>
        <div className="App">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/events" element={<EventsPage />} />
            <Route path="/events/:id" element={<EventDetail />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/search" element={<SearchResults />} />
          </Routes>
        </div>
      </Router>
    </Provider>
  );
}

export default App;

