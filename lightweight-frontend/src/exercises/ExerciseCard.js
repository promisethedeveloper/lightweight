import React from "react";
import { Link } from "react-router-dom";

import "./ExerciseCard.css";

/** Show limited information about an exercise
 *
 * Is rendered by ExerciseList to show a "card" for each exercise.
 *
 * ExerciseList -> ExerciseCard
 */

const ExerciseCard = ({
	id: exercise_id,
	name,
	bodyPart,
	equipment,
	target,
	gifUrl,
	workout_Id,
}) => {
	return (
		<Link
			className="ExerciseCard card"
			to={`/exercises/${workout_Id}/${exercise_id}/${name}`}
		>
			<div className="card-body">
				<p className="card-title">Name: {name}</p>
				<img src={gifUrl} alt={name} className="float-right ml-5" />
				<p>Body part: {bodyPart}</p>
				<p>Target muscle: {target}</p>
				<p>Equipment: {equipment}</p>
			</div>
		</Link>
	);
};

export default ExerciseCard;
