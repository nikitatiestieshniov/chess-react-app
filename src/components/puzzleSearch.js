// PuzzleSearch.js

import React, { useState, useEffect } from 'react';
import { t } from "../locales/localization";
function PuzzleSearch({ onSearch, userRating, ratingRange, setRatingRange }) {
    const [themes, setThemes] = useState('');
    const [minRating, setMinRating] = useState(userRating - ratingRange);
    const [maxRating, setMaxRating] = useState(userRating + ratingRange);

    useEffect(() => {
        setMinRating(userRating - ratingRange);
        setMaxRating(userRating + ratingRange);
    }, [userRating, ratingRange]);

    const handleRatingRangeChange = (e) => {
        const range = parseInt(e.target.value, 10);
        if (!isNaN(range)) {
            setRatingRange(range);
        }
    };

    const handleSearch = () => {
        onSearch({ themes, minRating, maxRating });
    };

    return (
        <div>
            <h3>{t('filterPuzzles')}</h3>
            <div>
                <label>{t('themes')}:</label>
                <input
                    type="text"
                    value={themes}
                    onChange={(e) => setThemes(e.target.value)}
                    placeholder="e.g., endgame, tactics"
                />
            </div>
            <div>
                <label>{t('ratingRange')}:</label>
                <input
                    type="number"
                    value={ratingRange}
                    onChange={handleRatingRangeChange}
                    placeholder="100"
                />
            </div>
            <div>
                <label>{t('minRating')}:</label>
                <input
                    type="number"
                    value={minRating}
                    onChange={(e) => setMinRating(parseInt(e.target.value, 10))}
                    placeholder={t('minRating')}
                />
            </div>
            <div>
                <label>{t('maxRating')}:</label>
                <input
                    type="number"
                    value={maxRating}
                    onChange={(e) => setMaxRating(parseInt(e.target.value, 10))}
                    placeholder={t('maxRating')}
                />
            </div>
            <button onClick={handleSearch}>{t('search')}</button>
        </div>
    );
}

export default PuzzleSearch;
