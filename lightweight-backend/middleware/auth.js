"use strict";

/** Convenience middleware to handle common auth cases in routes */

const jwt = require("jsonwebtoken");
const { SECRET_KEY } = require("../config");
const { UnauthorizedError } = require("../expressError");

/**
 * Middleware: Authenticater User.
 *
 * If a token is provided, verify it, and if the token is valid,
 * store the token payload on res.locals (this will include the firstname and isAdmin field)
 *
 * It is not an error if a token is not provided or if the token is not valid
 */

const authenticateJWT = (req, res, next) => {
	try {
		const authHeader = req.headers && req.headers.authorization;
		if (authHeader) {
			const token = authHeader.replace(/^[Bb]earer /, "").trim();
			res.locals.user = jwt.verify(token, SECRET_KEY);
		}
		return next();
	} catch (error) {
		return next();
	}
};

/**
 * Middleware to use where User must be logged in
 */

const ensureLoggedIn = (req, res, next) => {
	try {
		if (!res.locals.user) {
			throw new UnauthorizedError();
		}
		return next();
	} catch (error) {
		return next(error);
	}
};

/**
 * Middleware to ensure that the logged in User is an admin
 */
const ensureAdmin = (req, res, next) => {
	try {
		if (!res.locals.user || !res.locals.user.isAdmin) {
			throw new UnauthorizedError();
		}
		return next();
	} catch (error) {
		return next(error);
	}
};

/**
 * Middleware to use when the User must provide a valid token
 * and be the User whose username matches the username provided by the params variable
 *
 * if not, raise an Unathorized error
 */

const ensureCorrectUserOrAdmin = (req, res, next) => {
	try {
		const user = res.locals.user;
		if (!(user && (user.isAdmin || user.username === req.params.username))) {
			throw new UnauthorizedError();
		}
		return next();
	} catch (error) {
		return next(error);
	}
};

module.exports = {
	authenticateJWT,
	ensureLoggedIn,
	ensureAdmin,
	ensureCorrectUserOrAdmin,
};
