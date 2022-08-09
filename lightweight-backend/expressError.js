/**
 * ExpressError extend the normal JS errors so we can
 * add a status when we make an instance of it
 *
 * This will be returned by the error handling middleware.
 */

class ExpressError extends Error {
	constructor(message, status) {
		super();
		this.message = message;
		this.status = status;
	}
}

/** 404 NOT FOUND error. */

class NotFoundError extends ExpressError {
	constructor(message = "Not Found") {
		super(message, 404);
	}
}

/** 401 UNAUTHORIZED error. */

class UnauthorizedError extends ExpressError {
	constructor(message = "Unauthorized") {
		super(message, 401);
	}
}

/** 400 bad request error. */

class BadRequestError extends ExpressError {
	constructor(message = "Bad Request") {
		super(message, 400);
	}
}

/** 403 bad request error */
class ForbiddenError extends ExpressError {
	constructor(message = "Forbidden") {
		super(message, 403);
	}
}

module.exports = {
	ExpressError,
	NotFoundError,
	UnauthorizedError,
	BadRequestError,
	ForbiddenError,
};
