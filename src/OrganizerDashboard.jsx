import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import API_URL from "./api";

function OrganizerDashboard() {
    const navigate = useNavigate();

    const [user, setUser] = useState(null);
    const [events, setEvents] = useState([]);

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
            alert("Only organizers can access this page!");
            navigate("/events");
            return;
        }

        setUser(loggedInUser);
        loadEvents(loggedInUser);
    };

    const loadEvents = async (loggedInUser) => {
        try {
            const response = await axios.get(
                API_URL + "/events"
            );

            const myEvents = response.data.filter(
                (event) =>
                    event.organizer === loggedInUser.name
            );

            setEvents(myEvents);

        } catch (error) {
            console.error("Error loading events:", error);
            alert("Unable to load events");
        }
    };

    const deleteEvent = async (event) => {
        if (!user) {
            alert("Please login first!");
            return;
        }

        const confirmDelete = window.confirm(
            "Are you sure you want to delete " +
            event.name +
            "?"
        );

        if (!confirmDelete) {
            return;
        }

        try {
            await axios.delete(
                API_URL + "/events/" + event.id,
                {
                    data: {
                        userName: user.name,
                        userRole: user.role
                    }
                }
            );

            alert("Event deleted successfully!");

            loadEvents(user);

        } catch (error) {
            console.error("Delete error:", error);

            if (error.response && error.response.data) {
                alert(error.response.data);
            } else {
                alert("Unable to delete event");
            }
        }
    };

    return (
        <div className="dashboard-container">

            <h1>Organizer Dashboard</h1>

            {user && (
                <p>
                    Welcome, <strong>{user.name}</strong>
                </p>
            )}

            <button
                onClick={() =>
                    navigate("/create-event")
                }
            >
                Create New Event
            </button>

            <h2>My Events</h2>

            {events.length === 0 ? (
                <p>
                    You have not created any events yet.
                </p>
            ) : (
                events.map((event) => (

                    <div
                        className="event-card"
                        key={event.id}
                    >

                        <h3>{event.name}</h3>

                        <p>
                            <strong>Description:</strong>{" "}
                            {event.description}
                        </p>

                        <p>
                            <strong>Venue:</strong>{" "}
                            {event.venue}
                        </p>

                        <p>
                            <strong>Date:</strong>{" "}
                            {event.date}
                        </p>

                        <p>
                            <strong>Time:</strong>{" "}
                            {event.time}
                        </p>

                        <p>
                            <strong>Capacity:</strong>{" "}
                            {event.capacity}
                        </p>

                        <p>
                            <strong>Organizer:</strong>{" "}
                            {event.organizer}
                        </p>

                        <button
                            onClick={() =>
                                navigate(
                                    "/edit-event/" +
                                    event.id
                                )
                            }
                        >
                            Edit Event
                        </button>

                        <button
                            onClick={() =>
                                deleteEvent(event)
                            }
                        >
                            Delete Event
                        </button>

                        <button
                            onClick={() =>
                                navigate(
                                    "/attendance/" +
                                    event.id
                                )
                            }
                        >
                            View Attendance
                        </button>

                    </div>

                ))
            )}

        </div>
    );
}

export default OrganizerDashboard;