import React, { useContext } from "react";
import { Link } from "react-router-dom";
import "./Homepage.css";
import UserContext from "../auth/UserContext";
import "bootstrap/dist/css/bootstrap.min.css";

/** Homepage of site.
 *
 * Shows welcome message or login/signup buttons.
 *
 * Routed at /
 *
 * Routes -> Homepage
 */

const Homepage = () => {
	const { currentUser } = useContext(UserContext);

	return (
		<div className="Homepage">
			<div className="container text-center">
				<h1 className="mb-4 font-weight-bold">
					<span className="homepage-heading">LIGHT WEIGHT</span>
				</h1>
				<p className="lead">Sore today, stronger tomorrow.</p>
				{currentUser ? (
					<h5>Welcome, {currentUser.username}!</h5>
				) : (
					<p>
						<Link
							className="btn font-weight-bold mr-3"
							to="/login"
							style={{ backgroundColor: "#B3541E", color: "white" }}
						>
							LOG IN
						</Link>
						<Link
							className="btn font-weight-bold"
							to="/signup"
							style={{ backgroundColor: "#B3541E", color: "white" }}
						>
							SIGN UP
						</Link>
					</p>
				)}
			</div>
		</div>
	);
};

export default Homepage;
