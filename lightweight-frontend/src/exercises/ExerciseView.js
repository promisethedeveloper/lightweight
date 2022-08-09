import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import LightWeightAPI from "../api/api";
import LoadingSpinner from "../common/LoadingSpinner";

const ExerciseView = () => {
	const { name } = useParams();

	const [exercise, setExercise] = useState(null);

	useEffect(
		function getExerciseForUser() {
			async function getExercise() {
				try {
					const res = await LightWeightAPI.getExercise(name);
					setExercise(res);
				} catch (error) {
					console.log(error);
				}
			}

			getExercise();
		},
		[name]
	);

	if (!exercise) {
		return <LoadingSpinner />;
	}

	return (
		<div className="d-flex justify-content-end">
			<div className="ExerciseDetail col-md-8 offset-md-2">
				<div className="card" style={{ width: "18rem" }}>
					<img
						src={exercise.gifUrl}
						className="card-img-top"
						alt={exercise.name}
					/>
					<div className="card-body border">
						<h5 className="card-title">{exercise.name}</h5>
						<p className="card-text">
							This exercise targets your {exercise.target}. It is carried out
							using a {exercise.equipment}.
						</p>
					</div>
				</div>
			</div>
		</div>
	);
};

export default ExerciseView;
