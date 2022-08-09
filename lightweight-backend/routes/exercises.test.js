"use strict";

const request = require("supertest");

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

/*** POST /exercises ***/
describe("POST /exercises", function () {
	const newExercise = {
		name: "Cable close grip curl",
		bodyPart: "upper arms",
		equipment: "cable",
		gifUrl: "http://d205bpvrqc9yn1.cloudfront.net/1630.gif",
		target: "biceps",
	};

	test("ok for admin", async function () {
		const resp = await request(app)
			.post("/exercises")
			.send(newExercise)
			.set("authorization", `Bearer ${adminToken}`);
		expect(resp.statusCode).toEqual(201);
		expect(resp.body).toEqual({
			exercise: newExercise,
		});
	});

	test("unauth for non-admin", async function () {
		const resp = await request(app)
			.post("/exercises")
			.send(newExercise)
			.set("authorization", `Bearer ${u1Token}`);
		expect(resp.statusCode).toEqual(401);
	});

	test("bad request with missing data", async function () {
		const resp = await request(app)
			.post("/exercises")
			.send({
				name: "new Exercise",
				bodyPart: "upper arms",
			})
			.set("authorization", `Bearer ${adminToken}`);
		expect(resp.statusCode).toEqual(400);
	});

	test("bad request with invalid data", async function () {
		const resp = await request(app)
			.post("/exercises")
			.send({
				...newExercise,
				gifUrl: 1,
			})
			.set("authorization", `Bearer ${adminToken}`);
		expect(resp.statusCode).toEqual(400);
	});
});

/*** GET /exercises ***/

describe("GET /exercises", function () {
	test("ok for anon", async function () {
		const resp = await request(app).get("/exercises");
		expect(resp.body).toEqual({
			exercises: [
				{
					id: expect.any(Number),
					name: "Barbell deadlift",
					bodyPart: "upper legs",
					equipment: "barbell",
					gifUrl: "http://d205bpvrqc9yn1.cloudfront.net/0032.gif",
					target: "glutes",
				},
				{
					id: expect.any(Number),
					name: "Dumbbell lateral raise",
					bodyPart: "shoulders",
					equipment: "barbell",
					gifUrl: "http://d205bpvrqc9yn1.cloudfront.net/0334.gif",
					target: "delts",
				},
			],
		});
	});
});

/*** GET /exercises/:name ***/

describe("GET /exercises/:name", function () {
	test("ok for anon", async function () {
		const resp = await request(app).get("/exercises/Barbell deadlift");
		expect(resp.body).toEqual({
			exercise: {
				id: expect.any(Number),
				name: "Barbell deadlift",
				bodyPart: "upper legs",
				equipment: "barbell",
				gifUrl: "http://d205bpvrqc9yn1.cloudfront.net/0032.gif",
				target: "glutes",
			},
		});
	});

	test("not found for no such exercise", async function () {
		const resp = await request(app).get(`/exercise/nope`);
		expect(resp.statusCode).toEqual(404);
	});
});

/*** PATCH  /exercises/:name */

describe("PATCH /exercises/:name", function () {
	test("works for admin", async function () {
		const resp = await request(app)
			.patch(`/exercises/Barbell deadlift`)
			.send({
				name: "Sumo squat",
			})
			.set("authorization", `Bearer ${adminToken}`);
		expect(resp.body).toEqual({
			exercise: {
				id: expect.any(Number),
				name: "Sumo squat",
				bodyPart: "upper legs",
				equipment: "barbell",
				gifUrl: "http://d205bpvrqc9yn1.cloudfront.net/0032.gif",
				target: "glutes",
			},
		});
	});

	test("unauth for non-admin", async function () {
		const resp = await request(app)
			.patch(`/exercises/Barbell deadlift`)
			.send({
				name: "Military press",
			})
			.set("authorization", `Bearer ${u1Token}`);
		expect(resp.statusCode).toEqual(401);
	});

	test("unauth for anon", async function () {
		const resp = await request(app).patch(`/exercises/Barbell deadlift`).send({
			name: "Lateral raise",
		});
		expect(resp.statusCode).toEqual(401);
	});

	test("not found if no such exercise", async function () {
		const resp = await request(app)
			.patch(`/exercises/nope`)
			.send({
				name: "new nope",
			})
			.set("authorization", `Bearer ${adminToken}`);
		expect(resp.statusCode).toEqual(404);
	});

	test("bad request on invalid data", async function () {
		const resp = await request(app)
			.patch(`/exercises/c1`)
			.send({
				name: 1,
			})
			.set("authorization", `Bearer ${adminToken}`);
		expect(resp.statusCode).toEqual(400);
	});
});

/*** DELETE /companies/:name ***/

describe("DELETE /exercises/:name", function () {
	test("works for admin", async function () {
		const resp = await request(app)
			.delete(`/exercises/Barbell deadlift`)
			.set("authorization", `Bearer ${adminToken}`);
		expect(resp.body).toEqual({ deleted: "Barbell deadlift" });
	});

	test("unauth for non-admin", async function () {
		const resp = await request(app)
			.delete(`/exercises/Barbell deadlift`)
			.set("authorization", `Bearer ${u1Token}`);
		expect(resp.statusCode).toEqual(401);
	});

	test("unauth for anon", async function () {
		const resp = await request(app).delete(`/exercises/Barbell deadlift`);
		expect(resp.statusCode).toEqual(401);
	});

	test("not found for no such exercise", async function () {
		const resp = await request(app)
			.delete(`/exercises/nope`)
			.set("authorization", `Bearer ${adminToken}`);
		expect(resp.statusCode).toEqual(404);
	});
});
