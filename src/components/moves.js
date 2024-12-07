// Файл: Moves.js

import React, { useRef } from 'react';
import '../styles/Moves.css';
import { t } from "../locales/localization";

function Moves({ loadPgn, getPgn, currentPgn, onPgnChange }) {
    const fileInputRef = useRef(null);

    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const pgnContent = e.target.result;
                loadPgn(pgnContent);
            };
            reader.readAsText(file);
        }
    };

    const handleSavePgn = () => {
        const pgn = getPgn();
        const blob = new Blob([pgn], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'game.pgn';
        link.click();
        URL.revokeObjectURL(url);
    };

    const handleLoadPgn = () => {
        loadPgn(currentPgn);
    };

    return (
        <div className="moves">
            <h3>{t('pgn')}</h3>
            <textarea
                value={currentPgn}
                onChange={(e) => onPgnChange(e.target.value)}
                placeholder={t('pastePGN')}
                rows={10}
            />
            <div className="moves-buttons">
                <input
                    type="file"
                    ref={fileInputRef}
                    style={{ display: 'none' }}
                    accept=".pgn"
                    onChange={handleFileUpload}
                />
                <button onClick={() => fileInputRef.current.click()}>{t('chooseFile')}</button>
                <button onClick={handleLoadPgn}>{t('loadPGN')}</button>
                <button onClick={handleSavePgn}>{t('savePGN')}</button>
            </div>
        </div>
    );
}

export default Moves;
