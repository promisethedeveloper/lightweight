import React from "react";
import { render } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import LogExerciseForm from "./LogExerciseForm";

/** Smoke test */
it("renders without crashing", () => {
	render(
		<MemoryRouter>
			<LogExerciseForm />
		</MemoryRouter>
	);
});

/** Snapshot test */
it("Should match snapshots", () => {
	const { asFragment } = render(
		<MemoryRouter>
			<LogExerciseForm />
		</MemoryRouter>
	);
	expect(asFragment()).toMatchSnapshot();
});

it("renders a 'Loading...' text", () => {
	const { getByText } = render(
		<MemoryRouter>
			<LogExerciseForm />
		</MemoryRouter>
	);
	expect(getByText("Loading...")).toBeInTheDocument();
});
