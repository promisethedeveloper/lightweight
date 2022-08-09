import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Dropdown from "react-bootstrap/Dropdown";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGear } from "@fortawesome/free-solid-svg-icons";
import LightWeightAPI from "../api/api";
import Logexercise from "../logExercise/LogExercise";
import { v4 as uuidv4 } from "uuid";
import "./WorkoutDay.css";

const WorkoutDay = ({ id, dayOfWeek, description, onWorkoutDelete }) => {
	let workout_Id = id;

	const [loggedexercises, setLoggedExercises] = useState([]);

	useEffect(() => {
		getLoggedExercises(workout_Id);
	}, [workout_Id]);

	async function getLoggedExercises(id) {
		try {
			let res = await LightWeightAPI.getloggedExercise(id);
			setLoggedExercises(res);
		} catch (error) {
			console.log(error);
		}
	}

	async function deleteWorkout(dayOfWeek) {
		try {
			await LightWeightAPI.deleteWorkout(dayOfWeek);
			onWorkoutDelete(dayOfWeek);
		} catch (error) {
			console.log(error);
		}
	}

	const onLoggedExerciseDelete = (loggedexerciseId) => {
		setLoggedExercises(
			loggedexercises.filter((e) => e.id !== loggedexerciseId)
		);
	};

	return (
		<div className="border border-5 p-2 mb-2">
			<div className="d-flex">
				<div className="flex-grow-1">
					<h5>{dayOfWeek}</h5>
					<p>
						<strong>{description}</strong>
					</p>
				</div>
				<Dropdown>
					<Dropdown.Toggle
						variant="blue"
						className="workday-toggle"
						id="dropdown-basic"
					>
						<FontAwesomeIcon icon={faGear} fa-3x="true" />
					</Dropdown.Toggle>

					<Dropdown.Menu>
						<Dropdown.Item>
							<Link
								to={`/workouts/edit/${dayOfWeek}/${description}`}
								className="WorkoutDay-edit-button"
							>
								Edit
							</Link>
						</Dropdown.Item>
						<Dropdown.Item onClick={() => deleteWorkout(dayOfWeek)}>
							Delete
						</Dropdown.Item>
					</Dropdown.Menu>
				</Dropdown>
			</div>

			{loggedexercises.length ? (
				<div>
					{loggedexercises.map(
						(
							{
								id: loggedexerciseId,
								name,
								weight,
								unit,
								no_of_sets,
								no_of_reps,
							},
							i
						) => (
							<Logexercise
								key={uuidv4()}
								loggedexerciseId={loggedexerciseId}
								name={name}
								weight={weight}
								unit={unit}
								no_of_sets={no_of_sets}
								no_of_reps={no_of_reps}
								i={i}
								onLoggedExerciseDelete={onLoggedExerciseDelete}
							/>
						)
					)}
				</div>
			) : null}
			<div className="d-flex justify-content-center">
				<Link to={`/exercises/${workout_Id}`}>
					Add exercises to this workout day
				</Link>
			</div>
		</div>
	);
};

export default WorkoutDay;
