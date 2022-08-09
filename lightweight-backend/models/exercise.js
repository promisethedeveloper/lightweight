"use strict";

const db = require("../db");
const { BadRequestError, NotFoundError } = require("../expressError");
const { sqlForPartialUpdate } = require("../helpers/sql");

/** Related functions for exercises. */

class Exercise {
	/** Create an exercise from data, update database, return new exercise.
	 *
	 * data should contain { name, bodyPart, equipment, gifUrl, target }
	 *
	 * Returns { name, bodyPart, equipment, gifUrl, target }
	 *
	 * Throws BadRequestError if exercise already exist in database.
	 */

	static async create({ name, bodyPart, equipment, gifUrl, target }) {
		const duplicateCheck = await db.query(
			`SELECT name 
            FROM exercises 
            WHERE name = $1`,
			[name]
		);

		if (duplicateCheck.rows[0]) {
			throw new BadRequestError(`Duplicate exercise: ${name}`);
		}

		const result = await db.query(
			`INSERT INTO exercises 
            (name, body_part, equipment, gif_url, target)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING name, body_part AS "bodyPart", equipment, gif_url AS "gifUrl", target`,
			[name, bodyPart, equipment, gifUrl, target]
		);

		const exercise = result.rows[0];

		return exercise;
	}

	/** Find all exercises (optional filter on searchFilters).
	 *
	 * searchFilters (all optional):
	 * - name
	 * - bodyPart
	 * - equipment
	 * - target
	 *
	 * Returns [{ name, bodyPart, equipment, gifUrl, target }]
	 *
	 */

	static async findAll(searchFilters = {}) {
		let query = `SELECT id, name, 
                        body_part AS "bodyPart",
                        equipment,
                        gif_Url AS "gifUrl",
                      target
                    FROM exercises`;
		let whereExpressions = [];
		let queryValues = [];

		const { name, bodyPart, equipment, target } = searchFilters;

		if (name) {
			queryValues.push(`%${name}%`);
			whereExpressions.push(`name ILIKE $${queryValues.length}`);
		}

		if (bodyPart) {
			queryValues.push(`%${bodyPart}%`);
			whereExpressions.push(`body_part ILIKE $${queryValues.length}`);
		}

		if (equipment) {
			queryValues.push(`%${equipment}%`);
			whereExpressions.push(`equipment ILIKE $${queryValues.length}`);
		}

		if (target) {
			queryValues.push(`%${target}%`);
			whereExpressions.push(`target ILIKE $${queryValues.length}`);
		}

		if (whereExpressions.length > 0) {
			query += " WHERE " + whereExpressions.join(" AND ");
		}

		// finalize query and return results

		query += " ORDER BY name";
		const exerciseRes = await db.query(query, queryValues);
		return exerciseRes.rows;
	}

	/** Given an exercise name, return data about the exercise
	 *
	 * Returns { name, body_part, equipment, gif_url, target }
	 *
	 * Throws NotFoundError if not found.
	 */

	static async get(name) {
		const exerciseRes = await db.query(
			`SELECT id, name, 
					body_part AS "bodyPart",
					equipment,
					gif_url AS "gifUrl",
					target
			FROM exercises
			WHERE name = $1`,
			[name]
		);

		const exercise = exerciseRes.rows[0];

		if (!exercise) {
			throw new NotFoundError(`No exercise: ${exercise}`);
		}

		return exercise;
	}

	/** Update user data with `data`.
	 *
	 * This is a "partial update" -- it is fine if data doesn't contain
	 * all the fields; this only changes the provided fields.
	 *
	 * Data can include:
	 * 		{ name, body_part, equipment, gif_url, target }
	 *
	 * Returns { id, name, bodyPart, equipment, gifUrl, target }
	 *
	 * Throws NofFoundError if not found.
	 */

	static async update(name, data) {
		const { setCols, values } = sqlForPartialUpdate(data, {
			name: "name",
			bodyPart: "body_part",
			equipment: "equipment",
			gifUrl: "gif_url",
			target: "target",
		});

		const nameVarIdx = "$" + (values.length + 1);

		const querySql = `UPDATE exercises
						  SET ${setCols}
						  WHERE name = ${nameVarIdx}
						  RETURNING id,
						  			name,
									body_part AS "bodyPart",
									equipment,
									gif_url AS "gifUrl",
									target`;
		const result = await db.query(querySql, [...values, name]);
		const exercise = result.rows[0];

		if (!exercise) {
			throw new NotFoundError(`No exercise: ${name}`);
		}

		return exercise;
	}

	/** Delete given exercise from database; returns undefined.
	 *
	 * Throws NotFoundError if exercise is not found.
	 */

	static async remove(name) {
		const result = await db.query(
			`DELETE FROM exercises
			WHERE name = $1
			RETURNING name`,
			[name]
		);

		const exercise = result.rows[0];

		if (!exercise) {
			throw new NotFoundError(`No exercise: ${name}`);
		}
	}
}

module.exports = Exercise;
