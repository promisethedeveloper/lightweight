import React from "react";
import { render } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import ExerciseList from "./ExerciseList";

/** Smoke test */
it("renders without crashing", () => {
	render(
		<MemoryRouter>
			<ExerciseList />
		</MemoryRouter>
	);
});

/** Snapshot test */
it("Should match snapshots", () => {
	const { asFragment } = render(
		<MemoryRouter>
			<ExerciseList />
		</MemoryRouter>
	);
	expect(asFragment()).toMatchSnapshot();
});
