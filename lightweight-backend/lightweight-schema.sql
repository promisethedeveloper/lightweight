DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS workouts CASCADE;
DROP TABLE IF EXISTS exercises CASCADE;
DROP TABLE IF EXISTS loggedExercises CASCADE;

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(25) UNIQUE,
    first_name text NOT NULL,
    last_name text NOT NULL,
    email text NOT NULL CHECK (position('@' IN email) > 1),
    password text NOT NULL,
    is_admin BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE TABLE workouts ( 
    id SERIAL PRIMARY KEY,
    day_of_week text NOT NULL,
    description text NOT NULL,
    user_id integer REFERENCES users ON DELETE CASCADE
);

CREATE TABLE exercises (
    id SERIAL PRIMARY KEY,
    name text NOT NULL,
    body_part text NOT NULL,
    equipment text NOT NULL,
    gif_url text NOT NULL,
    target text NOT NULL
);

CREATE TABLE loggedexercises (
    id SERIAL PRIMARY KEY,
    workout_id integer REFERENCES workouts ON DELETE CASCADE,
    exercise_id integer REFERENCES exercises ON DELETE CASCADE,
    weight integer NOT NULL,
    unit text NOT NULL,
    no_of_sets integer NOT NULL,
    no_of_reps integer NOT NULL
);
