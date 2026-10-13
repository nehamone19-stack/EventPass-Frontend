import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import API_URL from "./api";

function Attendance() {
    const { eventId } = useParams();
    const navigate = useNavigate();

    const [attendance, setAttendance] = useState([]);
    const [event, setEvent] = useState(null);

    useEffect(() => {
        checkAccess();
    }, [eventId]);

    const checkAccess = async () => {
        const storedUser = localStorage.getItem("user");

        if (!storedUser) {
            alert("Please login first!");
            navigate("/login");
            return;
        }

        const user = JSON.parse(storedUser);

        if (user.role !== "ORGANIZER") {
            alert("Only organizers can view attendance!");
            navigate("/events");
            return;
        }

        await loadEvent(user);
    };

    const loadEvent = async (user) => {
        try {
            const response = await axios.get(
                API_URL + "/events/" + eventId
            );

            const eventData = response.data;

            // Check that this organizer owns the event
            if (eventData.organizer !== user.name) {
                alert("You can only view attendance for your own events!");
                navigate("/organizer-dashboard");
                return;
            }

            setEvent(eventData);

            loadAttendance();

        } catch (error) {
            console.error(error);
            alert("Unable to load event");
            navigate("/organizer-dashboard");
        }
    };

    const loadAttendance = async () => {
        try {
            const response = await axios.get(
                API_URL + "/attendance/event/" + eventId
            );

            setAttendance(response.data);

        } catch (error) {
            console.error(error);
            alert("Unable to load attendance");
        }
    };

    return (
        <div className="attendance-container">

            <button
                onClick={() => navigate("/organizer-dashboard")}
            >
                Back to Dashboard
            </button>

            {event && (
                <>
                    <h1>Attendance</h1>

                    <h2>{event.name}</h2>

                    <p>
                        <strong>Venue:</strong> {event.venue}
                    </p>

                    <p>
                        <strong>Date:</strong> {event.date}
                    </p>

                    <p>
                        <strong>Time:</strong> {event.time}
                    </p>

                    <p>
                        <strong>Total Capacity:</strong>{" "}
                        {event.capacity}
                    </p>

                    <p>
                        <strong>Checked In:</strong>{" "}
                        {attendance.length}
                    </p>
                </>
            )}

            {attendance.length === 0 ? (
                <p>No attendees have checked in yet.</p>
            ) : (
                <table>

                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Ticket Code</th>
                            <th>Check-in Time</th>
                            <th>Status</th>
                        </tr>
                    </thead>

                    <tbody>

                        {attendance.map((record) => (
                            <tr key={record.id}>

                                <td>{record.attendeeName}</td>

                                <td>{record.attendeeEmail}</td>

                                <td>{record.ticketCode}</td>

                                <td>{record.checkInTime}</td>

                                <td>{record.status}</td>

                            </tr>
                        ))}

                    </tbody>

                </table>
            )}

        </div>
    );
}

export default Attendance;