const Database = require('better-sqlite3');
const path = require('path');

const db = new Database(path.join(__dirname, 'fridgorithm.db'), {
  verbose: console.log,
});

db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL
  )
`);

/**
 * Creates new user in the database
 *
 * @param {string} name
 * @param {string} email
 * @param {string} password
 * @returns {object} Result object containing:
 *   - lastInsertRowid: ID of the newly created user
 *   - changes: Number of rows affected (should be 1)
 * @throws Will throw an error if email already exists or parameters are invalid
 */
function addUser(name, email, password) {
  return db
    .prepare('INSERT INTO users (name, email, password) VALUES (?, ?, ?)')
    .run(name, email, password);
}

/**
 * Retrieves a user from the database by their email address
 *
 * @param {string} email - The email address to search for
 * @returns {object|undefined} User object containing id, name, email, password
 */
function getUserByEmail(email) {
  return db.prepare('SELECT * from users where email = ?').get(email);
}


module.exports = {
  db,
  addUser,
  getUserByEmail,
};
