
import React from "react";

import {
  BrowserRouter,
  Routes,
  Route,
  Link,
  useNavigate
} from "react-router-dom";

import Login from "./login";
import Register from "./register";
import Events from "./Events";
import CreateEvent from "./CreateEvent";
import MyTickets from "./MyTickets";
import ScanTicket from "./ScanTicket";
import OrganizerDashboard from "./OrganizerDashboard";
import Attendance from "./Attendance";
import AdminDashboard from "./AdminDashboard";

import "./App.css";


/* =========================================
   NAVIGATION
========================================= */

function Navigation() {
  const navigate = useNavigate();

  const storedUser = localStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;

  const logout = () => {
    localStorage.removeItem("user");
    navigate("/");
    window.location.reload();
  };

  return (
    <nav className="navbar">

      <Link to="/" className="brand-link">
        <span className="brand-icon">E</span>
        <span>EventPass</span>
      </Link>

      <div className="nav-links">

        <Link to="/">Home</Link>

        <Link to="/events">Events</Link>

        {user && user.role === "ATTENDEE" && (
          <Link to="/my-tickets">
            My Tickets
          </Link>
        )}

        {user && user.role === "ORGANIZER" && (
          <Link to="/organizer-dashboard">
            Organizer Dashboard
          </Link>
        )}

        {user && user.role === "ADMIN" && (
          <Link to="/admin-dashboard">
            Admin Dashboard
          </Link>
        )}

        {user &&
          (user.role === "ORGANIZER" ||
            user.role === "ADMIN") && (
            <Link to="/scan-ticket">
              Scan Ticket
            </Link>
          )}

        {!user && (
          <>
            <Link to="/login">Login</Link>

            <Link
              to="/register"
              className="nav-register"
            >
              Sign up
            </Link>
          </>
        )}

        {user && (
          <button
            type="button"
            className="nav-logout"
            onClick={logout}
          >
            Logout
          </button>
        )}

      </div>
    </nav>
  );
}


/* =========================================
   HOMEPAGE
========================================= */

function Home() {
  const storedUser = localStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;

  return (
    <div className="landing-page">

      {/* Main Hero Section */}

      <section className="landing-hero">

        <div className="hero-copy">

          <div className="hero-eyebrow">
            <span className="eyebrow-dot"></span>
            YOUR EVENTS, ALL IN ONE PLACE
          </div>

          <h1>
            Every event.
            <br />
            One <span>digital pass.</span>
          </h1>

          <p className="hero-description">
            Discover exciting campus events, reserve
            your place, and carry your ticket wherever
            you go. Simple booking, easy access, no
            paper tickets.
          </p>

          {/* Logged-in User */}

          {user && (
            <div className="hero-welcome">

              <div className="welcome-avatar">
                {user.name
                  ? user.name.charAt(0).toUpperCase()
                  : "E"}
              </div>

              <div>
                <p className="welcome-label">
                  Welcome back
                </p>

                <p className="welcome-name">
                  {user.name}
                </p>

                <p className="welcome-role">
                  {user.role}
                </p>
              </div>

            </div>
          )}

          {/* Get Started Button */}

          <div className="hero-actions">

            <button
              type="button"
              className="primary-action"
              onClick={() => {
                window.location.assign("/register");
              }}
            >
              Get Started
              <span>→</span>
            </button>

          </div>

        </div>


        {/* Decorative Event Ticket */}

        <div className="hero-art">

          <div className="art-orbit orbit-one"></div>

          <div className="art-orbit orbit-two"></div>

          <div className="hero-ticket">

            <div className="ticket-top">

              <div className="ticket-brand">

                <div className="ticket-brand-icon">
                  E
                </div>

                <div>
                  <strong>EventPass</strong>
                  <small>
                    DIGITAL ENTRY PASS
                  </small>
                </div>

              </div>

              <span className="ticket-status">
                YOUR PASS
              </span>

            </div>

            <div className="ticket-divider"></div>

            <div className="ticket-event">

              <span className="ticket-kicker">
                YOUR NEXT EXPERIENCE
              </span>

              <h2>Make it memorable.</h2>

              <p>
                Discover events. Save your spot.
                Enjoy the moment.
              </p>

            </div>

            <div className="ticket-divider"></div>

            <div className="ticket-bottom">

              <div className="ticket-code">

                <span className="ticket-code-label">
                  ENTRY TYPE
                </span>

                <strong>ADMIT ONE</strong>

                <small>
                  Your next experience awaits.
                </small>

              </div>

              <div className="ticket-art-stamp">
                ✦
              </div>

            </div>

            <div className="ticket-footer">
              <span>EVENTPASS</span>
              <span>MADE FOR YOUR MOMENTS</span>
            </div>

          </div>


          {/* Floating Labels */}

          <div className="floating-label floating-top">

            <span className="floating-icon">
              ✓
            </span>

            <span>
              <strong>
                You're on the list
              </strong>

              <small>
                Ready for your next event
              </small>
            </span>

          </div>

          <div className="floating-label floating-bottom">

            <div className="mini-calendar">
              ▦
            </div>

            <span>
              <strong>
                Your ticket, simplified
              </strong>

              <small>
                Everything in one place
              </small>
            </span>

          </div>

        </div>

      </section>


      {/* Explore Events Section */}

      <section className="home-explore">

        <div className="home-explore-copy">

          <span className="section-eyebrow">
            YOUR NEXT EXPERIENCE AWAITS
          </span>

          <h2>
            Something exciting is happening.
          </h2>

          <p>
            Discover campus events, find your people,
            and get your digital pass for the moments
            worth showing up for.
          </p>

        </div>

        <button
          type="button"
          className="primary-action home-explore-button"
          onClick={() => {
            window.location.assign("/events");
          }}
        >
          Explore Events
          <span>→</span>
        </button>

      </section>

    </div>
  );
}


/* =========================================
   APP ROUTES
========================================= */

function App() {
  return (
    <BrowserRouter>

      <Navigation />

      <Routes>

        <Route
          path="/"
          element={<Home />}
        />

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/register"
          element={<Register />}
        />

        <Route
          path="/events"
          element={<Events />}
        />

        <Route
          path="/create-event"
          element={<CreateEvent />}
        />

        <Route
          path="/my-tickets"
          element={<MyTickets />}
        />

        <Route
          path="/scan-ticket"
          element={<ScanTicket />}
        />

        <Route
          path="/organizer-dashboard"
          element={<OrganizerDashboard />}
        />

        <Route
          path="/attendance/:eventId"
          element={<Attendance />}
        />

        <Route
          path="/admin-dashboard"
          element={<AdminDashboard />}
        />

      </Routes>

    </BrowserRouter>
  );
}

export default App;
