// Training.js

import React, { useState } from 'react';
import Game from '../components/game';
import Moves from '../components/moves';
import '../styles/Training.css';
import { t } from "../locales/localization";
function Training() {
    const [isTrainingMode, setIsTrainingMode] = useState(false);
    const [selectedColor, setSelectedColor] = useState('white');
    const [startTraining, setStartTraining] = useState(false);
    const [loadedPgn, setLoadedPgn] = useState('');

    const toggleTrainingMode = () => {
        setIsTrainingMode(!isTrainingMode);
    };

    const handleColorChange = (e) => {
        setSelectedColor(e.target.value);
    };

    const handlePgnLoad = (pgn) => {
        setLoadedPgn(pgn);
        console.log('PGN loaded:', pgn);
    };

    const handleStartTraining = () => {
        if (!loadedPgn) {
            alert(t('startTrainingWithPGN'));
            return;
        }
        console.log('Starting training with loaded PGN');
        setStartTraining(true);
    };

    return (
        <div className="training-page">
            <h1>{t('openingTraining')}</h1>
            <div className="training-controls">
                <div className="mode-selection">
                    <label>
                        <input
                            type="radio"
                            value="view"
                            checked={!isTrainingMode}
                            onChange={toggleTrainingMode}
                        />
                        {t('viewMode')}
                    </label>
                    <label>
                        <input
                            type="radio"
                            value="train"
                            checked={isTrainingMode}
                            onChange={toggleTrainingMode}
                        />
                        {t('trainingMode')}
                    </label>
                </div>
                {isTrainingMode && (
                    <div className="training-options">
                        <label>
                            {t('selectColorForTraining')}:
                            <select value={selectedColor} onChange={handleColorChange}>
                                <option value="white">{t('white')}</option>
                                <option value="black">{t('black')}</option>
                            </select>
                        </label>
                        <button onClick={handleStartTraining} disabled={!loadedPgn}>
                            {t('start')}
                        </button>
                    </div>
                )}
                <Moves loadPgn={handlePgnLoad} currentPgn={loadedPgn} />
            </div>
            <Game
                showPgnControls={false}
                isTrainingMode={isTrainingMode}
                setIsTrainingMode={setIsTrainingMode}
                selectedColor={selectedColor}
                startTraining={startTraining}
                setStartTraining={setStartTraining}
                loadedPgn={loadedPgn}
            />
        </div>
    );
}

export default Training;
