import React from "react";
import { render } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import WorkoutEditForm from "./WorkoutEditForm";

/** Smoke test */
it("renders without crashing", () => {
	render(
		<MemoryRouter>
			<WorkoutEditForm />
		</MemoryRouter>
	);
});

/** Snapshot test */
it("Should match snapshots", () => {
	const { asFragment } = render(
		<MemoryRouter>
			<WorkoutEditForm />
		</MemoryRouter>
	);
	expect(asFragment()).toMatchSnapshot();
});

it("renders a 'Edit workout day text", () => {
	const { getByText } = render(
		<MemoryRouter>
			<WorkoutEditForm />
		</MemoryRouter>
	);
	expect(getByText("Edit workout day")).toBeInTheDocument();
});

it("renders form's label text", () => {
	const { getByLabelText } = render(
		<MemoryRouter>
			<WorkoutEditForm />
		</MemoryRouter>
	);
	expect(getByLabelText("Day of week")).toBeInTheDocument();
	expect(getByLabelText("Description")).toBeInTheDocument();
});

it("renders form's Update text", () => {
	const { getByText } = render(
		<MemoryRouter>
			<WorkoutEditForm />
		</MemoryRouter>
	);
	expect(getByText("Update")).toBeInTheDocument();
});
