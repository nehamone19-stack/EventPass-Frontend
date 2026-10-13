import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import API_URL from "./api";

function CreateEvent() {
    const navigate = useNavigate();

    const [user, setUser] = useState(null);

    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [venue, setVenue] = useState("");
    const [date, setDate] = useState("");
    const [time, setTime] = useState("");
    const [capacity, setCapacity] = useState("");

    useEffect(() => {
        checkOrganizer();
    }, []);

    const checkOrganizer = () => {
        const storedUser = localStorage.getItem("user");

        if (!storedUser) {
            alert("Please login first!");
            navigate("/login");
            return;
        }

        const loggedInUser = JSON.parse(storedUser);

        if (loggedInUser.role !== "ORGANIZER") {
            alert("Only organizers can create events!");
            navigate("/events");
            return;
        }

        setUser(loggedInUser);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!user) {
            alert("Only organizers can create events!");
            return;
        }

        if (user.role !== "ORGANIZER") {
            alert("Only organizers can create events!");
            return;
        }

        const event = {
            name: name,
            description: description,
            venue: venue,
            date: date,
            time: time,
            capacity: Number(capacity),
            organizer: user.name
        };

        try {
            await axios.post(
                API_URL + "/events",
                event
            );

            alert("Event created successfully!");

            navigate("/organizer-dashboard");

        } catch (error) {
            console.error("Create event error:", error);
            alert("Unable to create event");
        }
    };

    return (
        <div className="form-container">

            <h1>Create Event</h1>

            <form onSubmit={handleSubmit}>

                <input
                    type="text"
                    placeholder="Event Name"
                    value={name}
                    onChange={(e) =>
                        setName(e.target.value)
                    }
                    required
                />

                <textarea
                    placeholder="Description"
                    value={description}
                    onChange={(e) =>
                        setDescription(e.target.value)
                    }
                    required
                />

                <input
                    type="text"
                    placeholder="Venue"
                    value={venue}
                    onChange={(e) =>
                        setVenue(e.target.value)
                    }
                    required
                />

                <input
                    type="date"
                    value={date}
                    onChange={(e) =>
                        setDate(e.target.value)
                    }
                    required
                />

                <input
                    type="time"
                    value={time}
                    onChange={(e) =>
                        setTime(e.target.value)
                    }
                    required
                />

                <input
                    type="number"
                    placeholder="Capacity"
                    value={capacity}
                    onChange={(e) =>
                        setCapacity(e.target.value)
                    }
                    required
                />

                <p>
                    <strong>Organizer:</strong>{" "}
                    {user ? user.name : ""}
                </p>

                <button type="submit">
                    Create Event
                </button>

            </form>

        </div>
    );
}

export default CreateEvent;