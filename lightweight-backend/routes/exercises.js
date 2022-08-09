"use strict";

/** Routes for exercises. */
const jsonschema = require("jsonschema");
const express = require("express");

const { BadRequestError } = require("../expressError");
const { ensureAdmin } = require("../middleware/auth");

const Exercise = require("../models/exercise");

const exerciseNewSchema = require("../schemas/exerciseNew.json");
const exerciseSearchSchema = require("../schemas/exerciseSearch.json");
const exerciseUpdateSchema = require("../schemas/exerciseUpdate.json");

const router = new express.Router();

/** POST / =>
 * { exercises: [ { name, bodyPart, equipment, gifUrl, target }, ...] }
 *
 * Can filter on provided filters
 * - name
 * - bodyPart
 * - equipment
 * - target
 *
 *  There are all case-insensitive and work on partial matches
 *
 *  Authorization: none
 */

router.post("/", ensureAdmin, async (req, res, next) => {
	try {
		const validate = jsonschema.validate(req.body, exerciseNewSchema);
		if (!validate.valid) {
			const errs = validate.errors.map((e) => e.stack);
			throw new BadRequestError(errs);
		}

		const exercise = await Exercise.create(req.body);
		return res.status(201).json({ exercise });
	} catch (error) {
		return next(error);
	}
});

/** GET / =>
 * { exercises: [ { name, bodyPart, equipment, gifUrl, target }] }
 *
 * can filter on provided searchFilters (all optional):
 * - name
 * - bodyPart
 * - equipment
 * - target
 *
 * Authorization required: none
 */

router.get("/", async (req, res, next) => {
	const q = req.query;

	try {
		const validate = jsonschema.validate(q, exerciseSearchSchema);
		if (!validate.valid) {
			const errs = validate.errors.map((e) => e.stack);
			throw new BadRequestError(errs);
		}

		const exercises = await Exercise.findAll(q);
		return res.json({ exercises });
	} catch (error) {
		return next(error);
	}
});

/** GET /[name] => { exercise }
 *
 * Exercise is { name, body_part, equipment, gif_url, target }
 *
 * Authorization required: none
 */

router.get("/:name", async (req, res, next) => {
	try {
		const exercise = await Exercise.get(req.params.name);
		return res.json({ exercise });
	} catch (error) {
		return next(error);
	}
});

/** PATCH /[name] { field1, field2, ... } =>  { exercise }
 *
 * Patches exercise data.
 *
 * field can be: {  name, body_part, equipment, gif_url, target }
 *
 * Returns { id, name, bodyPart, equipment, gifUrl, target }
 *
 * Authorization required: admin
 */

router.patch("/:name", ensureAdmin, async (req, res, next) => {
	try {
		const validator = jsonschema.validate(req.body, exerciseUpdateSchema);
		if (!validator.valid) {
			const errs = validator.errors.map((e) => e.stack);
			throw new BadRequestError(errs);
		}

		const exercise = await Exercise.update(req.params.name, req.body);
		return res.json({ exercise });
	} catch (error) {
		return next(error);
	}
});

/** DELETE /[name] => { deleted: name }
 *
 * Authorization: admin
 */

router.delete("/:name", ensureAdmin, async (req, res, next) => {
	try {
		await Exercise.remove(req.params.name);
		return res.json({ deleted: req.params.name });
	} catch (error) {
		return next(error);
	}
});

module.exports = router;
