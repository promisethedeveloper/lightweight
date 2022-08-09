"use strict";

const db = require("../db.js");
const User = require("../models/user");
const Exercise = require("../models/exercise");
const LoggedExercise = require("../models/loggedexercise");
const Workout = require("../models/workout");
const { createToken } = require("../helpers/tokens");

let dataRoute = {};

async function commonBeforeAll() {
	// noinspection SqlWithoutWhere
	await db.query("DELETE FROM users");
	// noinspection SqlWithoutWhere
	await db.query("DELETE FROM workouts");
	// noinspection SqlWithoutWhere
	await db.query("DELETE FROM exercises");
	// noinspection SqlWithoutWhere
	await db.query("DELETE FROM loggedexercises");

	await User.register({
		username: "u1",
		firstName: "U1FN",
		lastName: "U1LN",
		email: "user1@user.com",
		password: "password1",
		isAdmin: false,
	});

	const { id: user_id } = await User.get("u1");

	dataRoute.userId = user_id;

	await User.register({
		username: "u2",
		firstName: "U2FN",
		lastName: "U2LN",
		email: "user2@user.com",
		password: "password2",
		isAdmin: false,
	});

	await Workout.create({
		dayOfWeek: "Wednesday",
		description: "Cardio",
		user_id: user_id,
	});

	const workoutData = await Workout.get("u1");
	const workout_id = workoutData.map((w) => {
		return w.id;
	});

	dataRoute.workoutId = workout_id[0];

	await Exercise.create({
		name: "Dumbbell lateral raise",
		bodyPart: "shoulders",
		equipment: "barbell",
		gifUrl: "http://d205bpvrqc9yn1.cloudfront.net/0334.gif",
		target: "delts",
	});

	await Exercise.create({
		name: "Barbell deadlift",
		bodyPart: "upper legs",
		equipment: "barbell",
		gifUrl: "http://d205bpvrqc9yn1.cloudfront.net/0032.gif",
		target: "glutes",
	});

	const exerciseData = await Exercise.get("Dumbbell lateral raise");
	const { id: exercise_id } = exerciseData;

	await LoggedExercise.create({
		workoutId: workout_id[0],
		exerciseId: exercise_id,
		weight: 200,
		unit: "kg",
		noOfSets: 5,
		noOfReps: 10,
	});
}

async function commonBeforeEach() {
	await db.query("BEGIN");
}

async function commonAfterEach() {
	await db.query("ROLLBACK");
}

async function commonAfterAll() {
	dataRoute = {};
	await db.end();
}

const u1Token = createToken({ username: "u1", isAdmin: false });
const u2Token = createToken({ username: "u2", isAdmin: false });
const adminToken = createToken({ username: "admin", isAdmin: true });

module.exports = {
	commonBeforeAll,
	commonBeforeEach,
	commonAfterEach,
	commonAfterAll,
	u1Token,
	u2Token,
	adminToken,
	dataRoute,
};
