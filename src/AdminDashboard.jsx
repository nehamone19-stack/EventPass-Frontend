import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import API_URL from "./api";

function AdminDashboard() {
    const navigate = useNavigate();

    const [users, setUsers] = useState([]);
    const [events, setEvents] = useState([]);
    const [tickets, setTickets] = useState([]);
    const [attendance, setAttendance] = useState([]);

    useEffect(() => {
        checkAdmin();
    }, []);

    const checkAdmin = () => {
        const storedUser = localStorage.getItem("user");

        if (!storedUser) {
            alert("Please login first!");
            navigate("/login");
            return;
        }

        const user = JSON.parse(storedUser);

        if (user.role !== "ADMIN") {
            alert("Only admins can access this page!");
            navigate("/events");
            return;
        }

        loadData();
    };

    const loadData = async () => {
        try {
            const usersResponse = await axios.get(
                API_URL + "/users"
            );

            const eventsResponse = await axios.get(
                API_URL + "/events"
            );

            const ticketsResponse = await axios.get(
                API_URL + "/tickets"
            );

            const attendanceResponse = await axios.get(
                API_URL + "/attendance"
            );

            setUsers(usersResponse.data);
            setEvents(eventsResponse.data);
            setTickets(ticketsResponse.data);
            setAttendance(attendanceResponse.data);

        } catch (error) {
            console.error(error);
            alert("Unable to load admin data");
        }
    };

    const deleteEvent = async (event) => {
        const storedUser = localStorage.getItem("user");

        if (!storedUser) {
            alert("Please login first!");
            navigate("/login");
            return;
        }

        const user = JSON.parse(storedUser);

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

            loadData();

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

            <h1>Admin Dashboard</h1>

            <p>
                Welcome, EventPass Admin!
            </p>

            {/* Statistics */}

            <div className="admin-stats">

                <div className="stat-card">
                    <h2>{users.length}</h2>
                    <p>Total Users</p>
                </div>

                <div className="stat-card">
                    <h2>{events.length}</h2>
                    <p>Total Events</p>
                </div>

                <div className="stat-card">
                    <h2>{tickets.length}</h2>
                    <p>Total Tickets</p>
                </div>

                <div className="stat-card">
                    <h2>{attendance.length}</h2>
                    <p>Total Check-ins</p>
                </div>

            </div>

            {/* All Events */}

            <h2>All Events</h2>

            {events.length === 0 ? (
                <p>No events available.</p>
            ) : (
                events.map((event) => (

                    <div
                        className="event-card"
                        key={event.id}
                    >

                        <h3>{event.name}</h3>

                        <p>
                            <strong>Organizer:</strong>{" "}
                            {event.organizer}
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

                    </div>

                ))
            )}

            {/* All Users */}

            <h2>All Users</h2>

            {users.length === 0 ? (
                <p>No users available.</p>
            ) : (
                <table>

                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Role</th>
                        </tr>
                    </thead>

                    <tbody>

                        {users.map((user) => (

                            <tr key={user.id}>

                                <td>{user.name}</td>

                                <td>{user.email}</td>

                                <td>{user.role}</td>

                            </tr>

                        ))}

                    </tbody>

                </table>
            )}

            {/* All Tickets */}

            <h2>All Tickets</h2>

            {tickets.length === 0 ? (
                <p>No tickets available.</p>
            ) : (
                <table>

                    <thead>
                        <tr>
                            <th>Ticket Code</th>
                            <th>Event</th>
                            <th>Attendee Name</th>
                            <th>Attendee Email</th>
                            <th>Status</th>
                        </tr>
                    </thead>

                    <tbody>

                        {tickets.map((ticket) => (

                            <tr key={ticket.id}>

                                <td>{ticket.ticketCode}</td>

                                <td>{ticket.eventName}</td>

                                <td>{ticket.attendeeName}</td>

                                <td>{ticket.attendeeEmail}</td>

                                <td>{ticket.status}</td>

                            </tr>

                        ))}

                    </tbody>

                </table>
            )}

            {/* All Attendance */}

            <h2>All Attendance</h2>

            {attendance.length === 0 ? (
                <p>No attendance records available.</p>
            ) : (
                <table>

                    <thead>
                        <tr>
                            <th>Event</th>
                            <th>Attendee Name</th>
                            <th>Email</th>
                            <th>Ticket Code</th>
                            <th>Check-in Time</th>
                            <th>Status</th>
                        </tr>
                    </thead>

                    <tbody>

                        {attendance.map((record) => (

                            <tr key={record.id}>

                                <td>{record.eventName}</td>

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

export default AdminDashboard;