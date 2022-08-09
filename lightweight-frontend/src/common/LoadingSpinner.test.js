import React from "react";
import { render } from "@testing-library/react";
import LoadingSpinner from "./LoadingSpinner";

/** Smoke test */
it("Should render without crashing", () => {
	render(<LoadingSpinner />);
});

/** Snapshot test */
it("should match snapshots", () => {
	const { asFragment } = render(<LoadingSpinner />);
	expect(asFragment()).toMatchSnapshot();
});

it("should show a 'Loading...' message", () => {
	const { queryByText } = render(<LoadingSpinner />);
	expect(queryByText("Loading...")).toBeInTheDocument();
});
