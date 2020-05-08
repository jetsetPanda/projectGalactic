import React from 'react';
import { NavLink } from 'react-router-dom';

import AuthContext from '../../context/AuthContext';

import './MainNavbar.css';

const MainNavbar = () => (
	<AuthContext.Consumer>
		{context => {
			return (
				<header className="main-nav">
					<div className="main-nav-logo">
						<h1 style={{color: "white"}}>GalacticJourneys</h1>
					</div>
					<nav className="main-nav-items">
						<ul>
							{!context.token && (
								<li>
									<NavLink to="/auth">Login</NavLink>
								</li>
							)}
								<li>
									<NavLink to="/events">Events</NavLink>
								</li>
							{context.token && (
								<React.Fragment>
									<li>
										<NavLink to="/bookings">My Bookings</NavLink>
									</li>
									<li>
										<button className='logout' onClick={context.logout}>
											Logout
										</button>
									</li>
								</React.Fragment>

							)}

						</ul>
					</nav>
				</header>
			);
		}}

	</AuthContext.Consumer>
);

export default MainNavbar;