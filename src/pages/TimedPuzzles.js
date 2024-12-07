// Τΰιλ: TimedPuzzles.js

import React, { useState, useContext } from 'react';
import Game from '../components/game';
import { t } from "../locales/localization";
import { SettingsContext } from '../components/SettingsContext';

function TimedPuzzles() {
    const [timeLimit, setTimeLimit] = useState(180); 
    const [timeLeft, setTimeLeft] = useState(180);
    const [puzzlePool, setPuzzlePool] = useState([]);
    const [currentPuzzleIndex, setCurrentPuzzleIndex] = useState(0);
    const [mistakes, setMistakes] = useState(0);
    const [solvedCount, setSolvedCount] = useState(0);
    const [isStarted, setIsStarted] = useState(false);
    const [isCountdown, setIsCountdown] = useState(false);
    const [countdown, setCountdown] = useState(3); 
    const [timerInterval, setTimerInterval] = useState(null);
    const [showPopup, setShowPopup] = useState(false); 
    const [isGameOver, setIsGameOver] = useState(false);

    const { showSolvedPopup } = useContext(SettingsContext);

   
    const generatePuzzleRatings = () => {
        const ratings = [];
        let rating = 500;
        while (rating < 3000) {
            ratings.push(rating);
            if (rating < 2000) {
                rating = rating * 1.05;
            } else {
                rating = rating * 1.03;
            }
            rating = Math.round(rating);
        }
        return ratings;
    };

   
    const loadPuzzlePool = async () => {
        const ratings = generatePuzzleRatings();
        const puzzles = [];
        for (let i = 0; i < ratings.length; i++) {
            const minRating = ratings[i] - 50;
            const maxRating = ratings[i] + 50;

            const query = new URLSearchParams({
                minRating,
                maxRating,
            });

            const response = await fetch(`http://localhost:3003/api/puzzles?${query}`);
            if (!response.ok) {
                continue;
            }
            const data = await response.json();

            if (data.length > 0) {
               
                const randomIndex = Math.floor(Math.random() * data.length);
                puzzles.push(data[randomIndex]);
            }
        }
        setPuzzlePool(puzzles);
    };

    const handleStart = async (selectedTimeLimit = timeLimit) => {
        setIsGameOver(false);
        setIsCountdown(true);
        setCountdown(3);
        await loadPuzzlePool();
        setTimeLimit(selectedTimeLimit);
        setTimeLeft(selectedTimeLimit);
        setSolvedCount(0);
        setMistakes(0);
        setCurrentPuzzleIndex(0);
        const countdownInterval = setInterval(() => {
            setCountdown((prev) => {
                if (prev <= 1) {
                    clearInterval(countdownInterval);
                    setIsCountdown(false);
                    setIsStarted(true);
                    const interval = setInterval(() => {
                        setTimeLeft((prevTime) => {
                            if (prevTime <= 1) {
                                clearInterval(interval);
                                setIsStarted(false);
                                setIsGameOver(true);
                                return 0;
                            }
                            return prevTime - 1;
                        });
                    }, 1000);
                    setTimerInterval(interval);
                }
                return prev - 1;
            });
        }, 1000);
    };


    const currentPuzzle = puzzlePool[currentPuzzleIndex];

    const handlePuzzleResult = (isSolved) => {
        if (isSolved) {
            setSolvedCount((prev) => prev + 1);
        } else {
            setMistakes((prev) => prev + 1);
            if (mistakes + 1 >= 3) {
                setIsStarted(false);
                clearInterval(timerInterval);
                setIsGameOver(true);
                return;
            }
        }

        if (currentPuzzleIndex + 1 < puzzlePool.length) {
            setCurrentPuzzleIndex((prev) => prev + 1);
        } else {
            setIsStarted(false);
            clearInterval(timerInterval);
            setIsGameOver(true);
        }
    };
    return (
        <div>
            <h2>{t('puzzleSolvingTimed')}</h2>
            {(!isStarted && !isCountdown) && (
                <>
                    {isGameOver && (
                        <div>
                            <h3>{t('gameOver')}</h3>
                            <p>{t('solvedPuzzles')}: {solvedCount}</p>
                            <p>{t('mistakes')}: {mistakes} / 3</p>
                        </div>
                    )}
                    <p>{t('chooseTimeLimit')}</p>
                    <div className="time-buttons">
                        <button onClick={() => handleStart(180)}>3 {t('minutes')}</button>
                        <button onClick={() => handleStart(300)}>5 {t('minutes')}</button>
                    </div>
                </>
            )}
            {isCountdown && <h3>{t('startingIn')}: {countdown}</h3>}
            {isStarted && (
                <div className="timed-puzzles-container" style={{ position: 'relative' }}>
                    <div className="timed-puzzles-info">
                        <p>
                            {t('timeLeft')}: {timeLeft} {t('seconds')}
                        </p>
                        <p>
                            {t('solvedPuzzles')}: {solvedCount}
                        </p>
                        <p>
                            {t('mistakes')}: {mistakes} / 3
                        </p>
                    </div>
                    {currentPuzzle && (
                        <Game
                            showMoveTree={false}
                            showPgnControls={false}
                            initialFen={currentPuzzle.fen}
                            solutionMoves={currentPuzzle.moves}
                            isPuzzleMode={true}
                            boardOrientation={
                                currentPuzzle.fen.split(' ')[1] === 'w' ? 'black' : 'white'
                            }
                            onPuzzleResult={handlePuzzleResult}
                        />
                    )}
                </div>
            )}
        </div>
    );
}

export default TimedPuzzles;