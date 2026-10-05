import { Routes, Route } from "react-router-dom";
import Login from "./Login";
import RoomAvailability from "./RoomAvailability";
import BookingForm from "./BookingForm";
import MyBookings from "./MyBookings";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/rooms" element={<RoomAvailability />} />
      <Route path="/book" element={<BookingForm />} />
      <Route path="/my-bookings" element={<MyBookings />} />
    </Routes>
  );
}

export default App;