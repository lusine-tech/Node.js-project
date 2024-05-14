const getUsersCountQuery = `SELECT COUNT(id) as count FROM user where name=?`;

const getUserNameQuery = `SELECT name FROM user WHERE id=?`;

const getUsersQuery = `SELECT * FROM user`;

const getUserExercisesQuery = `SELECT description, duration, date(date) as date FROM exercise WHERE user_id=?`;

const getUserDataQuery = `SELECT id, name FROM user u WHERE u.id=?`;

const getUsersCountByIdQuery = `SELECT COUNT(id) as count FROM user where id=?`;

module.exports = {
    getUsersCountQuery,
    getUserNameQuery,
    getUsersQuery,
    getUserExercisesQuery,
    getUserDataQuery,
    getUsersCountByIdQuery,
};
