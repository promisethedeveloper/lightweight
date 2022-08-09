"use strict";

const db = require("../db.js");
const { BadRequestError, NotFoundError } = require("../expressError");
const Workout = require("./workout");

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
	test("creates new workout", async function () {
		const newWorkout = {
			dayOfWeek: "Tuesday",
			description: "Leg day",
			user_id: dataIds.userId,
		};
		await Workout.create(newWorkout);
		const results = await db.query(
			`SELECT day_of_week, description 
                FROM workouts
				WHERE user_id = ${newWorkout.user_id}`
		);
		expect(results.rows).toEqual([
			{ day_of_week: "Monday", description: "Chest day" },
			{ day_of_week: "Tuesday", description: "Leg day" },
		]);
	});
});

/*** findAll ***/

describe("findAll", function () {
	test("works", async function () {
		let result = await Workout.findAll();
		expect(result).toEqual([{ dayOfWeek: "Monday", description: "Chest day" }]);
	});
});

/*** get ***/

describe("get", function () {
	test("works", async function () {
		let result = await Workout.get("u1");
		expect(result).toEqual([
			{
				id: dataIds.workoutId,
				username: "u1",
				dayOfWeek: "Monday",
				description: "Chest day",
			},
		]);
	});

	test("returns an empty array if username has no workout", async function () {
		const results = await Workout.get("u2");
		expect(results).toEqual([]);
	});
});

describe("update", function () {
	const updateData = {
		dayOfWeek: "Monday",
		description: "New description",
	};

	test("works", async function () {
		const workoutUpdate = await Workout.update("Monday", updateData);
		expect(workoutUpdate).toEqual({
			dayOfWeek: "Monday",
			description: "New description",
		});
	});

	test("returns not found if the day of week is not in the database", async function () {
		try {
			await Workout.update("Thursday", updateData);
			fail();
		} catch (err) {
			expect(err instanceof NotFoundError).toBeTruthy();
		}
	});

	test("bad request if no data", async function () {
		try {
			await Workout.update("Monday", {});
			fail();
		} catch (err) {
			expect(err instanceof BadRequestError).toBeTruthy();
		}
	});
});

/* remove */

describe("remove", function () {
	test("works", async function () {
		await Workout.remove("Monday");
		const res = await db.query(
			`SELECT * FROM workouts WHERE  day_of_week='Monday'`
		);
		expect(res.rows.length).toEqual(0);
	});

	test("not found if no such workout", async function () {
		try {
			await Workout.remove("Thursday");
			fail();
		} catch (err) {
			expect(err instanceof NotFoundError).toBeTruthy();
		}
	});
});
