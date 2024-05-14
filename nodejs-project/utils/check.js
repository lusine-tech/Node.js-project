const { getUsersCountByIdQuery } = require('../db-queries/getData');
const { getDB } = require('./db');

const validDatePattern = /^\d{4}-\d{2}-\d{2}$/;

const returnDateIfValid = (dateString) => {
    if (!validDatePattern.test(dateString)) {
        return false;
    }
    const date = new Date(dateString);
    return date instanceof Date && !isNaN(date) ? dateString : false;
};

const returnIntIfValid = (value) => {
    if (isNaN(value)) {
        return false;
    }
    const x = parseFloat(value);
    return (x | 0) === x ? value : false;
};

const doesUserExist = async (id) => {
    const db = await getDB();
    const userCount = await db.get(getUsersCountByIdQuery, id);
    return userCount?.count > 0;
};

module.exports = { returnDateIfValid, returnIntIfValid, doesUserExist };
