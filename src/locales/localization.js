﻿// localization.js

const languages = {
    en: {
        welcome: "Welcome",
        loadPGN: "Load PGN",
        savePGN: "Save PGN",
        pastePGN: "Paste PGN to load",
        pgn: "PGN",
        startTraining: "Start Training",
        settings: "Settings",
        language: "Language",
        enableMoveAnimations: "Enable move animations",
        enablePuzzleFirstMoveAnimation: "Enable first move animation in puzzles",
        incorrectMoveExpected: "Incorrect move! Expected: {{expected}}",
        puzzleCompletedOrNoExpectedMove: "Puzzle completed or no expected move.",
        puzzleSolved: "Puzzle solved!",
        puzzleFailed: "Puzzle failed.",
        openingTraining: "Opening Training",
        viewMode: "View Mode",
        trainingMode: "Training Mode",
        selectColorForTraining: "Select color for training",
        white: "White",
        black: "Black",
        start: "Start",
        nextPuzzle: "Next Puzzle",
        puzzleSolving: "Puzzle Solving",
        userRating: "Your rating",
        search: "Search",
        themes: "Themes",
        ratingRange: "Rating range (±)",
        minRating: "Min. Rating",
        maxRating: "Max. Rating",
        filterPuzzles: "Filter Puzzles",
        searchPuzzles: "Search Puzzles",
        listOfPuzzles: "List of Puzzles",
        move: "Move",
        games: "Games",
        whiteWins: "White Wins",
        blackWins: "Black Wins",
        draws: "Draws",
        noDataForPosition: "No data for this position.",
        analysis: "Analysis",
        nextMoves: "Next Moves",
        solvedPuzzles: "Solved Puzzles",
        mistakes: "Mistakes",
        timeLeft: "Time left",
        puzzleSolvingTimed: "Timed Puzzle Solving",
        chooseTimeLimit: "Choose time limit",
        minutes: "minutes",
        startGame: "Start Game",
        startingIn: "Starting in",
        seconds: "seconds",
        threeMistakesGameOver: "You made three mistakes. Game over.",
        noMorePuzzlesGameOver: "No more puzzles. Game over.",
        loading: "Loading...",
        expectedMove: "Expected move: {{move}}",
        trainingSequence: "Training sequence {{current}} of {{total}}",
        incorrectMove: "Incorrect move!",
        startTrainingWithPGN: "Start training with loaded PGN",
        moveTree: "Move Tree",
        evaluation: "Evaluation",
        variations: "Variations",
        puzzleStatus: "Puzzle Status",
        puzzleSolvedMessage: "Puzzle solved!",
        puzzleFailedMessage: "Puzzle failed.",
        trainingProgress: "Training Progress",
        sequence: "Sequence",
        of: "of",
        errorMessage: "Incorrect move! Expected: {{move}}",
        chooseFile: "Choose File",
        engineLines: "Engine Lines",
        loadPgnBeforeTraining: "Load a PGN file before starting training.",
        noSequencesForTraining:
            "No sequences available for training. Check if a valid PGN is loaded and the correct color is selected.",
        gameOver: "Game Over",
        startNewGame: "Start New Game",
        timeIsUpGameOver: "Time is up! Game over.",
        "resetPuzzleRating": "Reset puzzle rating to 1500",
        "resetSolvedPuzzles": "Reset solved puzzles",
        pageNames: {
            openingTraining: "Opening Training",
            analysis: "Analysis",
            puzzleSolving: "Puzzle Solving",
            searchPuzzles: "Search Puzzles",
            puzzleSolvingTimed: "Timed Puzzle Solving",
            settings: "Settings",
        },
    },
    uk: {
        welcome: "Ласкаво просимо",
        loadPGN: "Завантажити PGN",
        savePGN: "Зберегти PGN",
        pastePGN: "Вставте PGN для завантаження",
        pgn: "PGN",
        startTraining: "Почати тренування",
        settings: "Налаштування",
        language: "Мова",
        enableMoveAnimations: "Увімкнути анімацію ходів",
        enablePuzzleFirstMoveAnimation: "Анімація першого ходу в задачах",
        incorrectMoveExpected: "Неправильний хід! Очікувалось: {{expected}}",
        puzzleCompletedOrNoExpectedMove:
            "Задачу завершено або очікуваний хід відсутній.",
        puzzleSolved: "Задачу вирішено!",
        puzzleFailed: "Задачу провалено.",
        openingTraining: "Тренування дебютів",
        viewMode: "Режим перегляду",
        trainingMode: "Режим тренування",
        selectColorForTraining: "Виберіть колір для тренування",
        white: "Білі",
        black: "Чорні",
        start: "Старт",
        nextPuzzle: "Наступна задача",
        puzzleSolving: "Розв'язування задач",
        userRating: "Ваш рейтинг",
        search: "Пошук",
        themes: "Теми",
        ratingRange: "Діапазон рейтингу (±)",
        minRating: "Мін. Рейтинг",
        maxRating: "Макс. Рейтинг",
        filterPuzzles: "Фільтр задач",
        searchPuzzles: "Пошук задач",
        listOfPuzzles: "Список задач",
        move: "Хід",
        games: "Партій",
        whiteWins: "Перемоги білих",
        blackWins: "Перемоги чорних",
        draws: "Нічиї",
        noDataForPosition: "Немає даних для цієї позиції.",
        analysis: "Аналіз",
        nextMoves: "Наступні ходи",
        solvedPuzzles: "Розв'язано задач",
        mistakes: "Помилки",
        timeLeft: "Залишилось часу",
        puzzleSolvingTimed: "Розв'язування задач на час",
        chooseTimeLimit: "Виберіть обмеження по часу",
        minutes: "хвилин",
        startGame: "Почати гру",
        startingIn: "Початок через",
        seconds: "секунд",
        threeMistakesGameOver:
            "Ви зробили три помилки. Гру завершено.",
        noMorePuzzlesGameOver:
            "Задачі закінчились. Гру завершено.",
        loading: "Завантаження...",
        expectedMove: "Очікуваний хід: {{move}}",
        trainingSequence: "Послідовність тренування {{current}} з {{total}}",
        incorrectMove: "Неправильний хід!",
        startTrainingWithPGN: "Почати тренування з завантаженим PGN",
        moveTree: "Дерево ходів",
        evaluation: "Оцінка",
        variations: "Варіанти",
        puzzleStatus: "Статус задачі",
        puzzleSolvedMessage: "Задачу вирішено!",
        puzzleFailedMessage: "Задачу провалено.",
        trainingProgress: "Прогрес тренування",
        sequence: "Послідовність",
        of: "з",
        errorMessage: "Неправильний хід! Очікувався: {{move}}",
        chooseFile: "Вибрати файл",
        engineLines: "Лінії двигуна",
        loadPgnBeforeTraining: "Завантажте PGN файл перед початком тренування.",
        noSequencesForTraining:
            "Немає послідовностей для тренування. Перевірте, чи завантажено коректний PGN та вибрано правильний колір.",
        gameOver: "Гра закінчена",
        startNewGame: "Почати нову гру",
        timeIsUpGameOver: "Час вийшов! Гра закінчена.",
        "resetPuzzleRating": "Скинути рейтинг задач до 1500",
        "resetSolvedPuzzles": "Скинути список вирішених задач",
        pageNames: {
            openingTraining: "Тренування дебютів",
            analysis: "Аналіз",
            puzzleSolving: "Розв'язування задач",
            searchPuzzles: "Пошук задач",
            puzzleSolvingTimed: "Розв'язування задач на час",
            settings: "Налаштування",
        },

    },
    de: {
        welcome: "Willkommen",
        loadPGN: "PGN laden",
        savePGN: "PGN speichern",
        pastePGN: "Fügen Sie PGN zum Laden ein",
        pgn: "PGN",
        startTraining: "Training starten",
        settings: "Einstellungen",
        language: "Sprache",
        enableMoveAnimations: "Zuganimationen aktivieren",
        enablePuzzleFirstMoveAnimation:
            "Erste Zuganimation in Rätseln aktivieren",
        incorrectMoveExpected: "Falscher Zug! Erwartet: {{expected}}",
        puzzleCompletedOrNoExpectedMove:
            "Rätsel abgeschlossen oder erwarteter Zug fehlt.",
        puzzleSolved: "Rätsel gelöst!",
        puzzleFailed: "Rätsel fehlgeschlagen.",
        openingTraining: "Eröffnungstraining",
        viewMode: "Ansichtsmodus",
        trainingMode: "Trainingsmodus",
        selectColorForTraining: "Wählen Sie die Farbe für das Training",
        white: "Weiß",
        black: "Schwarz",
        start: "Start",
        nextPuzzle: "Nächstes Rätsel",
        puzzleSolving: "Rätsel lösen",
        userRating: "Ihre Wertung",
        search: "Suche",
        themes: "Themen",
        ratingRange: "Wertungsbereich (±)",
        minRating: "Min. Wertung",
        maxRating: "Max. Wertung",
        filterPuzzles: "Rätsel filtern",
        searchPuzzles: "Rätsel suchen",
        listOfPuzzles: "Liste der Rätsel",
        move: "Zug",
        games: "Partien",
        whiteWins: "Weiß gewinnt",
        blackWins: "Schwarz gewinnt",
        draws: "Remis",
        noDataForPosition: "Keine Daten für diese Position.",
        analysis: "Analyse",
        nextMoves: "Nächste Züge",
        solvedPuzzles: "Gelöste Rätsel",
        mistakes: "Fehler",
        timeLeft: "Verbleibende Zeit",
        puzzleSolvingTimed: "Rätsel lösen auf Zeit",
        chooseTimeLimit: "Wählen Sie ein Zeitlimit",
        minutes: "Minuten",
        startGame: "Spiel starten",
        startingIn: "Startet in",
        seconds: "Sekunden",
        threeMistakesGameOver:
            "Sie haben drei Fehler gemacht. Spiel beendet.",
        noMorePuzzlesGameOver:
            "Keine weiteren Rätsel. Spiel beendet.",
        loading: "Laden...",
        expectedMove: "Erwarteter Zug: {{move}}",
        trainingSequence: "Trainingssequenz {{current}} von {{total}}",
        incorrectMove: "Falscher Zug!",
        startTrainingWithPGN: "Training mit geladenem PGN starten",
        moveTree: "Zugbaum",
        evaluation: "Bewertung",
        variations: "Varianten",
        puzzleStatus: "Rätselstatus",
        puzzleSolvedMessage: "Rätsel gelöst!",
        puzzleFailedMessage: "Rätsel fehlgeschlagen.",
        trainingProgress: "Trainingsfortschritt",
        sequence: "Sequenz",
        of: "von",
        errorMessage: "Falscher Zug! Erwartet: {{move}}",
        chooseFile: "Datei auswählen",
        engineLines: "Engine Linien",
        loadPgnBeforeTraining:
            "Laden Sie eine PGN-Datei vor dem Start des Trainings.",
        noSequencesForTraining:
            "Keine Sequenzen für das Training verfügbar. Überprüfen Sie, ob ein gültiges PGN geladen ist und die richtige Farbe ausgewählt wurde.",
        gameOver: "Spiel beendet",
        startNewGame: "Neues Spiel starten",
        timeIsUpGameOver: "Zeit ist abgelaufen! Spiel beendet.",
        "resetPuzzleRating": "Rätselbewertung auf 1500 zurücksetzen",
        "resetSolvedPuzzles": "Liste der gelösten Rätsel zurücksetzen",
        pageNames: {
            openingTraining: "Eröffnungstraining",
            analysis: "Analyse",
            puzzleSolving: "Rätsel lösen",
            searchPuzzles: "Rätsel suchen",
            puzzleSolvingTimed: "Rätsel lösen auf Zeit",
            settings: "Einstellungen",
        },

    },
};


let currentLanguage = 'en'; 

export const setLanguage = (lang) => {
    if (languages[lang]) {
        currentLanguage = lang;
    }
};

export const t = (key, variables) => {
    const keys = key.split('.');
    let translation = languages[currentLanguage];
    for (let k of keys) {
        translation = translation[k];
        if (!translation) {
            translation = key;
            break;
        }
    }
    if (variables) {
        Object.keys(variables).forEach((varKey) => {
            const regex = new RegExp(`{{${varKey}}}`, 'g');
            translation = translation.replace(regex, variables[varKey]);
        });
    }
    return translation;
};