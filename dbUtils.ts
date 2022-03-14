import Database from 'better-sqlite3';
import { transactions, users } from './seedData';

const db = new Database('./data.db', {
    verbose: console.log,
});

export function createTransaction(
    userId: number | bigint,
    amount: number | bigint,
    receiverOrSender: string,
    completedAt: string,
    isPositive: string
) {
    return db
        .prepare(
            `INSERT INTO 'transaction' (userId,amount,receiverOrSender,completedAt,isPositive) VALUES (?,?,?,?,?)`
        )
        .run(userId, amount, receiverOrSender, completedAt, isPositive);
}
export function createUser(
    name: string,
    email: string,
    password: string,
    amount: number
) {
    return db
        .prepare(
            `INSERT INTO user (fullName,email,password,amountInAccount) VALUES (?,?,?,?)`
        )
        .run(name, email, password, amount);
}

export function getUserByX(
    column: string,
    value: string | number | bigint
): {
    id: number;
    fullName: string;
    email: string;
    password: string;
    amountInAccount: number;
    transactions?:any[]
} {
    return db.prepare(`SELECT * FROM user WHERE ${column}=?`).get(value);
}

export function getTransactionsByUserId(userId: number): {
    userId: number | bigint;
    amount: number | bigint;
    receiverOrSender: string;
    completedAt: string;
    isPositive: string;
}[] {
    return db.prepare(`SELECT * FROM 'transaction' WHERE userId=?`).all(userId);
}
