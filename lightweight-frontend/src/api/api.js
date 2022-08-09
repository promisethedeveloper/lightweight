import axios from "axios";

const BASE_URL = process.env.REACT_APP_BASE_URL || "http://localhost:3001";

/**
 * API Class
 *
 * Static class tying together methods used to get/send to the API.
 * There shouldn't be any frontend-specific stuff here, and there shouldn't
 * be any API-aware stuff elsewhere in the frontend.
 */

class LightWeightAPI {
	// The token for interacting with the API will be stored here.
	static token;

	static async request(endpoint, data = {}, method = "get") {
		// There are multiple ways to pass an authorization token, this is how you pass it in the header.
		const url = `${BASE_URL}/${endpoint}`;
		const headers = { Authorization: `Bearer ${LightWeightAPI.token}` };
		const params = method === "get" ? data : {};

		try {
			return (await axios({ url, method, data, params, headers })).data;
		} catch (error) {
			let message = error.response.data.error.message;
			throw Array.isArray(message) ? message : [message];
		}
	}

	/** Individual API routes. */

	/** Get the current user */
	static async getCurrentUser(username) {
		let res = await this.request(`users/${username}`);
		return res.user;
	}

	/** Get token for login from username and password */
	static async login(data) {
		let res = await this.request(`auth/token`, data, "post");
		return res.token;
	}

	/** Signup for site. */
	static async signup(data) {
		let res = await this.request(`auth/register`, data, "post");
		return res.token;
	}

	/** Save user profile page */
	static async saveProfile(username, data) {
		let res = await this.request(`users/${username}`, data, "patch");
		return res.user;
	}

	/************ WORKOUT ******************/
	/** Create a new workout */
	static async createWorkout(data) {
		let res = await this.request(`workouts/day`, data, "post");
		return res.workout;
	}

	/** Get User workouts */
	static async getWorkouts(username) {
		let res = await this.request(`workouts/${username}`);
		return res.workouts;
	}

	/** Edit a workout */
	static async editWorkout(day, data) {
		let res = await this.request(`workouts/${day}`, data, "patch");
		return res;
	}

	/** Delete a workout */
	static async deleteWorkout(day) {
		let res = await this.request(`workouts/${day}`, {}, "delete");
		return res;
	}

	/************ LOGGED EXERCISES ******************/
	static async logExercise(data) {
		let res = await this.request(`loggedexercises`, data, "post");
		return res.loggedexercise;
	}

	static async getloggedExercise(workout_Id) {
		let res = await this.request(`loggedexercises/${workout_Id}`);
		return res.loggedexercise;
	}

	static async editLoggedExercise(id, data) {
		let res = await this.request(`loggedexercises/${id}`, data, "patch");
		return res;
	}

	static async deleteLoggedExercise(id) {
		let res = await this.request(`loggedexercises/${id}`, {}, "delete");
		return res;
	}

	/** Get exercises (filtered by name if not undefined) */
	static async getExercises(name) {
		let res = await this.request("exercises", { name });
		return res.exercises;
	}

	/** Get details about a particular exercise */
	static async getExercise(name) {
		let res = await this.request(`exercises/${name}`);
		return res.exercise;
	}
}

export default LightWeightAPI;
