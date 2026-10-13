import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import API_URL from "./api";

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.get(API_URL + "/users");
            const users = response.data;

            const user = users.find(
                (u) => u.email === email && u.password === password
            );

            if (user) {
                localStorage.setItem("user", JSON.stringify(user));

                alert("Login successful!");
                navigate("/events");
            } else {
                alert("Invalid email or password");
            }
        } catch (error) {
            console.error("Login error:", error);
            alert("Unable to connect to server");
        }
    };

    return (
        <div className="login-page">
            <div className="login-card">

                <h1>Welcome back!</h1>

                <p className="login-subtitle">
                    Sign in to discover events and access your digital tickets.
                </p>

                <form onSubmit={handleLogin}>

                    <div className="login-field">
                        <label htmlFor="login-email">Email address</label>
                        <input
                            id="login-email"
                            type="email"

                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div className="login-field">
                        <label htmlFor="login-password">Password</label>
                        <input
                            id="login-password"
                            type="password"

                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <button type="submit" className="login-submit">
                        Sign in <span>→</span>
                    </button>

                </form>

                <div className="login-register">
                    New to EventPass? <Link to="/register">Create an account</Link>
                </div>


            </div>
        </div>
    );
}

export default Login;