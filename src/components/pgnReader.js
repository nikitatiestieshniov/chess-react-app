// Файл: pgnReader.js
import { parse } from '@mliebelt/pgn-parser';
import MoveNode from './movenode';
import { Chess } from 'chess.js';

class PgnReader {
  constructor() {
    this.chess = new Chess();
    this.root = new MoveNode(null, this.chess.fen(), null); 
  }

  loadPgn(pgnString) {

    const parsedGames = parse(pgnString);

    if (!parsedGames || parsedGames.length === 0 || !parsedGames[0].moves) {
      return;
    }

    const moves = parsedGames[0].moves;

    this.chess.reset();
    const rootNode = new MoveNode(null, this.chess.fen(), null, null);
    this._buildMoveTree(moves, rootNode);
    this.root = rootNode;

  }

  generatePgn() {
    const tags = `[Event "My Game"]
[Site "?"]
[Date "2023.01.01"]
[Round "1"]
[White "White Player"]
[Black "Black Player"]
[Result "*"]`;

    const movesPgn = this.generatePgnFromNotation(this.root); 
    return tags + '\n\n' + movesPgn;
  }

  generatePgnFromNotation(node) {
    let pgn = '';
  
    const traverse = (node, variationLevel = 0, moveNumber = 1, lastMoveColor = 'b', pendingVariations = []) => {
      if (!node) {
        
        if (pendingVariations.length > 0) {
          pgn += generatePendingVariations(pendingVariations);
          pendingVariations.length = 0;
        }
        return;
      }
  
     if (node !== this.root && node.san) {
      const isWhiteMove = node.move.color === 'w';
      if (isWhiteMove && lastMoveColor === 'b') {
        pgn += `${moveNumber}. `;
      
      }else if (!isWhiteMove && lastMoveColor === 'w') {
        
        const previousMove = node.prev;
        if (previousMove && previousMove.san) {

          const previousMoveIndex = pgn.lastIndexOf(previousMove.san);
          
          const pgnAfterPreviousMove = pgn.substring(previousMoveIndex + previousMove.san.length).trim();
          const previousMoveHasBrackets = pgnAfterPreviousMove.startsWith('(') && pgnAfterPreviousMove.includes(')');

          if (previousMoveHasBrackets) {
            pgn += `${moveNumber}... `;
          }
        }
      }
      
      
      

      pgn += `${node.san} `;
      
        if (pendingVariations.length > 0 && node.move.color === pendingVariations[0].opponentColor) {
          pgn += generatePendingVariations(pendingVariations);
          pendingVariations.length = 0; 
        }
      }
  
     
      if (node.variations && node.variations.length > 0) {
        const opponentColor = node.move.color === 'w' ? 'b' : 'w';
        pendingVariations.push({
          node,
          variationLevel,
          moveNumber,
          lastMoveColor,
          opponentColor,
        });
      }
  
      
      if (node.next) {
        const nextMoveNumber = node.move.color === 'b' ? moveNumber + 1 : moveNumber;
        traverse(node.next, variationLevel, nextMoveNumber, node.move.color, pendingVariations);
      } else {
        
        if (pendingVariations.length > 0) {
          pgn += generatePendingVariations(pendingVariations);
          pendingVariations.length = 0;
        }
      }
    };
  
    const generatePendingVariations = (pendingVariations) => {
      let variationsPgn = '';
      pendingVariations.forEach(({ node, variationLevel, moveNumber, lastMoveColor }) => {
        node.variations.forEach((variationNode) => {
          variationsPgn += '(';
  
          
          const variationMoveNumber = node.move.color === 'b' ? moveNumber + 1 : moveNumber;
          const variationLastMoveColor = node.move.color;
  
          variationsPgn += traverseVariation(
            variationNode,
            variationLevel + 1,
            variationMoveNumber,
            variationLastMoveColor
          );
  
          variationsPgn += ') ';
        });
      });
      return variationsPgn;
    };
  
    const traverseVariation = (node, variationLevel, moveNumber, lastMoveColor) => {
      if (!node) return '';
  
      let variationPgn = '';
      let pendingVariations = [];
  
      const traverseVar = (node, variationLevel, moveNumber, lastMoveColor, pendingVariations) => {
        if (!node) {
          if (pendingVariations.length > 0) {
            variationPgn += generatePendingVariations(pendingVariations);
            pendingVariations.length = 0;
          }
          return;
        }
  
        if (node.san) {
          const isWhiteMove = node.move.color === 'w';
          if (isWhiteMove && lastMoveColor === 'b') {
            variationPgn += `${moveNumber}. `;
          } else if (!isWhiteMove && lastMoveColor === 'w') {
            variationPgn += `${moveNumber}... `;
          }
  
          variationPgn += `${node.san} `;
  
          
          if (pendingVariations.length > 0 && node.move.color === pendingVariations[0].opponentColor) {
            variationPgn += generatePendingVariations(pendingVariations);
            pendingVariations.length = 0;
          }
        }
  
       
        if (node.variations && node.variations.length > 0) {
          const opponentColor = node.move.color === 'w' ? 'b' : 'w';
          pendingVariations.push({
            node,
            variationLevel,
            moveNumber,
            lastMoveColor,
            opponentColor,
          });
        }
  
       
        if (node.next) {
          const nextMoveNumber = node.move.color === 'b' ? moveNumber + 1 : moveNumber;
          traverseVar(node.next, variationLevel, nextMoveNumber, node.move.color, pendingVariations);
        } else {
          if (pendingVariations.length > 0) {
            variationPgn += generatePendingVariations(pendingVariations);
            pendingVariations.length = 0;
          }
        }
      };
  
      const generatePendingVariations = (pendingVariations) => {
        let variationsPgn = '';
        pendingVariations.forEach(({ node, variationLevel, moveNumber, lastMoveColor }) => {
          node.variations.forEach((variationNode) => {
            variationsPgn += '(';
  
            const variationMoveNumber = node.move.color === 'b' ? moveNumber + 1 : moveNumber;
            const variationLastMoveColor = node.move.color;
  
            variationsPgn += traverseVariation(
              variationNode,
              variationLevel + 1,
              variationMoveNumber,
              variationLastMoveColor
            );
  
            variationsPgn += ') ';
          });
        });
        return variationsPgn;
      };
  
      traverseVar(node, variationLevel, moveNumber, lastMoveColor, pendingVariations);
  
      return variationPgn;
    };
  
    
    traverse(node);
  
    return pgn.trim();
  }
  


  _buildMoveTree(moveArray, parentNode) {
    moveArray.forEach((moveData) => {

      const san = moveData.notation.notation;
      const move = this.chess.move(san);

      if (move) {
       
        let moveNumber;
        if (move.color === 'w') {
          moveNumber =
            parentNode.moveNumber + (parentNode.move && parentNode.move.color === 'b' ? 1 : 0);
        } else {
          moveNumber = parentNode.moveNumber;
        }

        const moveNode = new MoveNode(move.san, this.chess.fen(), move, parentNode, moveNumber);
        moveNode.prev = parentNode;

        if (!parentNode.next) {
          parentNode.next = moveNode;
        } else {
          
          parentNode.variations.push(moveNode);
        }


        
        if (Array.isArray(moveData.variations)) {
          moveData.variations.forEach((variationMovesArray, varIndex) => {

           
            const savedChess = this.chess.fen();

            this.chess.load(parentNode.fen);

            const variationParentNode = parentNode;

            this._buildMoveTree(variationMovesArray, variationParentNode);

            this.chess.load(savedChess);
          });
        }

        parentNode = moveNode;
      } else {
      }
    });
  }
}

export default PgnReader;