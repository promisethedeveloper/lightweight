import React from "react";
import { render, screen } from "@testing-library/react";
import ReactDOM from "react-dom";
import App from "./App";

test("renders Sore today, stronger tomorrow.", () => {
	render(<App />);
	const lead = screen.getByText("Sore today, stronger tomorrow.");
	expect(lead).toBeInTheDocument();
});

it("renders without crashing", function () {
	const div = document.createElement("div");
	ReactDOM.render(<App />, div);
	ReactDOM.unmountComponentAtNode(div);
});
