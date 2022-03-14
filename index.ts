import express from 'express';
import cors from 'cors';
import {
    createTransaction,
    createUser,
    getTransactionsByUserId,
    getUserByX,
} from './dbUtils';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
// import 'dotenv/config'
//ose perdor kyt import siper qe asht komented ose perdor `${process.env.SECRET}` se nuk e njef variable ndryshe. thet you must need a secretOrPrivateKey

const saltRounds = 10;

const app = express();
app.use(cors());
app.use(express.json());

app.post(`/register`, (req, res) => {
    // try {
    const { name, email, password } = req.body;
    let amount = +(Math.random() * 1000).toFixed(2);
    const hash = bcrypt.hashSync(password, saltRounds);
    const result = createUser(name, email, hash, amount);
    createTransaction(
        result.lastInsertRowid,
        +(Math.random() * 100).toFixed(2),
        'receiver',
        '03/14/2022',
        'true'
    );
    createTransaction(
        result.lastInsertRowid,
        +(Math.random() * 100).toFixed(2),
        'receiver',
        '03/14/2022',
        'true'
    );
    createTransaction(
        result.lastInsertRowid,
        +(Math.random() * 100).toFixed(2),
        'receiver',
        '03/14/2022',
        'true'
    );

    const userToSend = getUserByX('id', result.lastInsertRowid);
    const transactions = getTransactionsByUserId(userToSend.id);
    userToSend.transactions = transactions;
    //@ts-ignore
    const token = jwt.sign(
        { id: result.lastInsertRowid },
        `${process.env.SECRET}`,
        { expiresIn: '5m' }
    );

    res.send({ userToSend, token });
    // } catch (error) {
    //     res.status(400).send({ error });
    // }
});

app.post('/login', (req, res) => {
    const { email, password } = req.body;
    try {
        const user = getUserByX('email', email);
        const isPassMatch = bcrypt.compareSync(password, user.password);
        const transactions = getTransactionsByUserId(user.id);
        user.transactions = transactions;
        //@ts-ignore
        const token = jwt.sign({ id: user.id }, `${process.env.SECRET}`, {
            expiresIn: '5m',
        });
        isPassMatch
            ? res.send({ user, token })
            : res.status(404).send({ error: `Wrong email/assword` });
    } catch (error) {
        res.status(400).send({ error: `Wrong email/assword` });
    }
});

app.post('/banking-info', (req, res) => {
    const { token } = req.body;
    try {
        const decodedData = jwt.verify(token, `${process.env.SECRET}`);
        //@ts-ignore
        const user = getUserByX('id', decodedData.id);
        user.transactions = getTransactionsByUserId(user.id);
        res.send(user);
    } catch (error) {
        res.send(error);
    }
});

app.listen(3009, () => {
    console.log(`Server started on http://localhost:3009`);
});
