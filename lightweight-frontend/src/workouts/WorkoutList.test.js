import React from "react";
import { render } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import WorkoutList from "./WorkoutList";
import UserContext from "../auth/UserContext";

/** Smoke test */
it("should render without crashing", () => {
	const currentUser = { username: "John" };
	render(
		<MemoryRouter>
			<UserContext.Provider value={{ currentUser }}>
				<WorkoutList />
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
				<WorkoutList />
			</UserContext.Provider>
		</MemoryRouter>
	);
	expect(asFragment()).toMatchSnapshot();
});

it("should render form label text", () => {
	let currentUser = { username: "Promise" };
	const { getByText } = render(
		<MemoryRouter>
			<UserContext.Provider value={{ currentUser }}>
				<WorkoutList />
			</UserContext.Provider>
		</MemoryRouter>
	);
	expect(getByText("WORKOUTS")).toBeInTheDocument();
	expect(getByText("Add workout day")).toBeInTheDocument();
});
