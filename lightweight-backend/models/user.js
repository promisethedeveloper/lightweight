"use strict";

const db = require("../db");
const bcrypt = require("bcrypt");
const { sqlForPartialUpdate } = require("../helpers/sql");
const {
	NotFoundError,
	BadRequestError,
	UnauthorizedError,
} = require("../expressError");

const { BCRYPT_WORK_FACTOR } = require("../config");

class User {
	/**
	 * Authenticate user with firstname and password.
	 *
	 * Returns {username, firstname, lastname, email, is_admin}
	 *
	 *  Throws UnauthorizedError if User is not found or if the inputed password is wrong.
	 */

	static async authenticate(username, password) {
		// try to find the User first
		const result = await db.query(
			`SELECT username, 
                    password,
                    first_name AS "firstName", 
                    last_name AS "lastName", 
                    email, 
                    is_admin AS "isAdmin" 
            FROM users
            WHERE username = $1`,
			[username]
		);

		const user = result.rows[0];

		if (user) {
			// compare hashed password to a new hash from inputed password
			const isValid = await bcrypt.compare(password, user.password);
			if (isValid) {
				delete user.password;
				return user;
			}
		}
		throw new UnauthorizedError("Invalid username/password");
	}

	/** Register user with data
	 *
	 * Returns {username, firstName, lastName, email, isAdmin}
	 */

	static async register({
		username,
		password,
		firstName,
		lastName,
		email,
		isAdmin,
	}) {
		const duplicateCheck = await db.query(
			`SELECT username 
                FROM users 
                WHERE username = $1`,
			[username]
		);

		if (duplicateCheck.rows[0]) {
			throw new BadRequestError(`Duplicate username: ${username}`);
		}

		const hashedPassword = await bcrypt.hash(password, BCRYPT_WORK_FACTOR);

		const result = await db.query(
			`INSERT INTO users 
                (username, 
                password, 
                first_name, 
                last_name,
                email, 
                is_admin) 
                VALUES ($1, $2, $3, $4, $5, $6) 
                RETURNING username, first_name AS "firstName", last_name AS "lastName", email, is_Admin AS "isAdmin"`,
			[username, hashedPassword, firstName, lastName, email, isAdmin]
		);

		const user = result.rows[0];

		return user;
	}

	/** Find all users.
	 *
	 * Returns [{ username, first_name, last_name, email, is_admin }, ...]
	 */

	static async findAll() {
		let result = await db.query(
			`SELECT username,
					first_name AS "firstName",
					last_name AS "lastName",
					email,
					is_admin AS "isAdmin"
			FROM users
			ORDER BY username`
		);

		return result.rows;
	}

	/** Given a username, return data about user.
	 *
	 * Returns { username, first_name, last_name, is_admin, loggedexercises }
	 * 		where loggedexercises is { user_id, day_of_week, description,
	 * 								 	name, body_part, equipment, gif_url, target }
	 *
	 *
	 *  Throws NotFoundError if user is not found.
	 */

	static async get(username) {
		// const userRes = await db.query(
		// 	`SELECT username,
		//           first_name AS "firstName",
		//           last_name AS "lastName",
		//           email,
		//           is_admin AS "isAdmin",
		// 		  users.id
		//    FROM users
		//    JOIN workouts ON users.id = workouts.user_id
		//    WHERE username = $1`,
		// 	[username]
		// );
		const userRes = await db.query(
			`SELECT username,
		          first_name AS "firstName",
		          last_name AS "lastName",
		          email,
		          is_admin AS "isAdmin",
				  users.id
		   FROM users
		   WHERE username = $1`,
			[username]
		);

		const user = userRes.rows[0];

		if (!user) throw new NotFoundError(`No user: ${username}`);

		return user;
	}

	/** Update user data with `data`.
	 *
	 * This is a "partial update" -- it is fine if data doesn't contain
	 * all the fields; this only changes the provided fields.
	 *
	 * Data can include:
	 * 		{ firstName, lastName, password, email, isAdmin }
	 *
	 * Returns { username, firstName, lastName, email, isAdmin }
	 *
	 * WARNING: This function can set a new password or make a user an admin.
	 * Callers of this function must be certain that they have validated inputs to this
	 * or serious security risks are opened.
	 *
	 */

	static async update(username, data) {
		if (data.password) {
			data.password = await bcrypt.hash(data.password, BCRYPT_WORK_FACTOR);
		}

		const { setCols, values } = sqlForPartialUpdate(data, {
			firstName: "first_name",
			lastName: "last_name",
			isAdmin: "is_admin",
		});

		const usernameVarIdx = "$" + (values.length + 1);

		const querySql = `UPDATE users 
								SET ${setCols}
								WHERE username = ${usernameVarIdx}
								RETURNING username,
										  first_name AS "firstName",
										  last_name AS "lastName",
										  email,
										  is_admin AS "isAdmin"`;
		const result = await db.query(querySql, [...values, username]);
		const user = result.rows[0];

		if (!user) throw new NotFoundError(`No user: ${username}`);

		delete user.password;
		return user;
	}

	/** DELETE given user from database; returns undefined. */

	static async remove(username) {
		let result = await db.query(
			`DELETE FROM users
				WHERE username = $1
				RETURNING username`,
			[username]
		);

		const user = result.rows[0];

		if (!user) throw new NotFoundError(`No user: ${username}`);
	}
}

module.exports = User;
