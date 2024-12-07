// SettingsContext.js
import React, { createContext, useState, useEffect } from 'react';
import { setLanguage } from '../locales/localization';

export const SettingsContext = createContext();

export function SettingsProvider({ children }) {
    const [animationsEnabled, setAnimationsEnabled] = useState(() => {
        const stored = localStorage.getItem('animationsEnabled');
        return stored !== null ? stored === 'true' : true;
    });

    const [puzzleFirstMoveAnimationEnabled, setPuzzleFirstMoveAnimationEnabled] = useState(() => {
        const stored = localStorage.getItem('puzzleFirstMoveAnimationEnabled');
        return stored !== null ? stored === 'true' : true;
    });

    const [language, setLanguageState] = useState(() => {
        return localStorage.getItem('language') || 'en';
    });

    const setLanguagePreference = (selectedLanguage) => {
        setLanguage(selectedLanguage);
        setLanguageState(selectedLanguage);
        localStorage.setItem('language', selectedLanguage);
    };

    const resetPuzzleRating = () => {
        localStorage.setItem('userRating', 1500);
        console.log('Puzzle rating reset to 1500.');
    };

    const resetSolvedPuzzles = () => {
        localStorage.setItem('solvedPuzzles', JSON.stringify([]));
        console.log('Solved puzzles reset.');
    };

    useEffect(() => {
        localStorage.setItem('animationsEnabled', animationsEnabled);
    }, [animationsEnabled]);

    useEffect(() => {
        localStorage.setItem('puzzleFirstMoveAnimationEnabled', puzzleFirstMoveAnimationEnabled);
    }, [puzzleFirstMoveAnimationEnabled]);

    return (
        <SettingsContext.Provider
            value={{
                animationsEnabled,
                setAnimationsEnabled,
                puzzleFirstMoveAnimationEnabled,
                setPuzzleFirstMoveAnimationEnabled,
                language,
                setLanguagePreference,
                resetPuzzleRating, 
                resetSolvedPuzzles,
            }}
        >
            {children}
        </SettingsContext.Provider>
    );
}
