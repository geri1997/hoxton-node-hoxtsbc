import Database from 'better-sqlite3';
import { createTransaction, createUser } from './dbUtils';
import { transactions, users } from './seedData';

const db = new Database('./data.db', {
    verbose: console.log,
});

db.exec(`
DROP TABLE IF EXISTS 'transaction';
DROP TABLE IF EXISTS 'user';


    CREATE TABLE IF NOT EXISTS user(
        id INTEGER PRIMARY KEY,
        fullName TEXT NOT NULL,
        email TEXT UNIQUE,
        password TEXT NOT NULL,
        amountInAccount REAL NOT NULL
    ); 
    
    CREATE TABLE IF NOT EXISTS 'transaction'(
        id INTEGER PRIMARY KEY,
        userId INTEGER,
        amount REAL NOT NULL,
        receiverOrSender TEXT,
        completedAt TEXT,
        isPositive Text,
        FOREIGN KEY (userId) REFERENCES user(id)
    );
`);

for (const user of users) {
    createUser(user.fullName, user.email, user.password, user.amountInAccount);
}
for (const transaction of transactions) {
    createTransaction(
        transaction.userId,
        transaction.amount,
        transaction.receiverOrSender,
        transaction.completedAt,
        transaction.isPositive
    );
}
