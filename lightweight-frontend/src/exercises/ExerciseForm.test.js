import React from "react";
import { render } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import ExerciseForm from "./ExerciseForm";

/** Smoke test */
it("renders without crashing", () => {
	render(
		<MemoryRouter>
			<ExerciseForm />
		</MemoryRouter>
	);
});

it("should render the SEARCH button on the form", () => {
	const { queryByText } = render(<ExerciseForm />);
	expect(queryByText("SEARCH")).toBeInTheDocument();
});
