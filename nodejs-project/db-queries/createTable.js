const createUserTableQuery = `CREATE TABLE IF NOT EXISTS user(
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name VARCHAR(50) NOT NULL UNIQUE
            ) `;

const createExerciseTableQuery = `CREATE TABLE IF NOT EXISTS exercise(
            id INTEGER PRIMARY KEY AUTOINCREMENT, 
            user_id INTEGER NOT NULL REFERENCES user(id),
            description TEXT,
            duration INTEGER,
            date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
            )`;

module.exports = { createUserTableQuery, createExerciseTableQuery };
