import React from "react";
import { render } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import SignupForm from "./SignupForm";

/** Smoke test */
it("renders without crashing", () => {
	render(
		<MemoryRouter>
			<SignupForm />
		</MemoryRouter>
	);
});

/** Snapshot test */
it("Should match snapshots", () => {
	const { asFragment } = render(<SignupForm />);
	expect(asFragment()).toMatchSnapshot();
});

it("renders a 'Sign Up' text", () => {
	const { getByText } = render(<SignupForm />);
	expect(getByText("Sign Up")).toBeInTheDocument();
});

it("renders form's label texts", () => {
	const { getByLabelText } = render(<SignupForm />);
	expect(getByLabelText("Username")).toBeInTheDocument();
	expect(getByLabelText("Password")).toBeInTheDocument();
	expect(getByLabelText("First name")).toBeInTheDocument();
	expect(getByLabelText("Last name")).toBeInTheDocument();
	expect(getByLabelText("Email")).toBeInTheDocument();
	expect(getByLabelText("Password")).toBeInTheDocument();
});
