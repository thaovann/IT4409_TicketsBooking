//trang danh sách sự kiện
// src/pages/EventsPage.jsx
import React from 'react';
import useFetch from '../hooks/useFetch';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';
import EventCard from '../components/events/EventCard';

const EventsPage = () => {
  const { data, loading, error } = useFetch('https://api.example.com/events');

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div>
      <Header />
      <h2>Events</h2>
      <div>
        {data && data.map(event => (
          <EventCard key={event.id} event={event} />
        ))}
      </div>
      <Footer />
    </div>
  );
};

export default EventsPage;
