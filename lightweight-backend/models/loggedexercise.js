"use strict";

const db = require("../db");
const { NotFoundError } = require("../expressError");
const { sqlForPartialUpdate } = require("../helpers/sql");

/** Related functions for loggedexercises. */

class Loggedexercise {
	/** Create loggedexercises from data, update database, return new loggedexercise.
	 *
	 * data should contain { workout_id, exercise_id, weight, unit, no_of_sets, no_of_reps }
	 *
	 * Returns { workout_id, exercise_id, weight, unit, no_of_sets, no_of_reps }
	 *
	 * Throws BadRequestError if workout_id already exist
	 */

	static async create({
		workoutId,
		exerciseId,
		weight,
		unit,
		noOfSets,
		noOfReps,
	}) {
		const result = await db.query(
			`INSERT INTO loggedexercises (workout_id, exercise_id, weight, unit, no_of_sets, no_of_reps)
                VALUES ($1, $2, $3, $4, $5, $6) 
                RETURNING workout_id, exercise_id, weight, unit, no_of_sets, no_of_reps`,
			[workoutId, exerciseId, weight, unit, noOfSets, noOfReps]
		);

		const loggedexercise = result.rows[0];
		return loggedexercise;
	}

	static async get(workout_Id) {
		const allUserLoggedExercises = await db.query(
			`SELECT users.username,
					exercises.name,
                    loggedexercises.weight,
                    loggedexercises.unit,
                    loggedexercises.no_of_sets,
                    loggedexercises.no_of_reps,
                    loggedexercises.id
			FROM users
			JOIN workouts ON users.id = workouts.user_id
			JOIN loggedexercises ON workouts.id = loggedexercises.workout_id
			JOIN exercises ON loggedexercises.exercise_id = exercises.id
			WHERE loggedexercises.workout_id = $1`,
			[workout_Id]
		);

		const result = allUserLoggedExercises.rows;
		return result;
	}

	static async update(id, data) {
		const { setCols, values } = sqlForPartialUpdate(data, {
			id: "loggedexerciseId",
			weight: "weight",
			unit: "unit",
			noOfSets: "no_of_sets",
			noOfReps: "no_of_reps",
		});

		const loggedExerciseVarIdx = "$" + (values.length + 1);

		const querySql = `UPDATE loggedexercises
						  SET ${setCols}
						  WHERE id = ${loggedExerciseVarIdx}
						  RETURNING id,
									workout_id,
						  			exercise_id,
									weight,
									unit,
									no_of_sets,
									no_of_reps`;
		const result = await db.query(querySql, [...values, id]);
		const loggedexercise = result.rows[0];

		if (!loggedexercise) {
			throw new NotFoundError(`No Logged exercise: ${id}`);
		}

		return loggedexercise;
	}

	/** Delete given loggedexercise from database; returns undefined.
	 *
	 * Throws NotFoundError if loggedexercise is not found.
	 */

	static async remove(id) {
		const result = await db.query(
			`DELETE FROM loggedexercises
                    WHERE id = $1
                    RETURNING id`,
			[id]
		);

		const loggedexercise = result.rows[0];

		if (!loggedexercise) {
			throw new NotFoundError(`No loggedexercise found on: ${id}`);
		}
	}
}

module.exports = Loggedexercise;
