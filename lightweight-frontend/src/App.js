import React, { useState, useEffect } from "react";
import { BrowserRouter } from "react-router-dom";
import useLocalStorage from "./hooks/useLocalStorage";
import LightWeightAPI from "./api/api";
import UserContext from "./auth/UserContext";
import jwt from "jsonwebtoken";
import LoadingSpinner from "./common/LoadingSpinner";
import Navigation from "./routes-nav/Navigation";
import Routes from "./routes-nav/Routes.js";
import "./App.css";

export const TOKEN_STORAGE_ID = "lightweight-token";

function App() {
	const [infoLoaded, setInfoLoaded] = useState(false);
	const [currentUser, setCurrentUser] = useState(null);
	const [token, setToken] = useLocalStorage(TOKEN_STORAGE_ID);

	useEffect(
		function loadUserInfo() {
			async function getCurrentUser() {
				if (token) {
					try {
						let { username } = jwt.decode(token);
						// put the token on the Api class so it can use it to call the API.
						LightWeightAPI.token = token;
						let currentUser = await LightWeightAPI.getCurrentUser(username);
						setCurrentUser(currentUser);
					} catch (error) {
						setCurrentUser(null);
					}
				}
				setInfoLoaded(true);
			}

			// set infoLoaded to false while async getCurrentUser runs; once the
			// data is fetched (or even if an error happens!), this will be set back
			// to false to control the spinner.
			setInfoLoaded(false);
			getCurrentUser();
		},
		[token]
	);

	function logout() {
		setCurrentUser(null);
		setToken(null);
	}

	async function signup(signupData) {
		try {
			let token = await LightWeightAPI.signup(signupData);
			setToken(token);
			return { success: true };
		} catch (errors) {
			return { success: false, errors };
		}
	}

	async function login(loginData) {
		try {
			let token = await LightWeightAPI.login(loginData);
			setToken(token);
			return { success: true };
		} catch (errors) {
			console.error("login failed", errors);
			return { success: false, errors };
		}
	}

	if (!infoLoaded) {
		return <LoadingSpinner />;
	}

	return (
		<BrowserRouter>
			<UserContext.Provider value={{ currentUser, setCurrentUser }}>
				<div className="container">
					<Navigation logout={logout} />
					<Routes login={login} signup={signup} />
				</div>
			</UserContext.Provider>
		</BrowserRouter>
	);
}

export default App;
