import React from "react";
import { render } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import UserContext from "../auth/UserContext";
import ProfileForm from "./ProfileForm";

/** Smoke test */
it("renders without crashing", () => {
	const currentUser = { username: "John" };
	render(
		<MemoryRouter>
			<UserContext.Provider value={{ currentUser }}>
				<ProfileForm />
			</UserContext.Provider>
		</MemoryRouter>
	);
});

/** Snapshot test */
it("Should match snapshots", () => {
	const currentUser = { username: "John" };
	const { asFragment } = render(
		<MemoryRouter>
			<UserContext.Provider value={{ currentUser }}>
				<ProfileForm />
			</UserContext.Provider>
		</MemoryRouter>
	);
	expect(asFragment()).toMatchSnapshot();
});

it("renders a 'Save Changes' text", () => {
	const currentUser = { username: "John" };
	const { getByText } = render(
		<MemoryRouter>
			<UserContext.Provider value={{ currentUser }}>
				<ProfileForm />
			</UserContext.Provider>
		</MemoryRouter>
	);
	expect(getByText("Save Changes")).toBeInTheDocument();
});

it("renders form's First name label text", () => {
	const currentUser = { username: "John" };
	const { getByLabelText } = render(
		<MemoryRouter>
			<UserContext.Provider value={{ currentUser }}>
				<ProfileForm />
			</UserContext.Provider>
		</MemoryRouter>
	);
	expect(getByLabelText("First Name")).toBeInTheDocument();
});

it("renders form's Last name label text", () => {
	const currentUser = { username: "John" };
	const { getByLabelText } = render(
		<MemoryRouter>
			<UserContext.Provider value={{ currentUser }}>
				<ProfileForm />
			</UserContext.Provider>
		</MemoryRouter>
	);
	expect(getByLabelText("Last Name")).toBeInTheDocument();
});

it("renders form's email label text", () => {
	const currentUser = { username: "John" };
	const { getByLabelText } = render(
		<MemoryRouter>
			<UserContext.Provider value={{ currentUser }}>
				<ProfileForm />
			</UserContext.Provider>
		</MemoryRouter>
	);
	expect(getByLabelText("Email")).toBeInTheDocument();
});

it("renders form's password label text", () => {
	const currentUser = { username: "John" };
	const { getByLabelText } = render(
		<MemoryRouter>
			<UserContext.Provider value={{ currentUser }}>
				<ProfileForm />
			</UserContext.Provider>
		</MemoryRouter>
	);
	expect(
		getByLabelText("Confirm password to make changes:")
	).toBeInTheDocument();
});
