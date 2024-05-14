const insertUserQuery = `INSERT INTO user(name) VALUES (?) RETURNING id, name`;

const insertExerciseWithoutDateQuery = `INSERT INTO exercise(user_id, description, duration) VALUES (?, ?, ?) RETURNING description, duration, DATE(date) as date`;

const insertExerciseQuery = `INSERT INTO exercise(user_id, description, duration, date) VALUES (?, ?, ?, ?) RETURNING description, duration, DATE(date) as date`;

module.exports = { insertUserQuery, insertExerciseWithoutDateQuery, insertExerciseQuery };
