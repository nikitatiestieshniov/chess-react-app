// Game.js

import React, {
    useState,
    useEffect,
    useRef,
    useImperativeHandle,
    forwardRef,
    useContext,
} from 'react';
import { Chessboard } from 'react-chessboard';
import GameState from './gamestate';
import Notation from './notation';
import Moves from './moves';
import PromotionDialog from './promotion';
import '../styles/Game.css';
import MoveTree from './MoveTree';
import useEngine from './engine';
import { SettingsContext } from './SettingsContext';
import { t } from "../locales/localization";

const Game = forwardRef((props, ref) => {
    const {
        showMoveTree = true,
        showPgnControls = true,
        initialFen = null,
        solutionMoves = null,
        isPuzzleMode = false,
        boardOrientation,
        onPuzzleResult,
        onPositionChange,
        isTrainingMode = false,
        setIsTrainingMode = null,
        selectedColor = 'white',
        startTraining = false,
        setStartTraining = null,
        onPgnLoad = null,
        loadedPgn = '',
        
    } = props;

    const gameStateRef = useRef(
        new GameState(null, isPuzzleMode, () => {
            setUpdateTrigger((prev) => prev + 1);
        })
    );

    const [updateTrigger, setUpdateTrigger] = useState(0);
    const [currentPgn, setCurrentPgn] = useState(gameStateRef.current.getPgn() || '');
    const [promotionOptions, setPromotionOptions] = useState(null);
    const [hiddenGameState] = useState(new GameState());
    const [currentPosition, setCurrentPosition] = useState(gameStateRef.current.getCurrentFen());
    const [showPromotionDialog, setShowPromotionDialog] = useState(false);
    const [promotionDialogPosition, setPromotionDialogPosition] = useState({ x: 0, y: 0 });
    const chessboardRef = useRef();
    const [puzzleFinished, setPuzzleFinished] = useState(false);
    const [statusMessage, setStatusMessage] = useState('');
    const [isPuzzleSolved, setIsPuzzleSolved] = useState(false);
    const [isPuzzleFailed, setIsPuzzleFailed] = useState(false);
    const { animationsEnabled, puzzleFirstMoveAnimationEnabled } = useContext(SettingsContext);
    const engineEnabled = !isPuzzleMode || puzzleFinished;
    const [trainingQueue, setTrainingQueue] = useState([]);
    const [currentTrainingIndex, setCurrentTrainingIndex] = useState(0);
    const [showErrorMessage, setShowErrorMessage] = useState(false);
    const [superMemoData, setSuperMemoData] = useState({});
    const [arrows, setArrows] = useState([]);
    const [selectedSquare, setSelectedSquare] = useState(null);
    const [shownMoves, setShownMoves] = useState(new Set());

    const {
        evaluation,
        variations,
        numLines,
        increaseLines,
        decreaseLines,
    } = useEngine(gameStateRef, engineEnabled, currentPosition);

    const getSquareCoordinates = (square) => {
        const squareElement = document.querySelector(`[data-square="${square}"]`);
        if (squareElement) {
            const rect = squareElement.getBoundingClientRect();
            return {
                x: rect.left + window.scrollX,
                y: rect.top + window.scrollY,
            };
        }
        return null;
    };

    const onDrop = (sourceSquare, targetSquare) => {
        const result = gameStateRef.current.onDrop(sourceSquare, targetSquare);

        if (result === 'promotion') {
            const coords = getSquareCoordinates(targetSquare);
            if (coords) {
                setPromotionDialogPosition({ x: coords.x, y: coords.y });
            }
            setPromotionOptions({ from: sourceSquare, to: targetSquare });
            setShowPromotionDialog(true);
            return false;
        }
        if (result) {
            setUpdateTrigger((prev) => prev + 1);
            setCurrentPosition(gameStateRef.current.getCurrentFen());

            
            if (isPuzzleMode) {
                if (gameStateRef.current.isPuzzleSolved) {
                    setIsPuzzleSolved(true);
                    setPuzzleFinished(true);
                    setStatusMessage(t('puzzleSolvedMessage'));
                    setUpdateTrigger((prev) => prev + 1);
                } else if (gameStateRef.current.isPuzzleFailed) {
                    setIsPuzzleFailed(true);
                    setPuzzleFinished(true);
                    setStatusMessage(t('puzzleFailedMessage'));
                    setUpdateTrigger((prev) => prev + 1);
                }
            }
            return true;
        }

        return false;
    };

    useImperativeHandle(ref, () => ({
        makeMove: (san) => {
            const move = gameStateRef.current.chess.move(san);

            if (move) {
                gameStateRef.current._updateGameStateAfterMove(move);
                setUpdateTrigger((prev) => prev + 1);
                setCurrentPosition(gameStateRef.current.getCurrentFen());

               
                if (onPositionChange) {
                    onPositionChange(gameStateRef.current.getCurrentFen());
                }
            } else {
                console.error('Invalid move:', san);
            }
        },
    }));

    const onClick = (square) => {
        if (showPromotionDialog) {
            setShowPromotionDialog(false);
            setPromotionOptions(null);
            return;
        }

        const result = gameStateRef.current.onClick(square);

        if (result === 'promotion') {
            const coords = getSquareCoordinates(square);
            if (coords) {
                setPromotionDialogPosition({ x: coords.x, y: coords.y });
            }
            setPromotionOptions({ square, type: 'click' });
            setShowPromotionDialog(true);
        } else if (result) {
            setUpdateTrigger((prev) => prev + 1);
            setCurrentPosition(gameStateRef.current.getCurrentFen());

           
            if (isPuzzleMode) {
                if (gameStateRef.current.isPuzzleSolved) {
                    setIsPuzzleSolved(true);
                    setPuzzleFinished(true);
                    setStatusMessage(t('puzzleSolvedMessage'));
                    setUpdateTrigger((prev) => prev + 1);
                } else if (gameStateRef.current.isPuzzleFailed) {
                    setIsPuzzleFailed(true);
                    setPuzzleFinished(true);
                    setStatusMessage(t('puzzleFailedMessage'));
                    setUpdateTrigger((prev) => prev + 1);
                }
            }
        }
    };

    const handlePromotion = (piece) => {
        if (promotionOptions) {
            gameStateRef.current.promote(piece, promotionOptions);
            setShowPromotionDialog(false);
            setPromotionOptions(null);
            setUpdateTrigger((prev) => prev + 1);
            setCurrentPosition(gameStateRef.current.getCurrentFen());

          
            if (isPuzzleMode) {
                if (gameStateRef.current.isPuzzleSolved) {
                    setIsPuzzleSolved(true);
                    setPuzzleFinished(true);
                    setStatusMessage(t('puzzleSolvedMessage'));
                    setUpdateTrigger((prev) => prev + 1);
                } else if (gameStateRef.current.isPuzzleFailed) {
                    setIsPuzzleFailed(true);
                    setPuzzleFinished(true);
                    setStatusMessage(t('puzzleFailedMessage'));
                    setUpdateTrigger((prev) => prev + 1);
                }
            }
        } else {
            console.error('Promotion options are not available');
        }
    };

    const goToMove = (targetNode) => {
        console.log('goToMove called with targetNode:', targetNode);
        setShowPromotionDialog(false);
        setPromotionOptions(null);
        gameStateRef.current.goToMove(targetNode);
        setUpdateTrigger((prev) => prev + 1);
        setCurrentPosition(gameStateRef.current.getCurrentFen());
    };

    const goForward = () => {
        const nextNode = gameStateRef.current.currentMoveNode.next;
        if (nextNode) {
            goToMove(nextNode);
        }
    };

    const goBack = () => {
        const prevNode = gameStateRef.current.currentMoveNode.prev;
        if (prevNode) {
            goToMove(prevNode);
        } else {
            goToMove(gameStateRef.current.root);
        }
    };

    const goToStart = () => {
        goToMove(-1);
    };

    const goToEnd = () => {
        const moves = gameStateRef.current.getNotation();
        goToMove(moves.length - 1);
    };

    const getPgn = () => {
        const pgn = gameStateRef.current.getPgn();
        setCurrentPgn(pgn);
        return pgn;
    };

    useEffect(() => {
        console.log('Update triggered:', updateTrigger);
        setCurrentPgn(gameStateRef.current.getPgn());
    }, [updateTrigger]);

    const onDragBegin = () => {
        console.log('Drag started');
        gameStateRef.current.clearSelection();
        setUpdateTrigger((prev) => prev + 1);
    };

    const handlePgnChange = (newPgn) => {
        try {
            hiddenGameState.loadFromPgn(newPgn);
            setCurrentPgn(newPgn);
        } catch (error) {
            console.error('Error parsing PGN:', error);
        }
    };

    const applyHiddenGameState = () => {
        gameStateRef.current = hiddenGameState;
        setUpdateTrigger((prev) => prev + 1);
        setCurrentPosition(gameStateRef.current.getCurrentFen());
    };

    const playVariation = (pv, upToMoveIndex = null) => {
        const moves = pv.split(' ');
        const sanMoves = moves.slice(0, upToMoveIndex + 1 || moves.length);

        const parentNode = gameStateRef.current.currentMoveNode;

        gameStateRef.current.addVariation(sanMoves, parentNode);
        setUpdateTrigger((prev) => prev + 1);
        setCurrentPosition(gameStateRef.current.getCurrentFen());
    };

    const updatePgn = () => {
        setUpdateTrigger((prev) => prev + 1);
    };

    const renderVariationMoves = (variation) => {
        let elements = [];
        let moveNumber = gameStateRef.current.currentMoveNode.moveNumber || 0;
        let lastMoveColor = gameStateRef.current.currentMoveNode.move
            ? gameStateRef.current.currentMoveNode.move.color
            : 'b';
        let color = lastMoveColor === 'w' ? 'b' : 'w';

        const moves = variation.pv.split(' ');

        for (let moveIndex = 0; moveIndex < moves.length; moveIndex++) {
            const move = moves[moveIndex];

            if (color === 'w' && lastMoveColor === 'b') {
                moveNumber += 1;
            }

            let displayMoveNumber = '';
            if ((color === 'w' && lastMoveColor === 'b') || (moveIndex === 0 && color === 'w')) {
                displayMoveNumber = `${moveNumber}. `;
            } else if (color === 'b' && lastMoveColor === 'w') {
                displayMoveNumber = `${moveNumber}... `;
            }

            elements.push(
                <span
                    key={moveIndex}
                    onClick={() => playVariation(variation.pv, moveIndex)}
                    style={{ cursor: 'pointer', marginRight: '5px' }}
                >
                    {displayMoveNumber}
                    {move}
                </span>
            );

            lastMoveColor = color;
            color = color === 'w' ? 'b' : 'w';
        }

        return elements;
    };

    useEffect(() => {
        const handleWheel = (event) => {
            event.preventDefault();
            if (event.deltaY < 0) {
                goBack();
            } else if (event.deltaY > 0) {
                goForward();
            }
        };

        const chessboardElement = chessboardRef.current;
        if (chessboardElement) {
            chessboardElement.addEventListener('wheel', handleWheel, { passive: false });
        }

        return () => {
            if (chessboardElement) {
                chessboardElement.removeEventListener('wheel', handleWheel);
            }
        };
    }, []);

    useEffect(() => {
        if (isPuzzleMode && (isPuzzleSolved || isPuzzleFailed)) {
            setPuzzleFinished(true);
            setUpdateTrigger((prev) => prev + 1);

            if (onPuzzleResult) {
                onPuzzleResult(isPuzzleSolved);
            }
        }
    }, [isPuzzleSolved, isPuzzleFailed]);

    useEffect(() => {
        setCurrentPosition(gameStateRef.current.getCurrentFen());
    }, [gameStateRef]);

    useEffect(() => {
        if (onPositionChange) {
            onPositionChange(currentPosition);
        }
    }, [currentPosition]);

    useEffect(() => {
        if (initialFen) {
            gameStateRef.current.setInitialPosition(initialFen);
            setCurrentPosition(initialFen);
        }
        if (solutionMoves) {
            gameStateRef.current.setSolutionMoves(solutionMoves);
        }
        setPuzzleFinished(false);
        setIsPuzzleSolved(false);
        setIsPuzzleFailed(false);
        setStatusMessage('');
        gameStateRef.current.isPuzzleSolved = false;
        gameStateRef.current.isPuzzleFailed = false;
        gameStateRef.current.initialOpponentMoveMade = false; 
    }, [initialFen, solutionMoves]);

    useEffect(() => {
        if (isPuzzleMode && !gameStateRef.current.initialOpponentMoveMade) {
            if (currentPosition === initialFen) {
                if (puzzleFirstMoveAnimationEnabled) {
                    setTimeout(() => {
                        gameStateRef.current.makeInitialOpponentMove();
                        const newFen = gameStateRef.current.getCurrentFen();
                        setCurrentPosition(newFen);
                        gameStateRef.current.initialOpponentMoveMade = true;
                    }, 500); 
                } else {
                    gameStateRef.current.makeInitialOpponentMove();
                    const newFen = gameStateRef.current.getCurrentFen();
                    setCurrentPosition(newFen);
                    gameStateRef.current.initialOpponentMoveMade = true;
                }
            }
        }
    }, [isPuzzleMode, currentPosition, initialFen, puzzleFirstMoveAnimationEnabled]);

 

    const initializeTraining = () => {
        if (loadedPgn) {
            gameStateRef.current.loadFromPgn(loadedPgn);
            const sequences = gameStateRef.current.getTrainingSequences(selectedColor);
            if (sequences && sequences.length > 0) {
                setTrainingQueue(sequences);
                setCurrentTrainingIndex(0);
                setSuperMemoData((prevData) => prevData);
                gameStateRef.current.resetToRoot();
                setCurrentPosition(gameStateRef.current.getCurrentFen());
            } else {
                alert(t('noSequencesForTraining'));
                setStartTraining(false);
                setIsTrainingMode(false);
            }
        } else {
            alert(t('loadPgnBeforeTraining'));
            setStartTraining(false);
            setIsTrainingMode(false);
        }
    };

    useEffect(() => {
        if (startTraining && isTrainingMode) {
            console.log('Starting training:', startTraining);
            console.log('Training mode enabled:', isTrainingMode);
            initializeTraining();
        }
    }, [startTraining, isTrainingMode]);

    useEffect(() => {
        if (isTrainingMode && startTraining) {
            if (currentTrainingIndex < trainingQueue.length) {
                const currentSequence = trainingQueue[currentTrainingIndex];
                gameStateRef.current.resetToRoot();
                setCurrentPosition(gameStateRef.current.getCurrentFen());
                setShowErrorMessage(false);
                currentSequence.currentMoveIndex = 0; // Reset current move index

                proceedToNextExpectedMove();
            }
        }
    }, [currentTrainingIndex, trainingQueue.length, isTrainingMode, startTraining]);

    const onDropTraining = (sourceSquare, targetSquare) => {
        const currentSequence = trainingQueue[currentTrainingIndex];
        const expectedMove = currentSequence.moves[currentSequence.currentMoveIndex];

        const move = { from: sourceSquare, to: targetSquare };

    
        const possibleMoves = gameStateRef.current.chess.moves({ verbose: true });
        const moveRequiresPromotion = possibleMoves.some(
            (m) => m.from === sourceSquare && m.to === targetSquare && m.flags.includes('p')
        );

        if (moveRequiresPromotion) {
           
            move.promotion = 'q'; 
        }

        const result = gameStateRef.current.chess.move(move);

        if (result) {
            if (
                result.from === expectedMove.from &&
                result.to === expectedMove.to &&
                result.promotion === expectedMove.promotion
            ) {
                
                currentSequence.currentMoveIndex++;
                setShowErrorMessage(false);

                proceedToNextExpectedMove();
                setUpdateTrigger((prev) => prev + 1);
                setCurrentPosition(gameStateRef.current.getCurrentFen());

                return true;
            } else {
              
                setShowErrorMessage(true);
                gameStateRef.current.chess.undo();
                setUpdateTrigger((prev) => prev + 1);
                setCurrentPosition(gameStateRef.current.getCurrentFen());

                return false; 
            }
        } else {
           
            setShowErrorMessage(true);
            setUpdateTrigger((prev) => prev + 1);
            setCurrentPosition(gameStateRef.current.getCurrentFen());

            return false; 
        }
    };

    const onClickTraining = (square) => {
        const currentSequence = trainingQueue[currentTrainingIndex];
        const expectedMove = currentSequence.moves[currentSequence.currentMoveIndex];

        if (selectedSquare) {
            const move = { from: selectedSquare, to: square };
            const result = gameStateRef.current.chess.move(move);

            if (result) {
                if (result.from === expectedMove.from && result.to === expectedMove.to) {
                    currentSequence.currentMoveIndex++;
                    setShowErrorMessage(false);
                    setSelectedSquare(null);
                    proceedToNextExpectedMove(currentSequence);
                } else {
                    setShowErrorMessage(true);
                    gameStateRef.current.chess.undo();
                    setSelectedSquare(null);
                }
            } else {
                setShowErrorMessage(true);
                setSelectedSquare(null);
            }

            setUpdateTrigger((prev) => prev + 1);
            setCurrentPosition(gameStateRef.current.getCurrentFen());
        } else {
            const piece = gameStateRef.current.chess.get(square);
            if (piece && piece.color === selectedColor[0]) {
                setSelectedSquare(square);
            }
        }
    };

    const proceedToNextExpectedMove = () => {
        const currentSequence = trainingQueue[currentTrainingIndex];

        if (!currentSequence || !currentSequence.moves) {
            console.warn('Failed to get current training sequence');
            return;
        }

        if (currentSequence.currentMoveIndex >= currentSequence.moves.length) {
            setCurrentTrainingIndex((prevIndex) => prevIndex + 1);
            return;
        }

        const turn = gameStateRef.current.chess.turn();
        if (turn !== selectedColor[0]) {
            const expectedMove = currentSequence.moves[currentSequence.currentMoveIndex];
            if (expectedMove && expectedMove.color === turn) {
                gameStateRef.current.chess.move(expectedMove);
                gameStateRef.current.currentMoveNode =
                    gameStateRef.current.currentMoveNode.next ||
                    gameStateRef.current.currentMoveNode.variations.find(
                        (v) => v.move.san === expectedMove.san
                    );
                currentSequence.currentMoveIndex++;
                setUpdateTrigger((prev) => prev + 1);
                setCurrentPosition(gameStateRef.current.getCurrentFen());

                proceedToNextExpectedMove(); 
            }
        }

        updateExpectedMoveArrow(); 
    };

    const updateExpectedMoveArrow = () => {
        const currentSequence = trainingQueue[currentTrainingIndex];

        if (currentSequence && currentSequence.moves[currentSequence.currentMoveIndex]) {
            const expectedMove = currentSequence.moves[currentSequence.currentMoveIndex];
            const moveKey = `${expectedMove.from}-${expectedMove.to}`;

            
            if (!shownMoves.has(moveKey)) {
                setArrows([[expectedMove.from, expectedMove.to]]); 

                
                setShownMoves((prevShownMoves) => new Set(prevShownMoves).add(moveKey));
            } else {
               
                setArrows([]);
            }
        } else {
            
            setArrows([]);
        }
    };

    useEffect(() => {
        if (isTrainingMode) {
            updateExpectedMoveArrow();
        }
    }, [currentTrainingIndex, trainingQueue, isTrainingMode]);

    useEffect(() => {
        if (loadedPgn) {
            console.log('Game component loading PGN:', loadedPgn);
            gameStateRef.current.loadFromPgn(loadedPgn);
            setUpdateTrigger((prev) => prev + 1);
            setCurrentPosition(gameStateRef.current.getCurrentFen());
        }
    }, [loadedPgn]);

   

    useEffect(() => {
        if (isTrainingMode) {
            gameStateRef.current.selectedSquare = selectedSquare;
            gameStateRef.current.updatePossibleMoves();
            setUpdateTrigger((prev) => prev + 1);
        }
    }, [selectedSquare]);

    const loadPgn = (pgnString) => {
        gameStateRef.current.loadFromPgn(pgnString);
        setCurrentPgn(pgnString);
        if (onPgnLoad) {
            onPgnLoad(pgnString);
        }
    };

    return (
        <div className="game" style={{ position: 'relative' }}>
            {showMoveTree && (
                <div className="left-notation-section">
                    <MoveTree
                        rootNode={gameStateRef.current.root}
                        currentMoveNode={gameStateRef.current.currentMoveNode}
                        goToMove={goToMove}
                    />
                </div>
            )}
            <div className="board-section" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                {/* */}
                {isTrainingMode && startTraining && (
                    <div
                        style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            width: '100%',
                            padding: '0 20px',
                            marginBottom: '10px',
                        }}
                    >
                        {/*  */}
                        <div style={{ flex: '1', textAlign: 'left', fontWeight: 'bold' }}>
                            <p>
                                {t('trainingSequence', {
                                    current: currentTrainingIndex + 1,
                                    total: trainingQueue.length,
                                })}
                            </p>
                        </div>

                        {/*  */}
                        {showErrorMessage && (
                            <div
                                className="error-message"
                                style={{
                                    flex: '1',
                                    textAlign: 'right',
                                    color: 'red',
                                    fontWeight: 'bold',
                                }}
                            >
                                {t('incorrectMove')}{' '}
                                <span>
                                    {t('expectedMove', {
                                        move:
                                            trainingQueue[currentTrainingIndex]?.moves[
                                                trainingQueue[currentTrainingIndex]?.currentMoveIndex
                                            ]?.san,
                                    })}
                                </span>
                            </div>
                        )}
                    </div>
                )}

                <div style={{ marginBottom: '20px' }}>
                    <Chessboard
                        boardWidth={700}
                        position={currentPosition}
                        onPieceDrop={isTrainingMode ? onDropTraining : onDrop}
                        onSquareClick={isTrainingMode ? onClickTraining : onClick}
                        draggable={true}
                        customSquareStyles={gameStateRef.current.getPossibleMoves()}
                        autoPromoteToQueen={true}
                        boardOrientation={boardOrientation}
                        animationDuration={animationsEnabled ? 300 : 0}
                        customArrows={arrows}
                        onPieceDragBegin={onDragBegin}
                    />
                </div>
                {engineEnabled && (
                    <div className="engine-controls" style={{ marginBottom: '10px' }}>
                        <button onClick={decreaseLines}>-</button>
                        <span>
                            {t('engineLines')}: {numLines}
                        </span>
                        <button onClick={increaseLines}>+</button>
                    </div>
                )}
                {showPgnControls && (
                    <div style={{ marginTop: '20px' }}>
                        <Moves
                            loadPgn={loadPgn}
                            getPgn={() => gameStateRef.current.getPgn()}
                            currentPgn={currentPgn}
                            onPgnChange={(newPgn) => setCurrentPgn(newPgn)}
                        />
                    </div>
                )}
            </div>
            <div className="notation-evaluation-section">
                <div className="evaluation-container">
                    <div className="evaluation-display">
                        <h3>{t('evaluation')}</h3>
                        {evaluation !== null ? `${evaluation}` : t('loading')}
                    </div>

                    <div className="variations">
                        <h3>{t('variations')}</h3>
                        {variations.map((variation, index) => (
                            <div key={index} className="variation">
                                <span>{variation.score}:</span>
                                {renderVariationMoves(variation)}
                            </div>
                        ))}
                    </div>
                </div>

                <div className="notation-section">
                    <Notation
                        rootNode={gameStateRef.current.root}
                        currentMoveNode={gameStateRef.current.currentMoveNode}
                        goToMove={goToMove}
                        isPuzzleMode={isPuzzleMode}
                    />
                </div>
            </div>
            {isPuzzleMode && <div className="puzzle-status"></div>}
            {showPromotionDialog && (
                <div
                    style={{
                        position: 'absolute',
                        top: promotionDialogPosition.y,
                        left: promotionDialogPosition.x,
                        zIndex: 10,
                    }}
                >
                    <PromotionDialog
                        color={gameStateRef.current.chess.turn()}
                        onSelect={handlePromotion}
                    />
                </div>
            )}
        </div>
    );
;


});


export default Game;
