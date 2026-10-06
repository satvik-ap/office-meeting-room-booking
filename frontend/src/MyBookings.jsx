import { useEffect, useState } from "react";

function MyBookings() {
    const [bookings, setBookings] = useState([]);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchBookings = async () => {
            const token = localStorage.getItem("token");

            try {
                const response = await fetch(
                    `${import.meta.env.VITE_API_URL}/bookings/my`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(
                        data.message || "Unable to load bookings"
                    );
                }

                setBookings(data);
            } catch (error) {
                setError(error.message);
            }
        };

        fetchBookings();
    }, []);

    return (
        <div style={{ padding: "40px" }}>
            <h1>My Bookings</h1>

            {error && <p>{error}</p>}

            {bookings.length === 0 && !error && (
                <p>No bookings found.</p>
            )}

            {bookings.map((booking) => (
                <div
                    key={booking._id}
                    style={{
                        border: "1px solid #ddd",
                        padding: "20px",
                        marginBottom: "15px",
                        borderRadius: "8px"
                    }}
                >
                    <h3>{booking.room.name}</h3>

                    <p>
                        Start:{" "}
                        {new Date(
                            booking.startTime
                        ).toLocaleString()}
                    </p>

                    <p>
                        End:{" "}
                        {new Date(
                            booking.endTime
                        ).toLocaleString()}
                    </p>

                    <p>
                        Attendees: {booking.attendees}
                    </p>

                    {booking.capacityExceeded && (
                        <p>Capacity exceeded</p>
                    )}
                </div>
            ))}
        </div>
    );
}

export default MyBookings;