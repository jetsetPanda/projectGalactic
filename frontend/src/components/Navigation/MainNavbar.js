import React from 'react';
import { NavLink } from 'react-router-dom';

import AuthContext from '../../context/auth-context';

import './MainNavbar.css';

const MainNavbar = props => (
	<AuthContext.Consumer>
		{(context) => {
			return (
				<header className="main-nav">
					<div className="main-nav-logo">
						<h1 style={{color: "white"}}>GalacticJourneys</h1>
					</div>
					<nav className="main-nav-items">
						<ul>
							{context.token && (
								<li>
									<NavLink to="/auth">Login</NavLink>
								</li>
							)}
								<li>
									<NavLink to="/events">Events List</NavLink>
								</li>
							{context.token && (
								<li>
									<NavLink to="/bookings">Join an Event</NavLink>
								</li>
							)}

						</ul>
					</nav>
				</header>
			)
		}}

	</AuthContext.Consumer>
);

export default MainNavbar;