const express = require('express');
const app = express();
const cors = require('cors');
const { createDatabase, insertUser, getUsers, insertExercise, getExercises, isUserUnique } = require('./utils/db');
const { returnDateIfValid, returnIntIfValid, doesUserExist } = require('./utils/check');

require('dotenv').config();

app.use(cors());
app.use(express.static('public'));
app.use(express.json());

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/views/index.html');
});

app.get('/api/users', async (req, res) => {
    try {
        const result = await getUsers();
        res.status(200).json(result.map(({ id, name }) => ({ _id: id, userName: name })));
    } catch (err) {
        console.log(err);
        res.statusMessage = `Couldn't get users. Please try again later`;
        res.sendStatus(500);
    }
});

app.get('/api/users/:_id/logs', async (req, res) => {
    try {
        const {
            params: { _id },
            query: { from, to, limit },
        } = req;

        if (!(await doesUserExist(_id))) {
            res.statusMessage = `User does not exist`;
            res.sendStatus(500);
            return;
        }

        const result = await getExercises(_id, returnDateIfValid(from), returnDateIfValid(to), returnIntIfValid(limit));

        res.status(200).json(result);
    } catch (err) {
        console.log(err);
        res.statusMessage = `Couldn't get exercise logs. Please try again later`;
        res.sendStatus(500);
    }
});

app.post('/api/users', async (req, res) => {
    try {
        const { userName } = req.body;

        if (!userName) {
            res.statusMessage = `Username is empty`;
            res.sendStatus(500);
            return;
        }

        if (!(await isUserUnique(userName))) {
            res.statusMessage = `This user already exists`;
            res.sendStatus(500);
            return;
        }

        const result = await insertUser(userName);
        res.status(200).json({ userName: result.name, _id: result.id });
    } catch (err) {
        console.log(err);
        res.statusMessage = `Couldn't add user. Please try again later`;
        res.sendStatus(500);
    }
});

app.post('/api/users/:_id/exercises', async (req, res) => {
    try {
        const {
            body: { description, duration, date },
            params: { _id },
        } = req;

        if (!(await doesUserExist(_id))) {
            res.statusMessage = `User does not exist`;
            res.sendStatus(500);
            return;
        }

        if (description && returnIntIfValid(duration)) {
            const result = await insertExercise(_id, description, duration, returnDateIfValid(date));
            res.status(200).json(result);
            return;
        }

        res.statusMessage = 'Data is not valid';
        res.sendStatus(500);
    } catch (err) {
        console.log(err);
        res.statusMessage = `Couldn't add exercise. Please try again later`;
        res.sendStatus(500);
    }
});

const listener = app.listen(process.env.PORT || 3000, () => {
    console.log('Your app is listening on port ' + listener.address().port);
    createDatabase();
});
