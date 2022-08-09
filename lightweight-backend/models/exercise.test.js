"use strict";

const db = require("../db.js");
const { BadRequestError, NotFoundError } = require("../expressError");
const Exercise = require("./exercise.js");
const {
	commonBeforeAll,
	commonBeforeEach,
	commonAfterEach,
	commonAfterAll,
} = require("./_testCommon");

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

/*** create ***/

describe("create", function () {
	const newExercise = {
		name: "New",
		bodyPart: "New bodypart",
		equipment: "New equipment",
		gifUrl: "http://newGif.img",
		target: "New target",
	};

	test("creates new exercise", async function () {
		let exercise = await Exercise.create(newExercise);
		expect(exercise).toEqual(newExercise);
		const result = await db.query(
			`SELECT name, body_part AS "bodyPart",
				equipment, gif_url AS "gifUrl", target
				FROM exercises
				WHERE name = 'New'`
		);
		expect(result.rows[0]).toEqual(newExercise);
	});

	test("bad request with duplicate data", async function () {
		try {
			await Exercise.create(newExercise);
			await Exercise.create(newExercise);
			fail();
		} catch (err) {
			expect(err instanceof BadRequestError).toBeTruthy();
		}
	});
});

/*** findAll ***/

describe("findAll", function () {
	test("works: all", async function () {
		let exercises = await Exercise.findAll();
		exercises = exercises.map((e) => {
			let { id, ...rest } = e;
			return rest;
		});
		expect(exercises).toEqual([
			{
				name: "Dumbbell bench press",
				bodyPart: "chest",
				equipment: "dumbbell",
				gifUrl: "http://d205bpvrqc9yn1.cloudfront.net/0289.gif",
				target: "pectorals",
			},
			{
				name: "Incline dumbbell bench press",
				bodyPart: "chest",
				equipment: "dumbbell",
				gifUrl: "http://d205bpvrqc9yn1.cloudfront.net/0314.gif",
				target: "pectorals",
			},
		]);
	});

	test("works: when you search by name", async function () {
		let exercises = await Exercise.findAll({ name: "Dumbbell bench press" });
		exercises = exercises.map((e) => {
			let { id, ...rest } = e;
			return rest;
		});

		expect(exercises).toEqual([
			{
				name: "Dumbbell bench press",
				bodyPart: "chest",
				equipment: "dumbbell",
				gifUrl: "http://d205bpvrqc9yn1.cloudfront.net/0289.gif",
				target: "pectorals",
			},
			{
				name: "Incline dumbbell bench press",
				bodyPart: "chest",
				equipment: "dumbbell",
				gifUrl: "http://d205bpvrqc9yn1.cloudfront.net/0314.gif",
				target: "pectorals",
			},
		]);
	});

	test("works: when you search by bodyPart", async function () {
		let exercises = await Exercise.findAll({ bodyPart: "chest" });
		exercises = exercises.map((e) => {
			let { id, ...rest } = e;
			return rest;
		});

		expect(exercises).toEqual([
			{
				name: "Dumbbell bench press",
				bodyPart: "chest",
				equipment: "dumbbell",
				gifUrl: "http://d205bpvrqc9yn1.cloudfront.net/0289.gif",
				target: "pectorals",
			},
			{
				name: "Incline dumbbell bench press",
				bodyPart: "chest",
				equipment: "dumbbell",
				gifUrl: "http://d205bpvrqc9yn1.cloudfront.net/0314.gif",
				target: "pectorals",
			},
		]);
	});

	test("works: when you search by equipment", async function () {
		let exercises = await Exercise.findAll({ equipment: "dumbbell" });
		exercises = exercises.map((e) => {
			let { id, ...rest } = e;
			return rest;
		});

		expect(exercises).toEqual([
			{
				name: "Dumbbell bench press",
				bodyPart: "chest",
				equipment: "dumbbell",
				gifUrl: "http://d205bpvrqc9yn1.cloudfront.net/0289.gif",
				target: "pectorals",
			},
			{
				name: "Incline dumbbell bench press",
				bodyPart: "chest",
				equipment: "dumbbell",
				gifUrl: "http://d205bpvrqc9yn1.cloudfront.net/0314.gif",
				target: "pectorals",
			},
		]);
	});
	test("works: when you search by target muscle", async function () {
		let exercises = await Exercise.findAll({ target: "pectorals" });
		exercises = exercises.map((e) => {
			let { id, ...rest } = e;
			return rest;
		});

		expect(exercises).toEqual([
			{
				name: "Dumbbell bench press",
				bodyPart: "chest",
				equipment: "dumbbell",
				gifUrl: "http://d205bpvrqc9yn1.cloudfront.net/0289.gif",
				target: "pectorals",
			},
			{
				name: "Incline dumbbell bench press",
				bodyPart: "chest",
				equipment: "dumbbell",
				gifUrl: "http://d205bpvrqc9yn1.cloudfront.net/0314.gif",
				target: "pectorals",
			},
		]);
	});

	test("works: empty list on nothing found", async function () {
		let exercises = await Exercise.findAll({ name: "nope" });
		expect(exercises).toEqual([]);
	});
});

/* get */

describe("get", function () {
	test("works", async function () {
		let exercise = await Exercise.get("Dumbbell bench press");
		let { id, ...rest } = exercise;
		expect(rest).toEqual({
			name: "Dumbbell bench press",
			bodyPart: "chest",
			equipment: "dumbbell",
			gifUrl: "http://d205bpvrqc9yn1.cloudfront.net/0289.gif",
			target: "pectorals",
		});
	});
	test("not found if no such exercise with that name", async function () {
		try {
			await Exercise.get("nope");
			fail();
		} catch (err) {
			expect(err instanceof NotFoundError).toBeTruthy();
		}
	});
});

/* update */

describe("update", function () {
	const updateData = {
		name: "Dumbbell bench press",
		bodyPart: "Lower chest",
		equipment: "Dumbbell",
		gifUrl: "http://d205bpvrqc9yn1.cloudfront.net/0041.gif",
		target: "pectoral",
	};

	test("works", async function () {
		let exercise = await Exercise.update("Dumbbell bench press", updateData);
		let { id, ...rest } = exercise;
		expect(rest).toEqual({
			...updateData,
		});

		const result = await db.query(
			`SELECT name, body_part AS "bodyPart", equipment, gif_url AS "gifUrl", target
		   FROM exercises
		   WHERE name = 'Dumbbell bench press'`
		);
		expect(result.rows).toEqual([
			{
				name: "Dumbbell bench press",
				bodyPart: "Lower chest",
				equipment: "Dumbbell",
				gifUrl: "http://d205bpvrqc9yn1.cloudfront.net/0041.gif",
				target: "pectoral",
			},
		]);
	});

	test("not found if no such exercise", async function () {
		try {
			await Exercise.update("nope", updateData);
			fail();
		} catch (err) {
			expect(err instanceof NotFoundError).toBeTruthy();
		}
	});

	test("bad request with no data", async function () {
		try {
			await Exercise.update("Dumbbell bench press", {});
			fail();
		} catch (err) {
			expect(err instanceof BadRequestError).toBeTruthy();
		}
	});
});

/* remove */

describe("remove", function () {
	test("works", async function () {
		await Exercise.remove("Dumbbell bench press");
		const res = await db.query(
			"SELECT name FROM exercises WHERE name='Dumbbell bench press'"
		);
		expect(res.rows.length).toEqual(0);
	});

	test("not found if no such Exercise", async function () {
		try {
			await Exercise.remove("nope");
			fail();
		} catch (err) {
			expect(err instanceof NotFoundError).toBeTruthy();
		}
	});
});
