import React from "react";
import { render } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import WorkoutForm from "./WorkoutForm";
import UserContext from "../auth/UserContext";

/** Smoke test */
it("should render without crashing", () => {
	const currentUser = { username: "John" };
	render(
		<MemoryRouter>
			<UserContext.Provider value={{ currentUser }}>
				<WorkoutForm />
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
				<WorkoutForm />
			</UserContext.Provider>
		</MemoryRouter>
	);
	expect(asFragment()).toMatchSnapshot();
});

it("should render form label text", () => {
	let currentUser = { username: "Promise" };
	const { getByLabelText } = render(
		<MemoryRouter>
			<UserContext.Provider value={{ currentUser }}>
				<WorkoutForm />
			</UserContext.Provider>
		</MemoryRouter>
	);
	expect(getByLabelText("Day of week")).toBeInTheDocument();
	expect(getByLabelText("Description")).toBeInTheDocument();
});

it("should render Save and Cancel buttons", () => {
	let currentUser = { username: "Promise" };
	const { getByText } = render(
		<MemoryRouter>
			<UserContext.Provider value={{ currentUser }}>
				<WorkoutForm />
			</UserContext.Provider>
		</MemoryRouter>
	);
	expect(getByText("Save")).toBeInTheDocument();
	expect(getByText("Cancel")).toBeInTheDocument();
});
