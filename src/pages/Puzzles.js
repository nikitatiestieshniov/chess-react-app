import React, { useState, useEffect } from 'react';
import Game from '../components/game';
import PuzzleSearch from '../components/puzzleSearch';
import PuzzleList from '../components/PuzzleList';
import { t } from "../locales/localization";

function Puzzles() {
    const [puzzles, setPuzzles] = useState([]);
    const [currentPuzzleIndex, setCurrentPuzzleIndex] = useState(0);
    const [boardOrientation, setBoardOrientation] = useState('white');
    const [userRating, setUserRating] = useState(1500);
    const [ratingRange, setRatingRange] = useState(100);
    const [ratingChange, setRatingChange] = useState(0);

    
    const [solvedPuzzles, setSolvedPuzzles] = useState(() => {
        const storedSolved = localStorage.getItem('solvedPuzzles');
        return storedSolved ? JSON.parse(storedSolved) : [];
    });

    const updateUserRating = (puzzleRating, isSolved) => {
        const kFactor = 32;
        const expectedScore = 1 / (1 + Math.pow(10, (puzzleRating - userRating) / 400));
        const actualScore = isSolved ? 1 : 0;
        const ratingDelta = Math.round(kFactor * (actualScore - expectedScore));

        const newRating = userRating + ratingDelta;
        setRatingChange(ratingDelta);
        setUserRating(newRating);

        localStorage.setItem('userRating', newRating);

        console.log(`Puzzle rating: ${puzzleRating}, Solved: ${isSolved}, Rating change: ${ratingDelta}, New user rating: ${newRating}`);
    };

    useEffect(() => {
        const storedRating = localStorage.getItem('userRating');
        if (storedRating) {
            setUserRating(parseInt(storedRating, 10));
        } else {
            setUserRating(1500);
        }
    }, []);

    useEffect(() => {
        if (puzzles.length > 0 && currentPuzzleIndex < puzzles.length) {
            const currentPuzzle = puzzles[currentPuzzleIndex];
            const colorToMove = currentPuzzle.fen.split(' ')[1];
            setBoardOrientation(colorToMove === 'w' ? 'black' : 'white');
        }
    }, [puzzles, currentPuzzleIndex]);

    const handleSearch = async ({ themes, minRating, maxRating }) => {
        try {
            const query = new URLSearchParams({
                themes: themes || '',
                minRating: minRating || userRating - ratingRange,
                maxRating: maxRating || userRating + ratingRange,
            });

            const response = await fetch(`http://localhost:3003/api/puzzles?${query}`);
            if (!response.ok) {
                throw new Error(`Error: ${response.status}`);
            }
            const data = await response.json();

            const filteredPuzzles = data.filter((puzzle) => !solvedPuzzles.includes(puzzle.puzzle_id));
            setPuzzles(filteredPuzzles);

            if (filteredPuzzles.length > 0) {
                setCurrentPuzzleIndex(0);
            } else {
                alert(t('noPuzzlesFound'));
            }

            console.log('Loaded puzzles:', data);
            console.log('Solved puzzles:', solvedPuzzles);
            console.log('Filtered puzzles:', filteredPuzzles);
        } catch (error) {
            console.error('Error loading puzzles:', error);
        }
    };

    const handleNextPuzzle = () => {
        const nextIndex = currentPuzzleIndex + 1;
        if (nextIndex < puzzles.length) {
            setCurrentPuzzleIndex(nextIndex);
        } else {
            alert(t('lastPuzzleInList'));
        }
    };

    const handlePuzzleResult = (isSolved) => {
        const currentPuzzle = puzzles[currentPuzzleIndex];
        if (currentPuzzle) {
            updateUserRating(currentPuzzle.rating, isSolved);

            if (isSolved) {
                const updatedSolvedPuzzles = [...solvedPuzzles, currentPuzzle.puzzle_id];
                setSolvedPuzzles(updatedSolvedPuzzles);
                localStorage.setItem('solvedPuzzles', JSON.stringify(updatedSolvedPuzzles));

                console.log('Adding solved puzzle ID:', currentPuzzle.puzzle_id);
                console.log('Updated solved puzzles:', updatedSolvedPuzzles);
            }
        }
    };

    const currentPuzzle = puzzles[currentPuzzleIndex];

    return (
        <div>
            <h2>{t('puzzleSolving')}</h2>
            <p>
                {t('userRating')}: {userRating - ratingChange}{' '}
                <span
                    style={{
                        color: ratingChange > 0 ? 'green' : ratingChange < 0 ? 'red' : 'black',
                        fontWeight: 'bold',
                    }}
                >
                    {ratingChange >= 0 ? `(+${ratingChange})` : `(${ratingChange})`}
                </span>
            </p>
            <PuzzleSearch
                onSearch={handleSearch}
                userRating={userRating}
                ratingRange={ratingRange}
                setRatingRange={setRatingRange}
            />
            <button onClick={handleNextPuzzle}>{t('nextPuzzle')}</button>
            {currentPuzzle && (
                <Game
                    showMoveTree={false}
                    showPgnControls={false}
                    initialFen={currentPuzzle.fen}
                    solutionMoves={currentPuzzle.moves}
                    isPuzzleMode={true}
                    boardOrientation={boardOrientation}
                    onPuzzleResult={handlePuzzleResult}
                />
            )}
            <PuzzleList
                puzzles={puzzles}
                onSelectPuzzle={(puzzleIndex) => {
                    setCurrentPuzzleIndex(puzzleIndex);
                }}
            />
        </div>
    );
}

export default Puzzles;
