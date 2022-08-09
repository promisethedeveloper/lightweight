import React, { useState, useContext } from "react";
import { useHistory } from "react-router-dom";
import UserContext from "../auth/UserContext";
import Alert from "../common/Alert";
import LightWeightAPI from "../api/api";

const WorkoutForm = () => {
	const INITIALSTATE = {
		dayOfWeek: "Monday",
		description: "",
	};

	const { currentUser } = useContext(UserContext);
	const { id: user_id } = currentUser;

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
			await LightWeightAPI.createWorkout(formData);
			history.push("/workouts");
			setFormData(INITIALSTATE);
		} catch (error) {
			setFormErrors(error);
		}
	};

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData((data) => ({ ...data, user_id: user_id, [name]: value }));
	};

	return (
		<div className="LoginForm">
			<div className="container col-md-6 offset-md-3 col-lg-4 offset-lg-4">
				<h3 className="mb-3">Add workout day</h3>

				<div className="card">
					<div className="card-body">
						<form onSubmit={handleSubmit}>
							<div className="form-group">
								<label htmlFor="dayOfWeek">Day of week</label>
								<select
									name="dayOfWeek"
									onChange={handleChange}
									className="form-control"
									value={formData.dayOfWeek}
									id="dayOfWeek"
								>
									<option value="Monday">Monday</option>
									<option value="Tuesday">Tuesday</option>
									<option value="Wednesday">Wednesday</option>
									<option value="Thursday">Thursday</option>
									<option value="Friday">Friday</option>
									<option value="Saturday">Saturday</option>
									<option value="Sunday">Sunday</option>
								</select>
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

export default WorkoutForm;
