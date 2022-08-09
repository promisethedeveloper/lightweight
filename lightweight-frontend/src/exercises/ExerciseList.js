import React, { useState, useEffect } from "react";
import LightWeightAPI from "../api/api";
import LoadingSpinner from "../common/LoadingSpinner";
import { useParams } from "react-router-dom";
import ExerciseForm from "./ExerciseForm";
import ExerciseCard from "./ExerciseCard";
import "./ExerciseForm.css";
import { v4 as uuidv4 } from "uuid";

const ExerciseList = () => {
	const [exercises, setExercises] = useState(null);

	const { workout_Id } = useParams();

	useEffect(function getExercisesOnMount() {
		search();
	}, []);

	// Triggered by submitting search form
	async function search(name) {
		let exercises = await LightWeightAPI.getExercises(name);
		setExercises(exercises);
	}

	if (!exercises) {
		return <LoadingSpinner />;
	}

	return (
		<div className="col-md-12">
			<ExerciseForm searchFor={search} />
			{exercises.length ? (
				<div className="ExerciseList-list">
					{exercises.map((e) => (
						<ExerciseCard
							key={uuidv4()}
							name={e.name}
							bodyPart={e.bodyPart}
							equipment={e.equipment}
							target={e.target}
							gifUrl={e.gifUrl}
							id={e.id}
							workout_Id={workout_Id}
						/>
					))}
				</div>
			) : (
				<p className="lead">Sorry, no results were found.</p>
			)}
		</div>
	);
};

export default ExerciseList;
