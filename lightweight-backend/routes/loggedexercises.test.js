"use strict";

const request = require("supertest");
const Workout = require("../models/workout");
const Exercise = require("../models/exercise");
const Loggedexercise = require("../models/loggedexercise");

const app = require("../app");

const {
	commonBeforeAll,
	commonBeforeEach,
	commonAfterEach,
	commonAfterAll,
	u1Token,
	adminToken,
} = require("./_testCommon");

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

/*** POST /loggedexercises ***/

describe("POST /loggedexercises", function () {
	test("ok for admin", async function () {
		const workoutData = await Workout.get("u1");
		const workout_id = workoutData.map((w) => {
			return w.id;
		});

		const exerciseData = await Exercise.get("Dumbbell lateral raise");
		const { id: exercise_id } = exerciseData;

		const resp = await request(app)
			.post("/loggedexercises")
			.send({
				workoutId: workout_id[0],
				exerciseId: exercise_id,
				weight: 240,
				unit: "kg",
				noOfSets: 5,
				noOfReps: 10,
			})
			.set("authorization", `Bearer ${u1Token}`);
		expect(resp.statusCode).toEqual(201);
		expect(resp.body).toEqual({
			loggedexercise: {
				workout_id: expect.any(Number),
				exercise_id: expect.any(Number),
				weight: 240,
				unit: "kg",
				no_of_sets: 5,
				no_of_reps: 10,
			},
		});
	});

	test("bad request with missing data", async function () {
		const workoutData = await Workout.get("u1");
		const workout_id = workoutData.map((w) => {
			return w.id;
		});

		const exerciseData = await Exercise.get("Barbell deadlift");
		const { id: exercise_id } = exerciseData;
		const resp = await request(app)
			.post("/loggedexercises")
			.send({
				workoutId: workout_id[0],
				exerciseId: exercise_id,
				unit: "kg",
				noOfSets: 5,
				noOfReps: 10,
			})
			.set("authorization", `Bearer ${u1Token}`);
		expect(resp.statusCode).toEqual(400);
	});

	test("bad request with invalid data", async function () {
		const workoutData = await Workout.get("u1");
		const workout_id = workoutData.map((w) => {
			return w.id;
		});

		const exerciseData = await Exercise.get("Barbell deadlift");
		const { id: exercise_id } = exerciseData;
		const resp = await request(app)
			.post("/loggedexercises")
			.send({
				workoutId: workout_id[0],
				exerciseId: exercise_id,
				weight: "240",
				unit: "kg",
				noOfSets: "5",
				noOfReps: "10",
			})
			.set("authorization", `Bearer ${u1Token}`);
		expect(resp.statusCode).toEqual(400);
	});
});

/*** GET /loggedexercises/:workout_Id ***/

describe("GET /loggedexercises/:workout_Id", function () {
	test("ok for anon", async function () {
		const workoutData = await Workout.get("u1");
		const workout_id = workoutData.map((w) => {
			return w.id;
		});
		const resp = await request(app)
			.get(`/loggedexercises/${workout_id[0]}`)
			.set("authorization", `Bearer ${u1Token}`);
		expect(resp.body).toEqual({
			loggedexercise: [
				{
					username: "u1",
					name: "Dumbbell lateral raise",
					weight: 200,
					unit: "kg",
					no_of_sets: 5,
					no_of_reps: 10,
					id: expect.any(Number),
				},
			],
		});
	});
	test("not found for no such workout", async function () {
		const resp = await request(app).get("/loggedexercises/0");
		expect(resp.statusCode).toEqual(401);
	});
});

/*** PATCH /loggedexercises/:workout_Id ***/

describe("PATCH  /loggedexercises/:workout_Id ", function () {
	test("works for admin", async function () {
		const workoutData = await Workout.get("u1");
		const workout_id = workoutData.map((w) => {
			return w.id;
		});

		const logExData = await Loggedexercise.get(workout_id[0]);
		const loggedExerciseId = logExData.map((le) => {
			let { id } = le;
			return id;
		});

		const resp = await request(app)
			.patch(`/loggedexercises/${loggedExerciseId[0]}`)
			.send({
				weight: 500,
			})
			.set("authorization", `Bearer ${adminToken}`);
		expect(resp.body).toEqual({
			loggedexercise: {
				id: expect.any(Number),
				workout_id: expect.any(Number),
				exercise_id: expect.any(Number),
				weight: 500,
				unit: "kg",
				no_of_sets: 5,
				no_of_reps: 10,
			},
		});
	});
	test("works for user", async function () {
		const workoutData = await Workout.get("u1");
		const workout_id = workoutData.map((w) => {
			return w.id;
		});

		const logExData = await Loggedexercise.get(workout_id[0]);
		const loggedExerciseId = logExData.map((le) => {
			let { id } = le;
			return id;
		});
		const resp = await request(app)
			.patch(`/loggedexercises/${loggedExerciseId[0]}`)
			.send({
				weight: 500,
			})
			.set("authorization", `Bearer ${u1Token}`);
		expect(resp.body).toEqual({
			loggedexercise: {
				id: expect.any(Number),
				workout_id: expect.any(Number),
				exercise_id: expect.any(Number),
				weight: 500,
				unit: "kg",
				no_of_sets: 5,
				no_of_reps: 10,
			},
		});
	});
	test("unauth for anon", async function () {
		const workoutData = await Workout.get("u1");
		const workout_id = workoutData.map((w) => {
			return w.id;
		});

		const logExData = await Loggedexercise.get(workout_id[0]);
		const loggedExerciseId = logExData.map((le) => {
			let { id } = le;
			return id;
		});
		const resp = await request(app)
			.patch(`/loggedexercises/${loggedExerciseId[0]}`)
			.send({
				weight: 500,
			});
		expect(resp.statusCode).toEqual(401);
	});
	test("not found if no such logged exercise", async function () {
		const resp = await request(app)
			.patch(`/loggedexercises/1`)
			.send({
				weight: 500,
			})
			.set("authorization", `Bearer ${adminToken}`);
		expect(resp.statusCode).toEqual(404);
	});

	test("not found for user, if no such logged exercise", async function () {
		const resp = await request(app)
			.patch(`/loggedexercises/1`)
			.send({
				weight: 500,
			})
			.set("authorization", `Bearer ${u1Token}`);
		expect(resp.statusCode).toEqual(404);
	});
	test("bad request on invalid data", async function () {
		const workoutData = await Workout.get("u1");
		const workout_id = workoutData.map((w) => {
			return w.id;
		});

		const logExData = await Loggedexercise.get(workout_id[0]);
		const loggedExerciseId = logExData.map((le) => {
			let { id } = le;
			return id;
		});
		const resp = await request(app)
			.patch(`/loggedexercises/${loggedExerciseId[0]}`)
			.send({
				weight: "500",
			})
			.set("authorization", `Bearer ${adminToken}`);
		expect(resp.statusCode).toEqual(400);
	});
});

/*** DELETE /loggedexercises/:workout_Id ***/

describe("DELETE /loggedexercises/:workout_Id", function () {
	test("works for admin", async function () {
		const workoutData = await Workout.get("u1");
		const workout_id = workoutData.map((w) => {
			return w.id;
		});

		const logExData = await Loggedexercise.get(workout_id[0]);
		const loggedExerciseId = logExData.map((le) => {
			let { id } = le;
			return id;
		});
		const resp = await request(app)
			.delete(`/loggedexercises/${loggedExerciseId[0]}`)
			.set("authorization", `Bearer ${adminToken}`);
		expect(resp.statusCode).toEqual(200);
	});

	test("works for user", async function () {
		const workoutData = await Workout.get("u1");
		const workout_id = workoutData.map((w) => {
			return w.id;
		});

		const logExData = await Loggedexercise.get(workout_id[0]);
		const loggedExerciseId = logExData.map((le) => {
			let { id } = le;
			return id;
		});
		const resp = await request(app)
			.delete(`/loggedexercises/${loggedExerciseId[0]}`)
			.set("authorization", `Bearer ${u1Token}`);
		expect(resp.statusCode).toEqual(200);
	});

	test("unauth for anon", async function () {
		const workoutData = await Workout.get("u1");
		const workout_id = workoutData.map((w) => {
			return w.id;
		});

		const logExData = await Loggedexercise.get(workout_id[0]);
		const loggedExerciseId = logExData.map((le) => {
			let { id } = le;
			return id;
		});
		const resp = await request(app).delete(
			`/loggedexercises/${loggedExerciseId[0]}`
		);
		expect(resp.statusCode).toEqual(401);
	});

	test("not found for no such logged exercise", async function () {
		const resp = await request(app)
			.delete(`/loggedexercises/0`)
			.set("authorization", `Bearer ${adminToken}`);
		expect(resp.statusCode).toEqual(404);
	});
});
