import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { useParams } from "react-router-dom";
import Alert from "../common/Alert";
import LightWeightAPI from "../api/api";

const LoggedExerciseEditForm = () => {
	const { id, weight, unit, no_of_sets, no_of_reps } = useParams();

	const INITIALSTATE = {
		weight,
		unit,
		no_of_sets,
		no_of_reps,
	};

	const history = useHistory();
	const [formData, setFormData] = useState(INITIALSTATE);
	const [formErrors, setFormErrors] = useState([]);

	/**
	 * Handle form submit:
	 *
	 * Calls login function prop and if successful, redirect to "/workouts"
	 */

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			let { weight, unit, no_of_sets, no_of_reps } = formData;
			let data = {
				weight: +weight,
				unit,
				no_of_sets: +no_of_sets,
				no_of_reps: +no_of_reps,
			};
			await LightWeightAPI.editLoggedExercise(id, data);
			history.push("/workouts");
			setFormData(INITIALSTATE);
		} catch (error) {
			setFormErrors(error);
		}
	};

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData((data) => ({
			...data,
			[name]: value,
		}));
	};

	return (
		<div className="LoginForm">
			<div className="container col-md-6 offset-md-3 col-lg-4 offset-lg-4">
				<h3 className="mb-3">Edit exercise</h3>
				<div className="card">
					<div className="card-body">
						<form onSubmit={handleSubmit}>
							<div className="form-group">
								<label htmlFor="weight">Weight</label>
								<input
									id="weight"
									type="number"
									name="weight"
									className="form-control"
									value={formData.weight}
									onChange={handleChange}
									placeholder="ex. 100"
									required
								/>
							</div>
							<div className="form-group">
								<label htmlFor="unit">Unit</label>
								<input
									id="unit"
									type="text"
									name="unit"
									className="form-control"
									value={formData.unit}
									onChange={handleChange}
									placeholder="ex. kg or Lbs"
									required
								/>
							</div>
							<div className="form-group">
								<label htmlFor="no_of_sets">No. of sets</label>
								<input
									id="no_of_sets"
									type="number"
									name="noOfSets"
									className="form-control"
									value={formData.no_of_sets}
									onChange={handleChange}
									placeholder="ex. 5"
									required
								/>
							</div>
							<div className="form-group">
								<label htmlFor="no_of_reps">No. of Reps.</label>
								<input
									id="no_of_reps"
									type="number"
									name="noOfReps"
									className="form-control"
									value={formData.no_of_reps}
									onChange={handleChange}
									placeholder="ex. 10"
									required
								/>
							</div>
							{formErrors.length ? (
								<Alert type="danger" messages={formErrors} />
							) : null}
							<button
								className="btn float-right font-weight-bold"
								style={{ backgroundColor: "#461111", color: "white" }}
							>
								Save
							</button>
							<a
								className="btn float-right font-weight-bold"
								style={{
									backgroundColor: "#FF1E00",
									color: "white",
									marginRight: "5px",
								}}
								href="/workouts"
								role="button"
							>
								Cancel
							</a>
						</form>
					</div>
				</div>
			</div>
		</div>
	);
};

export default LoggedExerciseEditForm;
