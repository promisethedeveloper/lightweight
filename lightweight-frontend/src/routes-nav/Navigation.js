import React, { useContext } from "react";
import { Link, NavLink } from "react-router-dom";
import UserContext from "../auth/UserContext";
import Container from "react-bootstrap/Container";
import Navbar from "react-bootstrap/Navbar";
import "./Navigation.css";

/** Navigation bar for the site. Shows up on every page
 *
 * When User is logged in, show links to the main areas of the site.
 * When User is not logged in, show links to Login and Signup forms.
 *
 */

const Navigation = ({ logout }) => {
	const { currentUser } = useContext(UserContext);

	const loggedInNav = () => {
		return (
			<ul className="navbar-nav ml-auto">
				<li className="nav-item mr-4">
					<NavLink className="nav-link" to="/workouts">
						Workouts
					</NavLink>
				</li>
				<li className="nav-item mr-4">
					<NavLink className="nav-link" to="/profile">
						Profile
					</NavLink>
				</li>
				<li className="nav-item">
					<Link className="nav-link" to="/" onClick={logout}>
						Log Out {currentUser.first_name || currentUser.username}
					</Link>
				</li>
			</ul>
		);
	};

	const loggedOutNav = () => {
		return (
			<ul className="navbar-nav ml-auto Navigation-logout">
				<li className="nav-item mr-4">
					<NavLink className="nav-link" to="/login">
						Login
					</NavLink>
				</li>
				<li className="nav-item mr-4">
					<NavLink className="nav-link" to="/signup">
						Sign Up
					</NavLink>
				</li>
			</ul>
		);
	};

	return (
		<Navbar collapseOnSelect expand="lg">
			<Container>
				<div className="container-fluid">
					<Navbar.Brand>
						<Link className="navbar-brand" to="/">
							<h4 className="Navigation-brand">LIGHT WEIGHT</h4>
						</Link>
					</Navbar.Brand>
					<Navbar.Toggle aria-controls="responsive-navbar-nav" />
					<Navbar.Collapse id="responsive-navbar-nav">
						{currentUser ? loggedInNav() : loggedOutNav()}
					</Navbar.Collapse>
				</div>
			</Container>
		</Navbar>
	);
};

export default Navigation;
