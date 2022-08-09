import React, { useState } from "react";
import Alert from "../common/Alert";

const ExerciseForm = ({ searchFor }) => {
	const [searchTerm, setSearchTerm] = useState("");
	const [formErrors, setFormErrors] = useState([]);

	const handleChange = (e) => {
		setSearchTerm(e.target.value);
	};

	const handleSubmit = (e) => {
		try {
			e.preventDefault();
			// handle accidental input of spaces
			searchFor(searchTerm.trim() || undefined);
			setSearchTerm(searchTerm.trim());
		} catch (error) {
			setFormErrors(error);
		}
	};

	return (
		<div className="container">
			<div className="ExerciseForm row justify-content-center">
				<div className="col-md-12 mb-4 justify-content-center">
					<form className="form-inline flex-grow-1" onSubmit={handleSubmit}>
						<input
							className="form-control form-control-lg flex-grow-1"
							name="searchTerm"
							placeholder="Search for exercises by name..."
							value={searchTerm}
							onChange={handleChange}
						/>
						{formErrors.length ? (
							<Alert type="danger" messages={formErrors} />
						) : null}
						<button
							type="submit"
							className="btn btn-lg"
							style={{ backgroundColor: "#461111", color: "white" }}
						>
							SEARCH
						</button>
					</form>
				</div>
			</div>
		</div>
	);
};

export default ExerciseForm;
