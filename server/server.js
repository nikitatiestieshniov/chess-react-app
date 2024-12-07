const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const { neo4jDriver } = require('./dbConfig');

const app = express();
const port = 3003;

app.use(cors());
app.use(express.json());

const dbPath = path.join(__dirname, '..', 'databases', 'lichess_puzzles.db');
const sqliteDb = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Ошибка подключения к SQLite:', err.message);
    } else {
        console.log('SQLite подключен.');
    }
});

sqliteDb.get('SELECT 1', (err) => {
    if (err) {
        console.error('Ошибка проверки SQLite:', err.message);
    } else {
        console.log('SQLite работает корректно.');
    }
});

setTimeout(async () => {
    const session = neo4jDriver.session();
    try {
        const result = await session.run('RETURN 1');
        console.log('Подключение к Neo4j установлено.');
    } catch (error) {
        console.error('Ошибка подключения к Neo4j:', error);
    } finally {
        await session.close();
    }
}, 5000);

app.get('/api/test', (req, res) => {
    res.json({ message: 'API работает корректно' });
});

app.get('/api/puzzles', (req, res) => {
    const { themes, minRating, maxRating } = req.query;

    const query = `
    SELECT * FROM lichess_puzzles
    WHERE (? IS NULL OR themes LIKE '%' || ? || '%')
    AND (? IS NULL OR rating >= ?)
    AND (? IS NULL OR rating <= ?)
    LIMIT 100
  `;
    const params = [themes || null, themes || null, minRating || null, minRating || null, maxRating || null, maxRating || null];

    sqliteDb.all(query, params, (err, rows) => {
        if (err) {
            console.error('Ошибка при запросе SQLite:', err.message);
            res.status(500).send('Ошибка при получении данных');
        } else {
            res.json(rows);
        }
    });
});

app.post('/api/next-moves', async (req, res) => {
    const { fen } = req.body;

    if (!fen) {
        return res.status(400).json({ error: 'Требуется позиция в FEN' });
    }

    const session = neo4jDriver.session();

    try {
        const result = await session.run(
            `
      MATCH (startPos:Position {fen: $fen})-[moveRel:MOVE]->(endPos)
      RETURN moveRel.san AS san, moveRel.games AS games,
             moveRel.whiteWins AS whiteWins, moveRel.blackWins AS blackWins,
             moveRel.draws AS draws
      ORDER BY moveRel.games DESC
      `,
            { fen }
        );

        const moves = result.records.map((record) => ({
            san: record.get('san'),
            games: record.get('games').toInt(),
            whiteWins: record.get('whiteWins').toInt(),
            blackWins: record.get('blackWins').toInt(),
            draws: record.get('draws').toInt(),
        }));

        res.json({ moves });
    } catch (error) {
        console.error('Ошибка при запросе Neo4j:', error);
        res.status(500).json({ error: 'Внутренняя ошибка сервера' });
    } finally {
        await session.close();
    }
});

app.listen(port, () => {
    console.log(`Сервер запущен на http://localhost:${port}`);
});
