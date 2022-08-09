import React from "react";
import Dropdown from "react-bootstrap/Dropdown";
import { Link } from "react-router-dom";
import LightWeightAPI from "../api/api";
import "./LogExercise.css";

const Logexercise = ({
	loggedexerciseId,
	name,
	weight,
	unit,
	no_of_sets,
	no_of_reps,
	i,
	onLoggedExerciseDelete,
}) => {
	async function deleteLoggedExercise(loggedexerciseId) {
		await LightWeightAPI.deleteLoggedExercise(loggedexerciseId);
		onLoggedExerciseDelete(loggedexerciseId);
	}

	return (
		<div className="d-flex flex-row border m-3">
			<div className="mr-1">#{i + 1}</div>
			<div>
				<Dropdown>
					<Dropdown.Toggle variant="blue" id="dropdown-basic"></Dropdown.Toggle>
					<Dropdown.Menu>
						<Dropdown.Item>
							<Link
								to={`/workouts/edit/${loggedexerciseId}/${weight}/${unit}/${no_of_sets}/${no_of_reps}`}
								className="LogExercise-edit-button"
							>
								Edit
							</Link>
						</Dropdown.Item>
						<Dropdown.Item
							onClick={() => deleteLoggedExercise(loggedexerciseId)}
						>
							Delete
						</Dropdown.Item>
					</Dropdown.Menu>
				</Dropdown>
			</div>

			<div className="flex-grow-1 ml-5">
				<p>
					<strong>{name}</strong>
				</p>
				<p>
					{no_of_sets} sets x {no_of_reps} reps ({weight}
					{unit})
				</p>
			</div>
			<div>
				<Link to={`exercise/${name}`}>
					<button
						className="btn btn-sm"
						style={{ backgroundColor: "#461111", color: "white" }}
					>
						View
					</button>
				</Link>
			</div>
		</div>
	);
};

export default Logexercise;
