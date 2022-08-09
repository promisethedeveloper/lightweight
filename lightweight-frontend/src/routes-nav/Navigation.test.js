import React from "react";
import { render } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import UserContext from "../auth/UserContext";
import Navigation from "./Navigation";

/** Smoke test */
it("renders without crashing", () => {
	const currentUser = { username: "John" };
	render(
		<MemoryRouter>
			<UserContext.Provider value={{ currentUser }}>
				<Navigation />
			</UserContext.Provider>
		</MemoryRouter>
	);
});

/** Snapshot test */
it("Should match snapshots", () => {
	const currentUser = { username: "John" };
	const { asFragment } = render(
		<MemoryRouter>
			<UserContext.Provider value={{ currentUser }}>
				<Navigation />
			</UserContext.Provider>
		</MemoryRouter>
	);
	expect(asFragment()).toMatchSnapshot();
});

it("renders a Workout, Profile, and Log Out naviagtion bar if there is a current user", () => {
	const currentUser = { username: "John" };
	const { getByText } = render(
		<MemoryRouter>
			<UserContext.Provider value={{ currentUser }}>
				<Navigation />
			</UserContext.Provider>
		</MemoryRouter>
	);
	expect(getByText("Workouts")).toBeInTheDocument();
	expect(getByText("Profile")).toBeInTheDocument();
	expect(getByText("Log Out John")).toBeInTheDocument();
});

it("renders Login and Sign Up buttons if there is no current user", () => {
	const { getByText } = render(
		<MemoryRouter>
			<UserContext.Provider value={{}}>
				<Navigation />
			</UserContext.Provider>
		</MemoryRouter>
	);
	expect(getByText("Login")).toBeInTheDocument();
	expect(getByText("Sign Up")).toBeInTheDocument();
});
