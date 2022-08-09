"use strict";

/** Shared congiguration for application. Can be required in many places */
require("dotenv").config();
require("colors");

const SECRET_KEY = process.env.SECRET_KEY || "secret-dev";

const PORT = +process.env.PORT || 3001;

const getDatabaseUri = () => {
	return process.env.NODE_ENV === "test"
		? "lightweight_test"
		: process.env.DATABASE_URL || "lightweight";
};

/**
 * Speed up bcrypt during tests, since we are not testing the safety of the algorithm
 */
const BCRYPT_WORK_FACTOR = process.env.NODE_ENV === "test" ? 1 : 12;

console.log("LIGHTWEIGHT CONFIGURATION:".cyan);
console.log("SECRET_KEY:".cyan, SECRET_KEY);
console.log("PORT:".cyan, PORT.toString());
console.log("BCRYPT_WORK_FACTOR".cyan, BCRYPT_WORK_FACTOR);
console.log("Database:".cyan, getDatabaseUri());
console.log("---");

module.exports = {
	SECRET_KEY,
	PORT,
	getDatabaseUri,
	BCRYPT_WORK_FACTOR,
};
