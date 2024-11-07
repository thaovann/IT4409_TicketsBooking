//trang đặt vé
import React from 'react';
import Header from '../../components/common/Header';
import Footer from '../../components/common/Footer';
import "./TicketBookingPage.css"

const TicketBookingPage = () => {
  return (
    <div>
      <Header hideCreateEvent={true} />

      <h2>Book Your Tickets</h2>
      <form>
        <label>
          Name:
          <input type="text" required />
        </label>
        <label>
          Email:
          <input type="email" required />
        </label>
        <label>
          Number of Tickets:
          <input type="number" min="1" required />
        </label>
        <button type="submit">Book Now</button>
      </form>
      <Footer />
    </div>
  );
};

export default TicketBookingPage;
