import React, { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import API_URL from "./api";

function Register() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState("ATTENDEE");

    const handleRegister = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post(API_URL + "/users", {
                name: name,
                email: email,
                password: password,
                role: role
            });

            alert("Registration successful!");

            console.log(response.data);

            setName("");
            setEmail("");
            setPassword("");
            setRole("ATTENDEE");
        } catch (error) {
            console.error("Registration error:", error);
            alert("Registration failed!");
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-card">
                <div className="auth-heading">



                    <h1>Create your account</h1>

                    <p>
                        Discover campus events and keep every ticket
                        in one convenient place.
                    </p>
                </div>

                <form className="auth-form" onSubmit={handleRegister}>
                    <div className="auth-field">
                        <label htmlFor="register-name">Full name</label>
                        <input
                            id="register-name"
                            type="text"

                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </div>

                    <div className="auth-field">
                        <label htmlFor="register-email">Email address</label>
                        <input
                            id="register-email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div className="auth-field">
                        <label htmlFor="register-password">Password</label>
                        <input
                            id="register-password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <div className="auth-field">
                        <label htmlFor="register-role">Account type</label>
                        <select
                            id="register-role"
                            value={role}
                            onChange={(e) => setRole(e.target.value)}
                        >
                            <option value="ATTENDEE">Attendee</option>
                            <option value="ORGANIZER">Organizer</option>
                        </select>
                    </div>

                    <button className="auth-submit" type="submit">
                        Create account <span>→</span>
                    </button>
                </form>

                <div className="auth-switch">
                    Already have an account?{" "}
                    <Link to="/login">Sign in</Link>
                </div>

            </div>
        </div>
    );
}

export default Register;