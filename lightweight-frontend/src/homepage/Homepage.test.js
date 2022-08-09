import React from "react";
import { render } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Homepage from "./Homepage";
import UserContext from "../auth/UserContext";

/** Smoke test */
it("should render without crashing", () => {
	const currentUser = { username: "John" };
	render(
		<MemoryRouter>
			<UserContext.Provider value={{ currentUser }}>
				<Homepage />
			</UserContext.Provider>
		</MemoryRouter>
	);
});

/** Snapshot test */
it("should match snapshots", () => {
	const currentUser = { username: "John" };

	const { asFragment } = render(
		<MemoryRouter>
			<UserContext.Provider value={{ currentUser }}>
				<Homepage />
			</UserContext.Provider>
		</MemoryRouter>
	);
	expect(asFragment()).toMatchSnapshot();
});

it("should render welcome message if there is a current user", () => {
	let currentUser = { username: "Promise" };
	const { getByText } = render(
		<MemoryRouter>
			<UserContext.Provider value={{ currentUser }}>
				<Homepage />
			</UserContext.Provider>
		</MemoryRouter>
	);
	expect(getByText("Welcome, Promise!")).toBeInTheDocument();
});

it("should render LOG IN and SIGN UP buttons if there is no current user", () => {
	const { getByText } = render(
		<MemoryRouter>
			<UserContext.Provider value={{}}>
				<Homepage />
			</UserContext.Provider>
		</MemoryRouter>
	);
	expect(getByText("LOG IN")).toBeInTheDocument();
	expect(getByText("SIGN UP")).toBeInTheDocument();
});
