//Component hiển thị chi tiết sự kiện

import React from 'react';
import { useParams } from 'react-router-dom';
import useFetch from '../../hooks/useFetch'; 
import Header from '../common/Header'; 
import Footer from '../common/Footer'; 

const EventDetail = () => {
  const { id } = useParams(); // Lấy id từ URL
  const { data, loading, error } = useFetch(`localhost:3001/api/event/getEventByEventId/6719f44da1e351151044b9a2`);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div>
      <Header />
      <h2>{data.title}</h2>
      <p>{data.date}</p>
      <p>{data.location}</p>
      <p>{data.description}</p>
      <Footer />
    </div>
  );
};

export default EventDetail;

