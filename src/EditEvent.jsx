import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import API_URL from "./api";

function EditEvent() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [user, setUser] = useState(null);

    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [venue, setVenue] = useState("");
    const [date, setDate] = useState("");
    const [time, setTime] = useState("");
    const [capacity, setCapacity] = useState("");

    useEffect(() => {
        const storedUser = localStorage.getItem("user");

        if (!storedUser) {
            alert("Please login first!");
            navigate("/login");
            return;
        }

        const loggedInUser = JSON.parse(storedUser);

        if (
            loggedInUser.role !== "ORGANIZER" &&
            loggedInUser.role !== "ADMIN"
        ) {
            alert("You are not allowed to edit events!");
            navigate("/events");
            return;
        }

        setUser(loggedInUser);
        loadEvent(loggedInUser);
    }, [id, navigate]);

    const loadEvent = async (loggedInUser) => {
        try {
            const response = await axios.get(
                API_URL + "/events/" + id
            );

            const event = response.data;

            if (!event) {
                alert("Event not found!");
                navigate("/events");
                return;
            }

            // Organizer can edit only their own event
            if (
                loggedInUser.role === "ORGANIZER" &&
                event.organizer !== loggedInUser.name
            ) {
                alert("You can only edit your own events!");
                navigate("/organizer-dashboard");
                return;
            }

            setName(event.name);
            setDescription(event.description);
            setVenue(event.venue);
            setDate(event.date);
            setTime(event.time);
            setCapacity(event.capacity);

        } catch (error) {
            console.error("Error loading event:", error);
            alert("Unable to load event");
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!user) {
            alert("Please login first!");
            return;
        }

        const updatedEvent = {
            userName: user.name,
            userRole: user.role,
            name: name,
            description: description,
            venue: venue,
            date: date,
            time: time,
            capacity: Number(capacity)
        };

        try {
            await axios.put(
                API_URL + "/events/" + id,
                updatedEvent
            );

            alert("Event updated successfully!");

            if (user.role === "ADMIN") {
                navigate("/admin-dashboard");
            } else {
                navigate("/organizer-dashboard");
            }

        } catch (error) {
            console.error("Update error:", error);

            if (error.response && error.response.data) {
                alert(error.response.data);
            } else {
                alert("Unable to update event");
            }
        }
    };

    return (
        <div className="form-container">
            <h1>Edit Event</h1>

            <form onSubmit={handleSubmit}>

                <input
                    type="text"
                    placeholder="Event Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                />

                <textarea
                    placeholder="Description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                />

                <input
                    type="text"
                    placeholder="Venue"
                    value={venue}
                    onChange={(e) => setVenue(e.target.value)}
                    required
                />

                <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    required
                />

                <input
                    type="time"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    required
                />

                <input
                    type="number"
                    placeholder="Capacity"
                    value={capacity}
                    onChange={(e) => setCapacity(e.target.value)}
                    required
                />

                <p>
                    <strong>Organizer:</strong>{" "}
                    {user ? user.name : ""}
                </p>

                <button type="submit">
                    Update Event
                </button>

                <button
                    type="button"
                    onClick={() => {
                        if (user && user.role === "ADMIN") {
                            navigate("/admin-dashboard");
                        } else {
                            navigate("/organizer-dashboard");
                        }
                    }}
                >
                    Cancel
                </button>

            </form>
        </div>
    );
}

export default EditEvent;