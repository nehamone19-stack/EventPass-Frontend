import React, { useEffect, useState } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import API_URL from "./api";

function ScanTicket() {
    const [result, setResult] = useState("");
    const [message, setMessage] = useState("");

    const navigate = useNavigate();

    useEffect(() => {
        const storedUser = localStorage.getItem("user");

        if (!storedUser) {
            alert("Please login first!");
            navigate("/login");
            return;
        }

        const user = JSON.parse(storedUser);

        if (user.role !== "ORGANIZER") {
            alert("Only organizers can scan tickets!");
            navigate("/events");
        }
    }, [navigate]);

    const startScanner = () => {
        setResult("");
        setMessage("");

        const scanner = new Html5QrcodeScanner(
            "qr-reader",
            {
                fps: 10,
                qrbox: {
                    width: 250,
                    height: 250
                }
            },
            false
        );

        scanner.render(
            async (decodedText) => {
                setResult(decodedText);

                try {
                    const response = await axios.post(
                        API_URL + "/attendance/verify",
                        {
                            ticketCode: decodedText
                        }
                    );

                    setMessage(response.data);

                    scanner.clear();

                } catch (error) {
                    console.error(error);

                    if (error.response) {
                        setMessage(error.response.data);
                    } else {
                        setMessage("Verification failed");
                    }

                    scanner.clear();
                }
            },
            (errorMessage) => {
                console.log(errorMessage);
            }
        );
    };

    return (
        <div className="scanner-container">

            <h1>Scan Ticket</h1>

            <p>
                Scan the attendee's EventPass QR code
            </p>

            <button onClick={startScanner}>
                Start Scanner
            </button>

            <div id="qr-reader"></div>

            {result && (
                <div className="scan-result">
                    <h3>Scanned Ticket</h3>
                    <p>{result}</p>
                </div>
            )}

            {message && (
                <div className="verification-message">
                    <h2>{message}</h2>
                </div>
            )}

        </div>
    );
}

export default ScanTicket;