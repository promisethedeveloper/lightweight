import React from "react";
import { render } from "@testing-library/react";
import Alert from "./Alert";

/** Smoke test */
it("should render without crashing", () => {
	render(<Alert />);
});

/** Snapshot test */
it("should match snapshots", () => {
	const { asFragment } = render(<Alert />);
	expect(asFragment()).toMatchSnapshot();
});

it("should show a 'Not found' error message", () => {
	const { queryByText } = render(
		<Alert type="danger" messages={["Not found"]} />
	);
	expect(queryByText("Not found")).toBeInTheDocument();
});
