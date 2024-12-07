// Analysis.js

import React, { useState, useEffect, useRef } from 'react';
import Game from '../components/game';
import { t } from "../locales/localization";

function Analysis() {
    const [nextMoves, setNextMoves] = useState([]);
    const gameRef = useRef();

    
    const fetchNextMoves = async (fen) => {
        try {
            const response = await fetch('http://localhost:3003/api/next-moves', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ fen }),
            });

            if (!response.ok) {
                throw new Error(`Error: ${response.statusText}`);
            }

            const data = await response.json();
            setNextMoves(data.moves);
        } catch (error) {
            console.error('Error fetching next moves:', error);
        }
    };

   
    const handlePositionChange = (fen) => {
        fetchNextMoves(fen);
    };

    const handleMoveClick = (san) => {
        if (gameRef.current) {
            gameRef.current.makeMove(san);
        }
    };

    return (
        <div>
            <h2>{t('analysis')}</h2>
            <div style={{ display: 'flex' }}>
                <div style={{ flex: 1 }}>
                    <Game
                        ref={gameRef}
                        showMoveTree={false}
                        onPositionChange={handlePositionChange}
                    />
                </div>
                <div style={{ flex: 1, marginLeft: '20px' }}>
                    <h3>{t('nextMoves')}</h3>
                    {nextMoves.length > 0 ? (
                        <table>
                            <thead>
                                <tr>
                                    <th>{t('move')}</th>
                                    <th>{t('games')}</th>
                                    <th>{t('whiteWins')}</th>
                                    <th>{t('blackWins')}</th>
                                    <th>{t('draws')}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {nextMoves.map((move, index) => {
                                    const totalGames = move.whiteWins + move.blackWins + move.draws;
                                    const whiteWinRate =
                                        totalGames > 0 ? ((move.whiteWins / totalGames) * 100).toFixed(1) : 0;
                                    const blackWinRate =
                                        totalGames > 0 ? ((move.blackWins / totalGames) * 100).toFixed(1) : 0;
                                    const drawRate =
                                        totalGames > 0 ? ((move.draws / totalGames) * 100).toFixed(1) : 0;

                                    return (
                                        <tr key={index} onClick={() => handleMoveClick(move.san)}>
                                            <td
                                                style={{ cursor: 'pointer', textDecoration: 'underline' }}
                                            >
                                                {move.san}
                                            </td>
                                            <td>{move.games}</td>
                                            <td>
                                                {move.whiteWins} ({whiteWinRate}%)
                                            </td>
                                            <td>
                                                {move.blackWins} ({blackWinRate}%)
                                            </td>
                                            <td>
                                                {move.draws} ({drawRate}%)
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    ) : (
                        <p>{t('noDataForPosition')}</p>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Analysis;
