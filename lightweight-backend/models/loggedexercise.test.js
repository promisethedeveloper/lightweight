"use strict";

const db = require("../db.js");
const { BadRequestError, NotFoundError } = require("../expressError");
const Loggedexercise = require("./loggedexercise.js");

const {
	commonBeforeAll,
	commonBeforeEach,
	commonAfterEach,
	commonAfterAll,
	dataIds,
} = require("./_testCommon");

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

/*** create ***/

describe("create", function () {
	test("creates new logged exercise", async function () {
		const newLoggedExercise = {
			workoutId: dataIds.workoutId,
			exerciseId: dataIds.exerciseId[0],
			weight: 240,
			unit: "kg",
			noOfSets: 5,
			noOfReps: 10,
		};
		await Loggedexercise.create(newLoggedExercise);
		const results = await db.query(
			`SELECT workout_id AS "workoutId", exercise_id AS "exerciseId",
					weight, unit, no_of_sets AS "noOfSets", no_of_reps AS "noOfReps"
					FROM loggedexercises
					WHERE workout_id = '${dataIds.workoutId}'`
		);
		expect(results.rows[0]).toEqual(newLoggedExercise);
	});
});

/*** get ***/

describe("get", function () {
	test("works", async function () {
		let loggedexercises = await Loggedexercise.get(dataIds.workoutId);
		expect(loggedexercises).toEqual([
			{
				id: dataIds.logExerciseId[0],
				username: "u1",
				name: "Dumbbell bench press",
				weight: 240,
				unit: "kg",
				no_of_sets: 5,
				no_of_reps: 10,
			},
		]);
	});

	test("returns an empty array if the exercise is not logged", async function () {
		const results = await Loggedexercise.get(0);
		expect(results).toEqual([]);
	});
});

describe("update", function () {
	const updateData = {
		weight: 500,
		unit: "lbs",
		no_of_sets: 3,
		no_of_reps: 15,
	};

	test("works", async function () {
		const loggedExerciseRes = await Loggedexercise.update(
			dataIds.logExerciseId[0],
			updateData
		);
		const { weight, unit, no_of_sets, no_of_reps } = loggedExerciseRes;
		const resultData = { weight, unit, no_of_sets, no_of_reps };
		expect(resultData).toEqual(updateData);
	});

	test("returns not found if the logged exercise of intended update is not in the database", async function () {
		try {
			await Loggedexercise.update(0, updateData);
			fail();
		} catch (err) {
			expect(err instanceof NotFoundError).toBeTruthy();
		}
	});

	test("bad request if no data", async function () {
		try {
			await Loggedexercise.update(dataIds.logExerciseId[0], {});
			fail();
		} catch (err) {
			expect(err instanceof BadRequestError).toBeTruthy();
		}
	});
});

/* remove */

describe("remove", function () {
	test("works", async function () {
		await Loggedexercise.remove(dataIds.logExerciseId[0]);
		const res = await db.query(
			`SELECT id FROM loggedexercises WHERE id=${dataIds.logExerciseId[0]}`
		);
		expect(res.rows.length).toEqual(0);
	});

	test("not found if no such logged exercise", async function () {
		try {
			await Loggedexercise.remove(0);
			fail();
		} catch (err) {
			expect(err instanceof NotFoundError).toBeTruthy();
		}
	});
});
