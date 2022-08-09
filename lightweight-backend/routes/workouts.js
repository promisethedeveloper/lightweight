"use strict";

/** Routes for workouts. */

const jsonschema = require("jsonschema");
const express = require("express");

const { BadRequestError } = require("../expressError");
const { ensureLoggedIn } = require("../middleware/auth");
const workoutNewSchema = require("../schemas/workoutNewSchema.json");
const workoutUpdate = require("../schemas/workoutUpdate.json");

const Workout = require("../models/workout");

const router = new express.Router();

/** POST /day =>  { workout }
 *
 * workout should be { day_of_week, description, user_id }
 *
 * Returns { day_of_week, description, user_id  }
 *
 * Authorization required: ensureLoggedIn
 */

router.post("/day", ensureLoggedIn, async (req, res, next) => {
	try {
		const validate = jsonschema.validate(req.body, workoutNewSchema);
		if (!validate.valid) {
			const errs = validate.errors.map((e) => e.stack);
			throw new BadRequestError(errs);
		}

		const workout = await Workout.create(req.body);
		return res.status(201).json({ workout });
	} catch (error) {
		return next(error);
	}
});

/** GET /workouts =>
 * { workouts: [ { dayOfWeek, description }, ... ] }
 *
 * Authorization required: none
 */

router.get("/", async (req, res, next) => {
	try {
		const workouts = await Workout.findAll();
		return res.json({ workouts });
	} catch (error) {
		return next(error);
	}
});

/** GET /workouts/[username] => { workouts }
 *
 * Returns { username, dayOfWeek, description }
 *
 * Authorization required: ensureLoggedIn
 */

router.get("/:username", ensureLoggedIn, async (req, res, next) => {
	try {
		const workouts = await Workout.get(req.params.username);
		return res.json({ workouts });
	} catch (error) {
		return next(error);
	}
});

/** PATCH /workouts/day { field1, field2, ... } =>  { workout }
 *
 * Patches workout data.
 *
 * field can be: {  day_of_week, description }
 *
 * Returns { day_of_week, description }
 *
 * Authorization required: user
 */

router.patch("/:day", ensureLoggedIn, async (req, res, next) => {
	try {
		const validate = jsonschema.validate(req.body, workoutUpdate);
		if (!validate.valid) {
			const errs = validate.errors.map((e) => e.stack);
			throw new BadRequestError(errs);
		}

		const workout = await Workout.update(req.params.day, req.body);
		return res.json({ workout });
	} catch (error) {
		return next(error);
	}
});

/** DELETE /workouts/day => { deleted: day }
 *
 * Authorization required: user
 */

router.delete("/:day", ensureLoggedIn, async (req, res, next) => {
	try {
		await Workout.remove(req.params.day);
		return res.json({ deleted: req.params.day });
	} catch (error) {
		return next(error);
	}
});

module.exports = router;
