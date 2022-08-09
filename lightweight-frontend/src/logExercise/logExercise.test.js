import React from "react";
import { render } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import LogExercise from "./LogExercise";

/** Smoke test */
it("Should render without crashing", () => {
	render(
		<MemoryRouter>
			<LogExercise />
		</MemoryRouter>
	);
});

/** Snapshot test */
it("Should match snapshots", () => {
	const { asFragment } = render(
		<MemoryRouter>
			<LogExercise />
		</MemoryRouter>
	);
	expect(asFragment()).toMatchSnapshot();
});

it("renders logExercise page with 'View' button", () => {
	const { getByText } = render(
		<MemoryRouter>
			<LogExercise />
		</MemoryRouter>
	);
	expect(getByText("View")).toBeInTheDocument();
});
