import React from "react";
import { render } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import WorkoutDay from "./WorkoutDay";

/** Smoke test */
it("renders without crashing", () => {
	render(
		<MemoryRouter>
			<WorkoutDay />
		</MemoryRouter>
	);
});

/** Snapshot test */
it("Should match snapshots", () => {
	const { asFragment } = render(
		<MemoryRouter>
			<WorkoutDay />
		</MemoryRouter>
	);
	expect(asFragment()).toMatchSnapshot();
});

it("renders a 'Add exercises to this workout day' text", async () => {
	const { getByText } = render(
		<MemoryRouter>
			<WorkoutDay />
		</MemoryRouter>
	);
	expect(getByText("Add exercises to this workout day")).toBeInTheDocument();
});
