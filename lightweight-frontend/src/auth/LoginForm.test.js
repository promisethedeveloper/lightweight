import React from "react";
import { render } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import LoginForm from "./LoginForm";

/** Smoke test */
it("renders without crashing", () => {
	render(
		<MemoryRouter>
			<LoginForm />
		</MemoryRouter>
	);
});

/** Snapshot test */
it("Should match snapshots", () => {
	const { asFragment } = render(<LoginForm />);
	expect(asFragment()).toMatchSnapshot();
});

it("renders a 'Log In' text", () => {
	const { getByText } = render(<LoginForm />);
	expect(getByText("Log In")).toBeInTheDocument();
});

it("renders form's username and password label text", () => {
	const { getByLabelText } = render(<LoginForm />);
	expect(getByLabelText("Username")).toBeInTheDocument();
	expect(getByLabelText("Password")).toBeInTheDocument();
});
