import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { useParams } from "react-router-dom";
import Alert from "../common/Alert";
import LightWeightAPI from "../api/api";
import LoadingSpinner from "../common/LoadingSpinner";

const LogExerciseForm = () => {
	const { name, exercise_Id, workout_Id } = useParams();

	const [currentExercise, setCurrentExercise] = useState(null);

	useEffect(
		function getExerciseForUser() {
			async function getExercise() {
				try {
					let res = await LightWeightAPI.getExercise(name);
					setCurrentExercise(res);
				} catch (error) {
					console.log(error);
				}
			}

			getExercise();
		},
		[name]
	);

	const INITIALSTATE = {
		workoutId: "",
		exerciseId: "",
		weight: "",
		unit: "",
		noOfSets: "",
		noOfReps: "",
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
			let { workoutId, exerciseId, unit, weight, noOfSets, noOfReps } =
				formData;
			let data = {
				workoutId: +workoutId,
				exerciseId: +exerciseId,
				unit,
				weight: +weight,
				noOfSets: +noOfSets,
				noOfReps: +noOfReps,
			};
			await LightWeightAPI.logExercise(data);
			history.push("/workouts");
			setFormData(INITIALSTATE);
		} catch (error) {
			setFormErrors(error);
		}
	};

	if (currentExercise === null) {
		return <LoadingSpinner />;
	}

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData((data) => ({
			...data,
			workoutId: workout_Id,
			exerciseId: exercise_Id,
			[name]: value,
		}));
	};

	return (
		<div className="LoginForm">
			<div className="container col-md-6 offset-md-3 col-lg-4 offset-lg-4">
				<h3 className="mb-3">Log exercise</h3>
				<div className="card">
					<div className="card-body">
						<div className="mb-4">
							<h3>Add {currentExercise.name} to workout!</h3>
						</div>
						<form onSubmit={handleSubmit}>
							<div className="form-group">
								<label>Weight</label>
								<input
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
								<label>Unit</label>
								<input
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
								<label>No. of sets</label>
								<input
									type="number"
									name="noOfSets"
									className="form-control"
									value={formData.noOfSets}
									onChange={handleChange}
									placeholder="ex. 5"
									required
								/>
							</div>
							<div className="form-group">
								<label>No. of Reps.</label>
								<input
									type="number"
									name="noOfReps"
									className="form-control"
									value={formData.noOfReps}
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

export default LogExerciseForm;
