// PuzzleList.js

import React from 'react';
import { t } from "../locales/localization";
function PuzzleList({ puzzles, onSelectPuzzle }) {
    return (
        <div>
            <h3>{t('listOfPuzzles')}</h3>
            <ul>
                {puzzles.map((puzzle, index) => (
                    <li key={puzzle.puzzle_id} onClick={() => onSelectPuzzle(index)}>
                        <strong>{t('themes')}:</strong> {puzzle.themes} <br />
                        <strong>{t('rating')}:</strong> {puzzle.rating} <br />
                        <strong>{t('FEN')}:</strong> {puzzle.fen}
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default PuzzleList;
