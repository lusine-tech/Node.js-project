const Database = require('sqlite-async');
const { createUserTableQuery, createExerciseTableQuery } = require('../db-queries/createTable');
const { getUsersCountQuery, getUserNameQuery, getUsersQuery, getUserExercisesQuery, getUserDataQuery } = require('../db-queries/getData');
const { insertUserQuery, insertExerciseQuery, insertExerciseWithoutDateQuery } = require('../db-queries/insertData');
const { DBNAME } = require('../const/db');

const getDB = () => Database.open(process.env.DBNAME || DBNAME);

const createDatabase = async () => {
    try {
        const db = await getDB();
        await db.exec(createUserTableQuery);
        await db.exec(createExerciseTableQuery);
    } catch (err) {
        console.error(err.message);
    }
};

const isUserUnique = async (name) => {
    const db = await getDB();
    const countDuplicateUsers = await db.get(getUsersCountQuery, name);
    return countDuplicateUsers?.count === 0;
};

const insertUser = async (name) => {
    const db = await getDB();
    return await db.get(insertUserQuery, name);
};

const insertExercise = async (id, description, duration, date) => {
    const db = await getDB();
    const userData = await db.get(getUserNameQuery, id);

    const exerciseData = date ? await db.get(insertExerciseQuery, [id, description, duration, date]) : await db.get(insertExerciseWithoutDateQuery, [id, description, duration]);

    return { _id: id, userName: userData.name, ...exerciseData };
};

const getUsers = async () => {
    const db = await getDB();
    return await db.all(getUsersQuery);
};

const getExercises = async (uId, from = null, to = null, limit = null) => {
    const db = await getDB();

    const userData = await db.get(getUserDataQuery, uId);

    if (!userData || !userData.id || !userData.name) {
        return;
    }
    const { id, name } = userData;

    let exerciseQuery = getUserExercisesQuery;
    let exerciseParams = [uId];

    if (from) {
        exerciseQuery += ` AND date(date) > date(?)`;
        exerciseParams.push(from);
    }
    if (to) {
        exerciseQuery += ` AND date(date) < date(?)`;
        exerciseParams.push(to);
    }
    if (limit) {
        exerciseQuery += ` LIMIT ?`;
        exerciseParams.push(limit);
    }

    const exerciseData = await db.all(exerciseQuery, exerciseParams);
    return { _id: id, name, exercises: [...exerciseData] };
};

module.exports = {
    createDatabase,
    insertUser,
    insertExercise,
    getUsers,
    getExercises,
    isUserUnique,
    getDB,
};
