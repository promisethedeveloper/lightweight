"use strict";

const request = require("supertest");
const User = require("../models/user");
const Workout = require("../models/workout");

const app = require("../app");

const {
	commonBeforeAll,
	commonBeforeEach,
	commonAfterEach,
	commonAfterAll,
	u1Token,
	u2Token,
	adminToken,
} = require("./_testCommon");

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

/*** POST /workouts/day ***/

describe("POST /workouts/day", function () {
	test("works for admins: create workout", async function () {
		const { id: userId } = await User.get("u1");
		const resp = await request(app)
			.post("/workouts/day")
			.send({
				dayOfWeek: "Thurday",
				description: "Chest day",
				user_id: userId,
			})
			.set("authorization", `Bearer ${adminToken}`);
		expect(resp.statusCode).toEqual(201);
		expect(resp.body).toEqual({
			workout: {
				day_of_week: "Thurday",
				description: "Chest day",
				user_id: expect.any(Number),
			},
		});
	});

	test("works for user: create workout", async function () {
		const { id: userId } = await User.get("u1");
		const resp = await request(app)
			.post("/workouts/day")
			.send({
				dayOfWeek: "Thurday",
				description: "Chest day",
				user_id: userId,
			})
			.set("authorization", `Bearer ${u1Token}`);
		expect(resp.statusCode).toEqual(201);
		expect(resp.body).toEqual({
			workout: {
				day_of_week: "Thurday",
				description: "Chest day",
				user_id: expect.any(Number),
			},
		});
	});

	test("unauth for anon", async function () {
		const { id: userId } = await User.get("u1");
		const resp = await request(app).post("/workouts/day").send({
			dayOfWeek: "Thurday",
			description: "Chest day",
			user_id: userId,
		});
		expect(resp.statusCode).toEqual(401);
	});

	test("bad request if missing data", async function () {
		const resp = await request(app)
			.post("/users")
			.send({
				description: "Chest day",
			})
			.set("authorization", `Bearer ${adminToken}`);
		expect(resp.statusCode).toEqual(400);
	});

	test("bad request if invalid data", async function () {
		const { id: userId } = await User.get("u1");
		const resp = await request(app)
			.post("/workouts/day")
			.send({
				dayOfWeek: "Thurday",
				description: 1,
				user_id: userId,
			})
			.set("authorization", `Bearer ${adminToken}`);
		expect(resp.statusCode).toEqual(400);
	});
});

/*** GET /workouts ***/

describe("GET /workouts", function () {
	test("works for admins", async function () {
		const resp = await request(app)
			.get("/workouts")
			.set("authorization", `Bearer ${adminToken}`);
		expect(resp.body).toEqual({
			workouts: [{ dayOfWeek: "Wednesday", description: "Cardio" }],
		});
	});

	test("works for user", async function () {
		const resp = await request(app)
			.get("/workouts")
			.set("authorization", `Bearer ${u1Token}`);
		expect(resp.body).toEqual({
			workouts: [{ dayOfWeek: "Wednesday", description: "Cardio" }],
		});
	});
});

// /*** GET /workouts/:username ***/

describe("GET /workouts/:username", function () {
	test("works for admin", async function () {
		const resp = await request(app)
			.get(`/workouts/u1`)
			.set("authorization", `Bearer ${adminToken}`);
		expect(resp.body).toEqual({
			workouts: [
				{
					id: expect.any(Number),
					username: "u1",
					dayOfWeek: "Wednesday",
					description: "Cardio",
				},
			],
		});
	});

	test("works for user", async function () {
		const resp = await request(app)
			.get(`/workouts/u1`)
			.set("authorization", `Bearer ${u1Token}`);
		expect(resp.body).toEqual({
			workouts: [
				{
					id: expect.any(Number),
					username: "u1",
					dayOfWeek: "Wednesday",
					description: "Cardio",
				},
			],
		});
	});

	test("unauth for anon", async function () {
		const resp = await request(app).get(`/workouts/u1`);
		expect(resp.statusCode).toEqual(401);
	});
});

// ***PATCH /workouts/day ***/

describe("PATCH /workouts/day", () => {
	test("works for admins", async function () {
		const { id: userId } = await User.get("u1");
		await Workout.create({
			dayOfWeek: "Friday",
			description: "Cardio",
			user_id: userId,
		});
		const resp = await request(app)
			.patch(`/workouts/Friday`)
			.send({
				description: "New description",
			})
			.set("authorization", `Bearer ${adminToken}`);
		expect(resp.body).toEqual({
			workout: { dayOfWeek: "Friday", description: "New description" },
		});
	});

	test("works for user", async function () {
		const { id: userId } = await User.get("u1");
		await Workout.create({
			dayOfWeek: "Friday",
			description: "Cardio",
			user_id: userId,
		});
		const resp = await request(app)
			.patch(`/workouts/Friday`)
			.send({
				description: "New description",
			})
			.set("authorization", `Bearer ${u1Token}`);
		expect(resp.body).toEqual({
			workout: { dayOfWeek: "Friday", description: "New description" },
		});
	});

	test("unauth for anon", async function () {
		const resp = await request(app).patch(`/workouts/Friday`).send({
			description: "New description",
		});
		expect(resp.statusCode).toEqual(401);
	});

	test("not found if the day is not in the database", async function () {
		const resp = await request(app)
			.patch(`/users/Monday`)
			.send({
				description: "New description",
			})
			.set("authorization", `Bearer ${adminToken}`);
		expect(resp.statusCode).toEqual(400);
	});

	test("bad request if invalid data", async function () {
		const resp = await request(app)
			.patch(`/users/Monday`)
			.send({
				description: 42,
			})
			.set("authorization", `Bearer ${adminToken}`);
		expect(resp.statusCode).toEqual(400);
	});
});
