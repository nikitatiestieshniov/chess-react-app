const path = require('path');
const sqlite3 = require('sqlite3').verbose();
const neo4j = require('neo4j-driver');

// SQLite
const dbPath = path.join(__dirname, '..', 'databases', 'lichess_puzzles.db');
const sqliteDb = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Ошибка подключения к SQLite:', err.message);
    } else {
        console.log('SQLite подключен.');
    }
});

// Neo4j
const neo4jDriver = neo4j.driver(
    'bolt://localhost:7687',
    neo4j.auth.basic('neo4j', 'ghvcjgvcgF5hvdhk') 
);

module.exports = { sqliteDb, neo4jDriver };
