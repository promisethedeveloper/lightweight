import React from "react";
import { Switch, Route, Redirect } from "react-router-dom";
import Homepage from "../homepage/Homepage";
import LoginForm from "../auth/LoginForm";
import ProfileForm from "../profiles/ProfileForm";
import SignupForm from "../auth/SignupForm";
import PrivateRoute from "./PrivateRoute";
import WorkoutList from "../workouts/WorkoutList";
import WorkoutForm from "../workouts/WorkoutForm";
import ExerciseList from "../exercises/ExerciseList";
import LogExerciseForm from "../logExercise/LogExerciseForm.js";
import LoggedExerciseEditForm from "../logExercise/LoggedExerciseEditForm";
import ExerciseView from "../exercises/ExerciseView";
import WorkoutEditForm from "../workouts/WorkoutEditForm";

const Routes = ({ login, signup }) => {
	return (
		<div className="pt-5">
			<Switch>
				<Route exact path="/">
					<Homepage />
				</Route>

				<Route exact path="/login">
					]
					<LoginForm login={login} />
				</Route>

				<Route exact path="/signup">
					<SignupForm signup={signup} />
				</Route>

				<PrivateRoute path="/profile">
					<ProfileForm />
				</PrivateRoute>

				<PrivateRoute exact path="/workouts">
					<WorkoutList />
				</PrivateRoute>

				<PrivateRoute exact path="/workouts/day">
					<WorkoutForm />
				</PrivateRoute>

				<PrivateRoute exact path="/exercises/:workout_Id">
					<ExerciseList />
				</PrivateRoute>

				<PrivateRoute exact path="/exercise/:name">
					<ExerciseView />
				</PrivateRoute>

				<PrivateRoute exact path="/exercises/:workout_Id/:exercise_Id/:name">
					<LogExerciseForm />
				</PrivateRoute>

				<PrivateRoute exact path="/workouts/edit/:day/:description">
					<WorkoutEditForm />
				</PrivateRoute>

				<PrivateRoute
					exact
					path="/workouts/edit/:id/:weight/:unit/:no_of_sets/:no_of_reps"
				>
					<LoggedExerciseEditForm />
				</PrivateRoute>

				<Redirect to="/" />
			</Switch>
		</div>
	);
};

export default Routes;
