"use strict";

const db = require("../db");
const { BadRequestError, NotFoundError } = require("../expressError");
const { sqlForPartialUpdate } = require("../helpers/sql");

/** Related functions for workouts. */

class Workout {
	/** Create new workout from data, update database, return new workout.
	 *
	 * data should contain { day_of_week, description, user_id }
	 *
	 * Returns { day_of_week, description, user_id }
	 *
	 * Throws BadRequestError if day_of_week already exist
	 */

	static async create({ dayOfWeek, description, user_id }) {
		const duplicateDay = await db.query(
			`SELECT day_of_week AS "dayOfWeek" 
                FROM workouts 
                WHERE user_id = $1`,
			[user_id]
		);

		const dayAlreadyInDatabase = duplicateDay.rows.find(
			(d) => d.dayOfWeek.toLowerCase() === dayOfWeek.toLowerCase()
		);

		if (dayAlreadyInDatabase) {
			throw new BadRequestError(`${dayOfWeek} is already in your workout!`);
		}

		const result = await db.query(
			`INSERT INTO workouts (day_of_week, description, user_id)
		        VALUES ($1, $2, $3) RETURNING day_of_week, description, user_id`,
			[dayOfWeek, description, user_id]
		);

		const workout = result.rows[0];
		return workout;
	}

	/** Find all workouts.
	 *
	 * Returns [ { dayOfWeek, description }, ...]
	 */

	static async findAll() {
		const result = await db.query(
			`SELECT day_of_week AS "dayOfWeek",
                    description
                FROM workouts
                ORDER BY user_id`
		);

		return result.rows;
	}

	/** Given a username, return user's workout.
	 *
	 * Returns { username, dayOfWeek, description }
	 *
	 *  Throws NotFoundError if user is not found.
	 */

	static async get(username) {
		const result = await db.query(
			`SELECT workouts.id, username,
                    day_of_week AS "dayOfWeek",
                    description
            FROM users
            JOIN workouts ON users.id = workouts.user_id
            WHERE username = $1`,
			[username]
		);

		const workouts = result.rows;

		if (!workouts) {
			throw new NotFoundError(`No workout: ${username}`);
		}

		return workouts;
	}

	/** Update user workout with `data`.
	 *
	 * This is a "partial update" -- it is fine if data doesn't contain
	 * all the fields; this only changes the provided fields.
	 *
	 * Data can include:
	 * 		{ day_of_week, description }
	 *
	 *  Returns { day_of_week, description, user_id}
	 *
	 * Throws NofFoundError if not found.
	 */

	static async update(day, data) {
		const { setCols, values } = sqlForPartialUpdate(data, {
			dayOfWeek: "day_of_week",
			description: "description",
		});

		const dayVarIdx = "$" + (values.length + 1);

		const querySql = `UPDATE workouts 
								SET ${setCols}
								WHERE day_of_week = ${dayVarIdx}
								RETURNING day_of_week AS "dayOfWeek",
										 description`;
		const result = await db.query(querySql, [...values, day]);
		const workout = result.rows[0];

		if (!workout) throw new NotFoundError(`No workout on day: ${day}`);

		return workout;
	}

	/** Delete given workout from database; returns undefined.
	 *
	 * Throws NotFoundError if exercise is not found.
	 */

	static async remove(day) {
		const result = await db.query(
			`DELETE FROM workouts
                    WHERE day_of_week = $1
                    RETURNING day_of_week`,
			[day]
		);

		const workout = result.rows[0];

		if (!workout) {
			throw new NotFoundError(`No workout found on: ${day}`);
		}
	}
}

module.exports = Workout;
