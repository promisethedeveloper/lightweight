import React, { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import UserContext from "../auth/UserContext";
import LightWeightAPI from "../api/api";
import WorkoutDay from "./WorkoutDay";
import { v4 as uuidv4 } from "uuid";

import "./WorkoutList.css";

/** Show all workouts */

const WorkoutList = () => {
	const [workouts, setWorkouts] = useState([]);

	const { currentUser } = useContext(UserContext);
	const { username } = currentUser;

	useEffect(() => {
		getWorkouts(username);
	}, [username]);

	async function getWorkouts(username) {
		try {
			let res = await LightWeightAPI.getWorkouts(username);
			setWorkouts(res);
		} catch (error) {
			console.log(error);
		}
	}

	const onWorkoutDelete = (dayOfWeek) => {
		setWorkouts(workouts.filter((w) => w.dayOfWeek !== dayOfWeek));
	};

	return (
		<div>
			<div className="col-md-8 offset-md-2">
				<h3 className="mb-3 pb-2 border-bottom">WORKOUTS</h3>
				{workouts.length ? (
					<div>
						{workouts.map(({ id, dayOfWeek, description }) => (
							<WorkoutDay
								dayOfWeek={dayOfWeek}
								description={description}
								key={uuidv4()}
								id={id}
								onWorkoutDelete={onWorkoutDelete}
							/>
						))}
					</div>
				) : null}
			</div>
			{workouts.length < 7 && (
				<div className="d-flex flex-row justify-content-center">
					<Link className="p-2 mt-3" to="/workouts/day">
						Add workout day
					</Link>
				</div>
			)}
		</div>
	);
};

export default WorkoutList;
