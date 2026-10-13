import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import API_URL from "./api";

function Events() {
    const [events, setEvents] = useState([]);
    const navigate = useNavigate();

    const getEvents = async () => {
        try {
            const response = await axios.get(API_URL + "/events");
            setEvents(response.data);
        } catch (error) {
            console.error(error);
            alert("Unable to load events");
        }
    };

    useEffect(() => {
        getEvents();
    }, []);

    const registerForEvent = async (event) => {
        const storedUser = localStorage.getItem("user");

        if (!storedUser) {
            alert("Please login first!");
            navigate("/login");
            return;
        }

        const user = JSON.parse(storedUser);

        if (user.role !== "ATTENDEE") {
            alert("Only attendees can register for events!");
            return;
        }

        const ticket = {
            attendeeName: user.name,
            attendeeEmail: user.email,
            eventId: event.id
        };

        try {
            const response = await axios.post(
                API_URL + "/tickets/register",
                ticket
            );

            alert(
                "Registration successful!\n\nYour Ticket Code: " +
                response.data.ticketCode
            );

        } catch (error) {
            console.error(error);

            if (error.response && error.response.data) {
                alert(error.response.data);
            } else {
                alert("Registration failed");
            }
        }
    };

    return (
        <div className="events-container">

            <h1>Events</h1>

            {localStorage.getItem("user") &&
                JSON.parse(localStorage.getItem("user")).role === "ORGANIZER" && (
                    <button onClick={() => navigate("/create-event")}>
                        Create Event
                    </button>
                )}

            <div className="events-list">

                {events.length === 0 ? (
                    <p>No events available.</p>
                ) : (
                    events.map((event) => (

                        <div className="event-card" key={event.id}>

                            <h2>{event.name}</h2>

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
                                onClick={() => registerForEvent(event)}
                            >
                                Register for Event
                            </button>

                        </div>

                    ))
                )}

            </div>

        </div>
    );
}

export default Events;