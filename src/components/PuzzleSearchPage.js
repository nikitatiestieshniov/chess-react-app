import React, { useState } from 'react';
import PuzzleSearch from './puzzleSearch';
import PuzzleList from './PuzzleList';

function PuzzleSearchPage() {
    const [puzzles, setPuzzles] = useState([]);

    const handleSearch = async ({ themes, minRating, maxRating }) => {
        try {
            const query = new URLSearchParams({
                themes: themes || '',
                minRating: minRating || '',
                maxRating: maxRating || '',
            });

            console.log('Отправка запроса:', `http://localhost:3003/api/puzzles?${query}`);

            const response = await fetch(`http://localhost:3003/api/puzzles?${query}`);
            console.log('HTTP статус ответа:', response.status);

            if (!response.ok) {
                throw new Error(`Ошибка: ${response.status}`);
            }

            const data = await response.json();
            console.log('Ответ от сервера:', data);

            setPuzzles(data);
        } catch (error) {
            console.error('Ошибка при загрузке задач:', error);
        }
    };

    return (
        <div>
            <h2>Поиск задач</h2>
            <PuzzleSearch onSearch={handleSearch} />
            <PuzzleList puzzles={puzzles} />
        </div>
    );
}

export default PuzzleSearchPage;
