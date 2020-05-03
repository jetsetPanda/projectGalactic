import React from 'react';
import { NavLink } from 'react-router-dom';

import './MainNavbar.css';

const MainNavbar = (props) => (
    <header className="main-nav">
        <div className="main-nav-logo">
            <h1 style={{color: "white"}}>GalacticJourneys</h1>
        </div>
        <nav className="main-nav-items">
            <ul>
                <li>
                    <NavLink to="/auth">Login</NavLink>
                </li>
                <li>
                    <NavLink to="/events">Events List</NavLink>
                </li>
                <li>
                    <NavLink to="/bookings">Join an Event</NavLink>
                </li>
            </ul>
        </nav>
    </header>
);

export default MainNavbar;