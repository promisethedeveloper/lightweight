"use strict";

/** Routes for loggedexercises. */

const jsonschema = require("jsonschema");
const express = require("express");

const { BadRequestError } = require("../expressError");
const { ensureLoggedIn } = require("../middleware/auth");
const loggedExercisesNewSchema = require("../schemas/loggedExerciseNew.json");
const loggedExercisesUpdate = require("../schemas/loggedExerciseUpdate.json");

const Loggedexercise = require("../models/loggedexercise");

const router = new express.Router();

/** POST / =>  { loggedexercise }
 *
 * loggedexercise should be { workout_id, exercise_id, weight, unit, no_of_sets, no_of_reps }
 *
 * Returns { workout_id, exercise_id, weight, unit, no_of_sets, no_of_reps }
 *
 * Authorization required: ensureLoggedIn
 */

router.post("/", ensureLoggedIn, async (req, res, next) => {
	try {
		const validate = jsonschema.validate(req.body, loggedExercisesNewSchema);
		if (!validate.valid) {
			const errs = validate.errors.map((e) => e.stack);
			throw new BadRequestError(errs);
		}

		const loggedexercise = await Loggedexercise.create(req.body);
		return res.status(201).json({ loggedexercise });
	} catch (error) {
		return next(error);
	}
});

router.get("/:workout_Id", ensureLoggedIn, async (req, res, next) => {
	try {
		const workout_Id = req.params.workout_Id;
		const loggedexercise = await Loggedexercise.get(workout_Id);
		return res.json({ loggedexercise });
	} catch (error) {
		return next(error);
	}
});

router.patch("/:id", ensureLoggedIn, async (req, res, next) => {
	try {
		const validate = jsonschema.validate(req.body, loggedExercisesUpdate);
		if (!validate.valid) {
			const errs = validate.errors.map((e) => e.stack);
			throw new BadRequestError(errs);
		}

		const loggedexercise = await Loggedexercise.update(req.params.id, req.body);
		return res.json({ loggedexercise });
	} catch (error) {
		return next(error);
	}
});

router.delete("/:id", ensureLoggedIn, async (req, res, next) => {
	try {
		const id = req.params.id;
		const loggedexercise = await Loggedexercise.remove(id);
		return res.json({ deleted: loggedexercise });
	} catch (error) {
		return next(error);
	}
});

module.exports = router;
