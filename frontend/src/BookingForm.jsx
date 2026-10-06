import { useLocation } from "react-router-dom";
import { useState } from "react";

function BookingForm() {
    const location = useLocation();
    const room = location.state?.room;

    const [startTime, setStartTime] = useState("");
    const [endTime, setEndTime] = useState("");
    const [attendees, setAttendees] = useState("");
    const [message, setMessage] = useState("");

    const handleBooking = async (e) => {
        e.preventDefault();

        if (!room) {
            setMessage("Room not selected");
            return;
        }

        const token = localStorage.getItem("token");

            const response = await fetch(`${import.meta.env.VITE_API_URL}/bookings`, {            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({
                roomId: room._id,
                startTime,
                endTime,
                attendees: Number(attendees)
            })
        });

        const data = await response.json();

        setMessage(data.message);
    };

    return (
        <div style={{ padding: "40px" }}>
            <h1>Book Meeting Room</h1>

            {room && (
                <p>
                    Room: <strong>{room.name}</strong>
                    <br />
                    Capacity: <strong>{room.capacity}</strong> people
                </p>
            )}

            <form onSubmit={handleBooking}>
                <label>Start Time</label>
                <br />
                <input
                    type="datetime-local"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    required
                />

                <br /><br />

                <label>End Time</label>
                <br />
                <input
                    type="datetime-local"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    required
                />

                <br /><br />

                <label>Number of Attendees</label>
                <br />
                <input
                    type="number"
                    value={attendees}
                    onChange={(e) => setAttendees(e.target.value)}
                    min="1"
                    required
                />

                <br /><br />

                <button type="submit">
                    Confirm Booking
                </button>
            </form>

            {message && <p>{message}</p>}
        </div>
    );
}

export default BookingForm;