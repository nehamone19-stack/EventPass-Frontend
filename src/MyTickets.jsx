import React, { useEffect, useState } from "react";
import axios from "axios";
import { QRCodeCanvas } from "qrcode.react";
import { useNavigate } from "react-router-dom";
import API_URL from "./api";

function MyTickets() {
    const [tickets, setTickets] = useState([]);
    const navigate = useNavigate();

    const getTickets = async () => {
        const storedUser = localStorage.getItem("user");

        if (!storedUser) {
            alert("Please login first!");
            navigate("/login");
            return;
        }

        const user = JSON.parse(storedUser);

        try {
            const response = await axios.get(
                API_URL + "/tickets/attendee/" + user.email
            );

            setTickets(response.data);

        } catch (error) {
            console.error("Ticket error:", error);
            alert("Unable to load tickets");
        }
    };

    useEffect(() => {
        const storedUser = localStorage.getItem("user");

        if (!storedUser) {
            alert("Please login first!");
            navigate("/login");
            return;
        }

        const user = JSON.parse(storedUser);

        if (user.role !== "ATTENDEE") {
            alert("Only attendees can view tickets!");
            navigate("/events");
            return;
        }

        getTickets();
    }, [navigate]);

    return (
        <div className="tickets-container">

            <h1>My Tickets</h1>

            {tickets.length === 0 ? (
                <p>No tickets available.</p>
            ) : (
                tickets.map((ticket) => (

                    <div className="ticket-card" key={ticket.id}>

                        <h2>{ticket.eventName}</h2>

                        <p>
                            <strong>Ticket Code:</strong>{" "}
                            {ticket.ticketCode}
                        </p>

                        <p>
                            <strong>Name:</strong>{" "}
                            {ticket.attendeeName}
                        </p>

                        <p>
                            <strong>Email:</strong>{" "}
                            {ticket.attendeeEmail}
                        </p>

                        <p>
                            <strong>Status:</strong>{" "}
                            {ticket.status}
                        </p>

                        <div className="qr-container">

                            <QRCodeCanvas
                                value={ticket.ticketCode}
                                size={200}
                            />

                        </div>

                    </div>

                ))
            )}

        </div>
    );
}

export default MyTickets;