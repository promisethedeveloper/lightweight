"use strict";

/** Express app for lightweight */

const express = require("express");
const cors = require("cors");

const { NotFoundError } = require("./expressError");
const { authenticateJWT } = require("./middleware/auth");
const authRoutes = require("./routes/auth");
const exerciseRoutes = require("./routes/exercises");
const userRoutes = require("./routes/users");
const workoutRoutes = require("./routes/workouts");
const loggedExercises = require("./routes/loggedexercises");

const morgan = require("morgan");

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan("tiny"));
app.use(authenticateJWT);

app.use("/auth", authRoutes);
app.use("/exercises", exerciseRoutes);
app.use("/users", userRoutes);
app.use("/workouts", workoutRoutes);
app.use("/loggedexercises", loggedExercises);

/** Handle 404 errors  */
app.use((req, res, next) => {
	return next(new NotFoundError());
});

/** Generic error handler, any error not handle goes here */
app.use((err, req, res, next) => {
	if (process.env.NODE_ENV !== "test") {
		console.error(err.stack);
	}
	const status = err.status || 500;
	const message = err.message;

	return res.status(status).json({ error: { message, status } });
});

module.exports = app;
