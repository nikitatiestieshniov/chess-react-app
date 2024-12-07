const pool = require('./dbConfig');


async function getAllPuzzles() {
    const res = await pool.query('SELECT * FROM public.puzzles'); 
    return res.rows;
}


async function addPuzzle(puzzle) {
    const { puzzle_id, fen, moves, rating, rating_deviation, popularity, nb_plays, themes, game_url, opening_tags } = puzzle;
    await pool.query(
        'INSERT INTO public.puzzles (puzzle_id, fen, moves, rating, rating_deviation, popularity, nb_plays, themes, game_url, opening_tags) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)',
        [puzzle_id, fen, moves, rating, rating_deviation, popularity, nb_plays, themes, game_url, opening_tags]
    );
}

module.exports = { getAllPuzzles, addPuzzle };
