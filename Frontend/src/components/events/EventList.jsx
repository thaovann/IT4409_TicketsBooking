// // EventList.jsx
// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import EventCard from "./EventCard";  // Đảm bảo bạn đã import đúng EventCard

// const EventList = () => {
//   const [events, setEvents] = useState([]);

//   useEffect(() => {
//     const fetchEvents = async () => {
//       try {
//         // Lấy tất cả sự kiện
//         const eventResponse = await axios.get("http://localhost:3001/api/event/allEvents");
//         const eventsData = eventResponse.data;

//         // Lấy vé cho từng sự kiện
//         const eventsWithPrices = await Promise.all(
//           eventsData.map(async (event) => {
//             const ticketResponse = await axios.get(`http://localhost:3001/api/ticket/getTicketCategoriesByEvent/${event._id}`);
//             const tickets = ticketResponse.data.ticketCategories;
//             const minPrice = Math.min(...tickets.map(ticket => ticket.price));

//             // Trả về sự kiện với giá vé nhỏ nhất
//             return { ...event, minPrice };
//           })
//         );
//         setEvents(eventsWithPrices);  // Cập nhật danh sách sự kiện đã có giá vé
//       } catch (error) {
//         console.error("Lỗi khi lấy sự kiện:", error);
//       }
//     };

//     fetchEvents();
//   }, []);

//   return (
//     <div className="events-list">
//       {events.length > 0 ? (
//         events.map((event) => (
//           <EventCard key={event._id} event={event} />
//         ))
//       ) : (
//         <p>Loading...</p>
//       )}
//     </div>
//   );
// };

// export default EventList;
