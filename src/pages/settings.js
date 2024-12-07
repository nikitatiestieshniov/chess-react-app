// settings.js


import React, { useContext } from 'react';
import { SettingsContext } from '../components/SettingsContext';
import { t } from '../locales/localization';

function Settings() {
    const {
        animationsEnabled,
        setAnimationsEnabled,
        puzzleFirstMoveAnimationEnabled,
        setPuzzleFirstMoveAnimationEnabled,
        language,
        setLanguagePreference,
        resetPuzzleRating, 
        resetSolvedPuzzles, 
    } = useContext(SettingsContext);

    const handleLanguageChange = (e) => {
        const selectedLanguage = e.target.value;
        setLanguagePreference(selectedLanguage);
    };

    return (
        <div>
            <h2>{t('settings')}</h2>
            <div>
                <label>{t('language')}:</label>
                <select value={language} onChange={handleLanguageChange}>
                    <option value="en">English</option>
                    <option value="uk">Українська</option>
                    <option value="de">Deutsch</option>
                </select>
            </div>
            <div>
                <label>
                    <input
                        type="checkbox"
                        checked={animationsEnabled}
                        onChange={(e) => setAnimationsEnabled(e.target.checked)}
                    />
                    {t('enableMoveAnimations')}
                </label>
            </div>
            <div>
                <label>
                    <input
                        type="checkbox"
                        checked={puzzleFirstMoveAnimationEnabled}
                        onChange={(e) => setPuzzleFirstMoveAnimationEnabled(e.target.checked)}
                    />
                    {t('enablePuzzleFirstMoveAnimation')}
                </label>
            </div>
            <div>
                <button onClick={resetPuzzleRating}>
                    {t('resetPuzzleRating')}
                </button>
            </div>
            <div>
                <button onClick={resetSolvedPuzzles}>
                    {t('resetSolvedPuzzles')}
                </button>
            </div>
        </div>
    );
}

export default Settings;
