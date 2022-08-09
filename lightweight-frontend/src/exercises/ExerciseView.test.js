import React from "react";
import { render } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import ExerciseView from "./ExerciseView";

/** Smoke test */
it("Should render without crashing", () => {
	render(
		<MemoryRouter>
			<ExerciseView />
		</MemoryRouter>
	);
});

/** Snapshot test */
it("Should match snapshots", () => {
	const { asFragment } = render(
		<MemoryRouter>
			<ExerciseView />
		</MemoryRouter>
	);
	expect(asFragment()).toMatchSnapshot();
});

it("renders the card image element", () => {
	const { container } = render(
		<MemoryRouter>
			<ExerciseView />
		</MemoryRouter>
	);
	const img = container.getElementsByClassName("card-img-top");
	expect(img).toBeTruthy();
});

it("renders the body of the card element", () => {
	const { container } = render(
		<MemoryRouter>
			<ExerciseView />
		</MemoryRouter>
	);
	const cardBody = container.getElementsByClassName("card-body border");
	expect(cardBody).toBeTruthy();
});
