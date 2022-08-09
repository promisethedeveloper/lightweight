import React from "react";
import { render } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import ExerciseCard from "./ExerciseCard";

/** Smoke test */
it("Should render without crashing", () => {
	render(
		<MemoryRouter>
			<ExerciseCard />
		</MemoryRouter>
	);
});

/** Snapshot test */
it("Should match snapshots", () => {
	const { asFragment } = render(
		<MemoryRouter>
			<ExerciseCard />
		</MemoryRouter>
	);
	expect(asFragment()).toMatchSnapshot();
});

it("should load an exercise card", () => {
	const { getByText } = render(
		<MemoryRouter>
			<ExerciseCard
				name={"Bench press"}
				bodyPart={"Chest"}
				equipment={"Barbell"}
				target={"Pectoral"}
			/>
		</MemoryRouter>
	);
	expect(getByText("Name: Bench press")).toBeInTheDocument();
	expect(getByText("Body part: Chest")).toBeInTheDocument();
	expect(getByText("Equipment: Barbell")).toBeInTheDocument();
	expect(getByText("Target muscle: Pectoral")).toBeInTheDocument();
});
