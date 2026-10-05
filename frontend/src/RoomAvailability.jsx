import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL;

function RoomAvailability() {
    const navigate = useNavigate();

    const [rooms, setRooms] = useState([]);
    const [date, setDate] = useState("");
    const [time, setTime] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const token = localStorage.getItem("token");

    useEffect(() => {
        if (!token) {
            navigate("/");
        }
    }, [token, navigate]);

    const checkAvailability = async () => {
        if (!date || !time) {
            setError("Please select a date and time.");
            return;
        }

        try {
            setLoading(true);
            setError("");

            const response = await fetch(
                `${API_URL}/rooms/available?date=${date}&time=${time}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            const data = await response.json();

            if (response.status === 401) {
                localStorage.removeItem("token");
                navigate("/");
                return;
            }

            if (!response.ok) {
                throw new Error(data.message || "Unable to load rooms");
            }

            setRooms(data);
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    const logout = () => {
        localStorage.removeItem("token");
        navigate("/");
    };

    return (
        <div className="rooms-page">
            <header className="topbar">
                <div>
                    <h1>Meeting Room Booking</h1>
                    <p>Check room availability</p>
                </div>

                <button
                    className="logout-button"
                    onClick={logout}
                >
                    Logout
                </button>
            </header>

            <main className="rooms-container">
                <section className="search-card">
                    <h2>Room Availability</h2>

                    <div className="search-form">
                        <div>
                            <label>Date</label>

                            <input
                                type="date"
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                            />
                        </div>

                        <div>
                            <label>Time</label>

                            <input
                                type="time"
                                value={time}
                                onChange={(e) => setTime(e.target.value)}
                            />
                        </div>

                        <button
                            onClick={checkAvailability}
                            disabled={loading}
                        >
                            {loading
                                ? "Checking..."
                                : "Check Availability"}
                        </button>
                    </div>

                    {error && (
                        <div className="error">
                            {error}
                        </div>
                    )}
                </section>

                <section>
                    <h2>Available Rooms</h2>

                    {!loading && rooms.length === 0 && !error && (
                        <div className="empty-state">
                            Select a date and time to check available rooms.
                        </div>
                    )}

                    <div className="room-grid">
                        {rooms.map((room) => (
                            <div
                                className="room-card"
                                key={room._id}
                            >
                                <div className="room-card-header">
                                    <h3>{room.name}</h3>

                                    <span className="available">
                                        Available
                                    </span>
                                </div>

                                <p>
                                    Capacity:{" "}
                                    <strong>{room.capacity}</strong>{" "}
                                    people
                                </p>

                                <button
                                    onClick={() =>
                                        navigate("/book", {
                                            state: {
                                                room,
                                                date,
                                                time
                                            }
                                        })
                                    }
                                >
                                    Book Room
                                </button>
                            </div>
                        ))}
                    </div>
                </section>
            </main>
        </div>
    );
}

export default RoomAvailability;