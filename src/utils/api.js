// src/utils/api.js
export async function fetchPuzzles() {
    const response = await fetch('http://localhost:3001/api/puzzles');
    if (!response.ok) {
      throw new Error('Ошибка при загрузке данных');
    }
    return await response.json();
  }
  