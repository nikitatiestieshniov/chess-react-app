// App.js

import React, { useContext } from 'react';
import { HashRouter as Router, Route, Routes, Link } from 'react-router-dom';
import PuzzleSearchPage from './PuzzleSearchPage';
import Training from '../pages/Training';
import Analysis from '../pages/Analysis';
import Puzzles from '../pages/Puzzles';
import Settings from "../pages/settings";
import { SettingsProvider, SettingsContext } from './SettingsContext';
import TimedPuzzles from '../pages/TimedPuzzles';
import '../styles/App.css';
import { t } from "../locales/localization";

function App() {
    return (
        <SettingsProvider>
            <Router>
                <AppContent />
            </Router>
        </SettingsProvider>
    );
}

function AppContent() {
    const { language } = useContext(SettingsContext); 
    return (
        <div className="app">
            <header className="app-header">
                <div className="logo">
                    <Link to="/">Chess Trainer</Link> {/*  */}
                </div>
                <nav className="main-nav">
                    <ul>
                        <li>
                            <Link to="/">{t('pageNames.openingTraining')}</Link>
                        </li>
                        <li>
                            <Link to="/analysis">{t('pageNames.analysis')}</Link>
                        </li>
                        <li>
                            <Link to="/puzzles">{t('pageNames.puzzleSolving')}</Link>
                        </li>
                        <li>
                            <Link to="/search">{t('pageNames.searchPuzzles')}</Link>
                        </li>
                        <li>
                            <Link to="/TimedPuzzles">{t('pageNames.puzzleSolvingTimed')}</Link>
                        </li>
                        <li>
                            <Link to="/settings">{t('pageNames.settings')}</Link>
                        </li>
                    </ul>
                </nav>
            </header>
            <main className="app-main">
                <Routes>
                    <Route path="/" element={<Training />} />
                    <Route path="/analysis" element={<Analysis />} />
                    <Route path="/puzzles" element={<Puzzles />} />
                    <Route path="/search" element={<PuzzleSearchPage />} />
                    <Route path="/settings" element={<Settings />} />
                    <Route path="/TimedPuzzles" element={<TimedPuzzles />} />
                </Routes>
            </main>
            <footer className="app-footer">
                <p>&copy; 2024 Chess Trainer</p>
            </footer>
        </div>
    );
}

export default App;
