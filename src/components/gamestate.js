// File: /mnt/data/gamestate.js

import { Chess } from 'chess.js';
import PgnReader from './pgnReader';
import MoveNode from './movenode';

function printNode(node) {
  if (!node) return null;

  const { id, san, fen, moveNumber, variations, next } = node;
  return {
    id,
    san,
    fen,
    moveNumber,
    variations: variations ? variations.map(printNode) : [],
    next: next ? printNode(next) : null,
  };
}

class GameState {
  constructor(previousState = null, isPuzzleMode = false, onUpdate = null) {
    if (previousState) {
      
      this.chess = previousState.chess;
      this.root = previousState.root;
      this.currentMoveNode = previousState.currentMoveNode;
      this.selectedSquare = previousState.selectedSquare;
      this.possibleMoves = previousState.possibleMoves;
      this.pgnReader = previousState.pgnReader;
      this.currentMoveIndex = previousState.currentMoveIndex;
      this.isPuzzleMode = previousState.isPuzzleMode;
      this.solutionMoves = previousState.solutionMoves;
      this.currentSolutionIndex = previousState.currentSolutionIndex;
      this.isPuzzleSolved = previousState.isPuzzleSolved;
      this.isPuzzleFailed = previousState.isPuzzleFailed;
    } else {
      this.chess = new Chess();
      this.root = new MoveNode(null, this.chess.fen(), null);
      this.currentMoveNode = this.root;
      this.selectedSquare = null;
      this.possibleMoves = {};
      this.pgnReader = new PgnReader();
      this.currentMoveIndex = -1;
      this.isPuzzleMode = isPuzzleMode;
      this.solutionMoves = [];
      this.currentSolutionIndex = 0;
      this.isPuzzleSolved = false;
      this.isPuzzleFailed = false;
    }
    this.onUpdate = onUpdate;
    this.initialOpponentMoveMade = false; 
  }

  setInitialPosition(fen) {
    this.chess.load(fen);
    this.root = new MoveNode(null, fen, null);
    this.currentMoveNode = this.root;
    this.updatePossibleMoves();
  }

  setSolutionMoves(movesUciString) {
    if (movesUciString) {
      this.solutionMoves = movesUciString.trim().split(' ');
      this.currentSolutionIndex = 0;
    } else {
      this.solutionMoves = [];
      this.currentSolutionIndex = 0;
    }
    this.initialOpponentMoveMade = false; 
  }

  makeInitialOpponentMove() {
    if (this.isPuzzleMode && this.currentSolutionIndex < this.solutionMoves.length) {
      this._makeOpponentMove();
    }
  }

  _findExistingNode(move) {
    if (this.currentMoveNode.next && this.currentMoveNode.next.san === move.san) {
      return this.currentMoveNode.next;
    }
    return this.currentMoveNode.variations.find((v) => v.san === move.san);
  }

  onDrop(sourceSquare, targetSquare) {
    if (this.isPuzzleMode) {
      const move = {
        from: sourceSquare,
        to: targetSquare,
      };

      const possibleMoves = this.chess.moves({ verbose: true });
      const isLegalMove = possibleMoves.some(
        (m) => m.from === sourceSquare && m.to === targetSquare
      );

      if (!isLegalMove) {
        
        return false;
      }

      const expectedMoveUci = this.solutionMoves[this.currentSolutionIndex];

      if (!expectedMoveUci) {
        
        this.selectedSquare = null;
        this.updatePossibleMoves();
        return false;
      }

      const moveUci = `${sourceSquare}${targetSquare}`;

      if (moveUci !== expectedMoveUci.substring(0, 4)) {
       
        this.isPuzzleFailed = true;

        
        this._addRemainingSolutionMoves();

        return true; 
      }

     
      if (expectedMoveUci.length > 4) {
        move.promotion = expectedMoveUci[4];
      }

      const result = this.chess.move(move);

      if (result === null) {
        
        return false;
      }

      this._updateGameStateAfterMove(result);
      this.currentSolutionIndex++;

      if (this.currentSolutionIndex >= this.solutionMoves.length) {
        this.isPuzzleSolved = true;
      } else {
       
        this._makeOpponentMove();
      }

      return true;
    } else {
     
      const moveRequiresPromotion = this.chess.moves({ verbose: true }).some(
        (move) =>
          move.from === sourceSquare && move.to === targetSquare && move.flags.includes('p')
      );

      if (moveRequiresPromotion) {
        this.promotionOptions = { from: sourceSquare, to: targetSquare };
        return 'promotion'; 
      }

      const move = this.chess.move({
        from: sourceSquare,
        to: targetSquare,
      });

      if (move === null) {
        return false; 
      }

      this._updateGameStateAfterMove(move);
      return true;
    }
  }

  onClick(square) {
    if (this.isPuzzleMode) {
      if (this.selectedSquare) {
        if (square === this.selectedSquare) {
          this.selectedSquare = null;
          this.updatePossibleMoves();
          return true;
        }

        const move = {
          from: this.selectedSquare,
          to: square,
        };

        const possibleMoves = this.chess.moves({ verbose: true });
        const isLegalMove = possibleMoves.some(
          (m) => m.from === move.from && m.to === move.to
        );

        if (!isLegalMove) {
         
          this.selectedSquare = null;
          this.updatePossibleMoves();
          return true;
        }

        const expectedMoveUci = this.solutionMoves[this.currentSolutionIndex];

        if (!expectedMoveUci) {
          this.selectedSquare = null;
          this.updatePossibleMoves();
          return false;
        }

        const moveUci = `${move.from}${move.to}`;

        if (moveUci !== expectedMoveUci.substring(0, 4)) {
          this.isPuzzleFailed = true;
          this._addRemainingSolutionMoves();
          setTimeout(() => {
          }, 0);
          this.selectedSquare = null;
          this.updatePossibleMoves();
          this.updatePgn();
          return true; 
        }

       
        if (expectedMoveUci.length > 4) {
          move.promotion = expectedMoveUci[4];
        }

        const result = this.chess.move(move);

        if (result === null) {
          
          this.selectedSquare = null;
          this.updatePossibleMoves();
          return true;
        }

        this._updateGameStateAfterMove(result);
        this.selectedSquare = null;
        this.updatePossibleMoves();
        this.currentSolutionIndex++;

        if (this.currentSolutionIndex >= this.solutionMoves.length) {
          this.isPuzzleSolved = true;
        } else {
          
          this._makeOpponentMove();
        }

        return true;
      } else {
        const piece = this.chess.get(square);
        if (piece && piece.color === this.chess.turn()) {
          this.selectedSquare = square;
          this.updatePossibleMoves();
        }
        return true;
      }
    } else {
      
      if (this.selectedSquare) {
        const move = {
          from: this.selectedSquare,
          to: square,
        };

        const result = this.chess.move(move);

        if (result === null) {
          this.selectedSquare = null;
          this.updatePossibleMoves();
          return false;
        }

        this._updateGameStateAfterMove(result);
        this.selectedSquare = null;
        this.updatePossibleMoves();
        return true;
      } else {
        const piece = this.chess.get(square);
        if (piece && piece.color === this.chess.turn()) {
          this.selectedSquare = square;
          this.updatePossibleMoves();
        }
        return true;
      }
    }
  }
    promote(piece, options) {
        const { from, to } = options;

        const move = {
            from,
            to,
            promotion: piece, 
        };

        const result = this.chess.move(move);

        if (result === null) {
            
            console.error('Invalid promotion move');
            return;
        }

        this._updateGameStateAfterMove(result);

       
        if (this.isPuzzleMode) {
            this.currentSolutionIndex++;

            if (this.currentSolutionIndex >= this.solutionMoves.length) {
                this.isPuzzleSolved = true;
            } else {
               
                this._makeOpponentMove();
            }
        }
    }

  _makeOpponentMove() {
    if (this.currentSolutionIndex < this.solutionMoves.length) {
      const expectedMoveUci = this.solutionMoves[this.currentSolutionIndex];
      const move = this.chess.move(expectedMoveUci, { sloppy: true });
      if (move) {
        this._updateGameStateAfterMove(move);
        this.currentSolutionIndex++;
      } else {
        
        this.isPuzzleFailed = true;
      }
    }
  }

  _addRemainingSolutionMoves() {
    const remainingMovesUci = this.solutionMoves.slice(this.currentSolutionIndex);
    const sanMoves = [];

    const tempChess = new Chess(this.chess.fen());

    remainingMovesUci.forEach((uciMove) => {
      const move = tempChess.move(uciMove, { sloppy: true });
      if (move) {
        sanMoves.push(move.san);
      }
    });

    if (sanMoves.length > 0) {
      this.addVariation(sanMoves, this.currentMoveNode);
    }

   
    this.updatePgn();
    this.chess.load(this.currentMoveNode.fen);
    this.updatePossibleMoves();
    if (this.onUpdate) {
      this.onUpdate();
    }
  }

  _updateGameStateAfterMove(move) {
    let existingMoveNode = this._findExistingNode(move);

    if (existingMoveNode) {
      this.currentMoveNode = existingMoveNode;
    } else {
      let parentNode = this.currentMoveNode;
      let lastMoveColor = parentNode.move ? parentNode.move.color : 'b';
      let moveNumber = parentNode.moveNumber || 0;

     
      if (move.color === 'w' && lastMoveColor === 'b') {
        moveNumber += 1;
      } else {
        moveNumber = parentNode.moveNumber || 1;
      }

      
      const newNode = new MoveNode(move.san, this.chess.fen(), move, parentNode, moveNumber);

      if (!parentNode.next) {
        parentNode.next = newNode;
      } else {
        parentNode.variations.push(newNode);
      }

      this.currentMoveNode = newNode;
    }

    this.selectedSquare = null;
    this.updatePossibleMoves();
    this.syncPgnReader();
    this.updatePgn();
  }

  addVariation(sanMoves, parentNode = this.currentMoveNode) {
    const chess = new Chess();
    chess.load(parentNode.fen);

    let currentNode = parentNode;
    let lastMoveColor = parentNode.move ? parentNode.move.color : 'b';
    let moveNumber = parentNode.moveNumber || 0;

    sanMoves.forEach((san) => {
      const move = chess.move(san);
      if (move) {
        let existingNode = this._findExistingNodeAtNode(move, currentNode);

        if (existingNode) {
          currentNode = existingNode;
        } else {
          if (move.color === 'w' && lastMoveColor === 'b') {
            moveNumber += 1;
          }

          const newNode = new MoveNode(move.san, chess.fen(), move, currentNode, moveNumber);

          if (!currentNode.next) {
            currentNode.next = newNode;
          } else {
            currentNode.variations.push(newNode);
          }

          currentNode = newNode;
        }

        lastMoveColor = move.color;
      } else {
        
      }
    });

    this.currentMoveNode = currentNode;
    this.chess.load(chess.fen());
    this.updatePossibleMoves();
    this.updatePgn();
  }

  _findExistingNodeAtNode(move, node) {
    if (node.next && node.next.san === move.san) {
      return node.next;
    }
    return node.variations.find((v) => v.san === move.san);
  }

  syncPgnReader() {
    this.pgnReader.root = this.root;
  }

  updatePossibleMoves() {
    this.possibleMoves = {};
    if (this.selectedSquare) {
      const moves = this.chess.moves({ square: this.selectedSquare, verbose: true });
      moves.forEach((move) => {
        this.possibleMoves[move.to] = {
          background: 'radial-gradient(circle, rgba(144, 238, 144, 0.6) 25%, transparent 30%)',
          borderRadius: '50%',
        };
      });
      this.possibleMoves[this.selectedSquare] = {
        background: 'rgba(255, 255, 0, 0.4)',
      };
    }
  }

  getPossibleMoves() {
    return this.possibleMoves;
  }

  getCurrentFen() {
    return this.chess.fen();
  }

  getPgn() {
    return this.pgnReader.generatePgn();
  }

  getNotation() {
    let moves = [];
    let currentNode = this.root;
    let moveNumber = 1;
    let turn = 'w';

    const traverse = (node, variationLevel = 0) => {
      if (!node) return;

      if (node !== this.root) {
        const actualMoveNumber = turn === 'w' ? moveNumber : moveNumber;
        moves.push({
          san: node.san,
          fen: node.fen,
          moveNumber: actualMoveNumber,
          color: node.move.color,
          variations: node.variations.map(printNode),
          moveIndex: moves.length,
          variationLevel,
        });

        if (turn === 'b') {
          moveNumber++;
        }
        turn = turn === 'w' ? 'b' : 'w';
      }

      node.variations.forEach((variation) => {
        traverse(variation, variationLevel + 1);
      });

      if (node.next) {
        traverse(node.next, variationLevel);
      }
    };

    traverse(this.root);
    return moves;
  }

  goToMove(targetNode) {
    this.chess.load(this.root.fen);

    const path = [];
    let node = targetNode;
    while (node && node !== this.root) {
      path.push(node);
      node = node.prev;
    }
    path.reverse();

   
    if (this.isPuzzleMode) {
      this.currentSolutionIndex = path.length;
    }

    path.forEach((moveNode) => {
      this.chess.move(moveNode.move);
    });

    this.currentMoveNode = targetNode;
    this.updatePossibleMoves();
  }

  loadFromPgn(pgnString) {
    try {
      this.pgnReader.loadPgn(pgnString);
      
      this.root = this.pgnReader.root;
      this.currentMoveNode = this._getLastMainlineNode();

      
      this.chess.reset();
      this.chess.load(this.currentMoveNode.fen);

      this.updatePossibleMoves();
    } catch (error) {
     
    }
    this.updatePgn();
  }

  _getLastMainlineNode() {
    let node = this.root;
    while (node.next) {
      node = node.next;
    }
    return node;
  }

  updatePgn() {
    
    const newPgn = this.pgnReader.generatePgnFromNotation(this.root);
    
    this.currentPgn = newPgn;
    
  }




getTrainingSequences(color) {
  const sequences = [];

  const traverse = (node, path) => {
    if (!node) return;

   
    const newPath = node.move ? [...path, node] : path;

    if (node.move && node.move.color === color[0]) {
      sequences.push({
        moves: newPath.map(n => n.move),
        currentMoveIndex: 0,
        nodePath: newPath,
      });
    }

    
    if (node.next) {
      traverse(node.next, newPath);
    }

    
    if (node.variations && node.variations.length > 0) {
      node.variations.forEach(variationNode => {
        traverse(variationNode, newPath);
      });
    }
  };

 
  if (this.root.next) {
    traverse(this.root.next, []);
  }

  return sequences;
}






  resetToRoot() {
    this.chess.load(this.root.fen);
    this.currentMoveNode = this.root;
    this.updatePossibleMoves();
  }

  generatePgn() {
    return this.pgnReader.generatePgn();
  }

  _getExpectedMoveSan() {
    if (this.currentSolutionIndex < this.solutionMoves.length) {
      const expectedMoveUci = this.solutionMoves[this.currentSolutionIndex];
      const tempChess = new Chess(this.chess.fen());
      const move = tempChess.move(expectedMoveUci, { sloppy: true });
      if (move) {
        return move.san;
      }
    }
    return 'неизвестно';
  }

  getExpectedMoves(color) {
    const expectedMoves = [];
    const nodesToCheck = [];

    if (this.currentMoveNode.next) {
      nodesToCheck.push(this.currentMoveNode.next);
    }
    if (this.currentMoveNode.variations) {
      nodesToCheck.push(...this.currentMoveNode.variations);
    }

    for (const node of nodesToCheck) {
      if (node.move.color === color) {
        expectedMoves.push(node);
      }
    }

    return expectedMoves;
  }

 
  resetToRoot() {
    this.chess.load(this.root.fen);
    this.currentMoveNode = this.root;
    this.updatePossibleMoves();
  }
  clearSelection() {
    this.selectedSquare = null;
    this.possibleMoves = {};
  }
}

export default GameState;
