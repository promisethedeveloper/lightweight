import React, { useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import Alert from "../common/Alert";
import LightWeightAPI from "../api/api";

const WorkoutEditForm = () => {
	const { day, description } = useParams();

	const INITIALSTATE = {
		dayOfWeek: day,
		description: description,
	};

	// const { currentUser } = useContext(UserContext);
	// const { id: user_id } = currentUser;

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
			await LightWeightAPI.editWorkout(formData.dayOfWeek, formData);
			history.push("/workouts");
			setFormData(INITIALSTATE);
		} catch (error) {
			setFormErrors(error);
		}
	};

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData((data) => ({ ...data, [name]: value }));
	};

	return (
		<div className="LoginForm">
			<div className="container col-md-6 offset-md-3 col-lg-4 offset-lg-4">
				<h3 className="mb-3">Edit workout day</h3>

				<div className="card">
					<div className="card-body">
						<form onSubmit={handleSubmit}>
							<div className="form-group">
								<label htmlFor="dayOfWeek">Day of week</label>
								<input
									id="dayOfWeek"
									name="dayOfWeek"
									className="form-control"
									value={formData.dayOfWeek}
									onChange={handleChange}
									autoComplete="username"
									placeholder="ex. Monday"
									required
								/>
							</div>
							<div className="form-group">
								<label htmlFor="description">Description</label>
								<input
									id="description"
									name="description"
									className="form-control"
									value={formData.description}
									onChange={handleChange}
									placeholder="ex. Chest day"
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
								Update
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

export default WorkoutEditForm;
