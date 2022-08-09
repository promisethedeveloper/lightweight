import React from "react";
import { render } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import LoggedExerciseEditForm from "./LoggedExerciseEditForm";

/** Smoke test */
it("renders without crashing", () => {
	render(
		<MemoryRouter>
			<LoggedExerciseEditForm />
		</MemoryRouter>
	);
});

/** Snapshot test */
it("Should match snapshots", () => {
	const { asFragment } = render(
		<MemoryRouter>
			<LoggedExerciseEditForm />
		</MemoryRouter>
	);
	expect(asFragment()).toMatchSnapshot();
});

it("renders a 'Loading...' text", () => {
	const { getByText } = render(
		<MemoryRouter>
			<LoggedExerciseEditForm />
		</MemoryRouter>
	);
	expect(getByText("Edit exercise")).toBeInTheDocument();
});

it("renders form's weight label text", () => {
	const { getByLabelText } = render(
		<MemoryRouter>
			<LoggedExerciseEditForm />
		</MemoryRouter>
	);
	expect(getByLabelText("Weight")).toBeInTheDocument();
});

it("renders form's unit label text", () => {
	const { getByLabelText } = render(
		<MemoryRouter>
			<LoggedExerciseEditForm />
		</MemoryRouter>
	);
	expect(getByLabelText("Unit")).toBeInTheDocument();
});

it("renders form's no. of sets label text", () => {
	const { getByLabelText } = render(
		<MemoryRouter>
			<LoggedExerciseEditForm />
		</MemoryRouter>
	);
	expect(getByLabelText("No. of sets")).toBeInTheDocument();
});

it("renders form's no. of reps label text", () => {
	const { getByLabelText } = render(
		<MemoryRouter>
			<LoggedExerciseEditForm />
		</MemoryRouter>
	);
	expect(getByLabelText("No. of Reps.")).toBeInTheDocument();
});

it("renders form's no. of reps label text", () => {
	const { getByText } = render(
		<MemoryRouter>
			<LoggedExerciseEditForm />
		</MemoryRouter>
	);
	expect(getByText("Save")).toBeInTheDocument();
});
