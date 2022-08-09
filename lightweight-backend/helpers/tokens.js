const jwt = require("jsonwebtoken");
const { SECRET_KEY } = require("../config");

const createToken = (user) => {
	let payload = {
		username: user.username,
		isAdmin: user.isAdmin || false,
	};

	const token = jwt.sign(payload, SECRET_KEY);

	return token;
};

module.exports = { createToken };
