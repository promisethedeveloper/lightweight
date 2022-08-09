const bcrypt = require("bcrypt");

const db = require("../db.js");
const { BCRYPT_WORK_FACTOR } = require("../config");

let dataIds = {};

async function commonBeforeAll() {
	// noinspection SqlWithoutWhere
	await db.query("DELETE FROM users");
	// noinspection SqlWithoutWhere
	await db.query("DELETE FROM workouts");
	// noinspection SqlWithoutWhere
	await db.query("DELETE FROM exercises");
	// noinspection SqlWithoutWhere
	await db.query("DELETE FROM loggedexercises");

	const result = await db.query(
		`INSERT INTO users(username,
                          first_name,
                          last_name,
                          email,
                          password)
        VALUES ('u1', 'U1FN', 'U1LN', 'u1@email.com', $1),
        	   ('u2', 'U2FN', 'U2LN', 'u2@email.com', $2)
        RETURNING id`,
		[
			await bcrypt.hash("password1", BCRYPT_WORK_FACTOR),
			await bcrypt.hash("password2", BCRYPT_WORK_FACTOR),
		]
	);
	const { id: user_id } = result.rows[0];

	dataIds.userId = user_id;

	const workoutRes = await db.query(
		`INSERT INTO workouts (day_of_week, description, user_id)
		    VALUES ('Monday', 'Chest day', ${user_id})
	        RETURNING id, day_of_week, description, user_id`
	);

	const { id: workout_Id } = workoutRes.rows[0];

	dataIds.workoutId = workout_Id;

	const exercisesIds = await db.query(
		`INSERT INTO exercises (name, body_part, equipment, gif_url, target)
		VALUES ('Dumbbell bench press',
	    'chest',
	    'dumbbell',
	    'http://d205bpvrqc9yn1.cloudfront.net/0289.gif',
	    'pectorals'),
		('Incline dumbbell bench press',
         'chest',
         'dumbbell',
        'http://d205bpvrqc9yn1.cloudfront.net/0314.gif',
        'pectorals'
        ) RETURNING id`
	);
	const ids = exercisesIds.rows.map((element) => element.id);

	dataIds.exerciseId = ids;

	const loggedExercise = await db.query(
		`INSERT INTO loggedexercises 
		(workout_id, exercise_id, weight, unit, no_of_sets, no_of_reps)
		VALUES (${workout_Id}, ${ids[0]}, 240, 'kg', 5, 10) RETURNING id`
	);
	const logExIds = loggedExercise.rows.map((element) => element.id);
	dataIds.logExerciseId = logExIds;
}

async function commonBeforeEach() {
	await db.query("BEGIN");
}

async function commonAfterEach() {
	await db.query("ROLLBACK");
}

async function commonAfterAll() {
	data = {};
	await db.end();
}

module.exports = {
	commonBeforeAll,
	commonBeforeEach,
	commonAfterEach,
	commonAfterAll,
	dataIds,
};
