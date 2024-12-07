// File: /mnt/data/notation.js
import React from 'react';

function Notation({ rootNode, currentMoveNode, goToMove, isPuzzleMode = false }) {
  function renderMoves(
    node,
    variationLevel = 0,
    moveNumber = 1,
    lastMoveColor = 'b',
    pendingVariations = []
  ) {
    const elements = [];

    if (!node) {
      if (pendingVariations.length > 0) {
        elements.push(...renderPendingVariations(pendingVariations));
        pendingVariations.length = 0;
      }
      return elements;
    }

    const isWhiteMove = node.move.color === 'w';
    let displayedMoveNumber = '';

    if (isPuzzleMode) {
      
      const isFirstMove =
        node.prev === null || node.prev === undefined || node.prev === rootNode;
      if (isFirstMove && node.move.color === 'b') {
        displayedMoveNumber = `${moveNumber}... `;
      } else if (isWhiteMove && lastMoveColor === 'b') {
        displayedMoveNumber = `${moveNumber}. `;
      } else if (!isWhiteMove && lastMoveColor === 'w') {
        displayedMoveNumber = `${moveNumber}... `;
      }
    } else {
    
      if (isWhiteMove && lastMoveColor === 'b') {
        displayedMoveNumber = `${moveNumber}. `;
      } else if (!isWhiteMove && lastMoveColor === 'w') {
        const prevMove = node.prev;
        if (!prevMove || prevMove.move.color === 'b' || variationLevel > 0) {
          displayedMoveNumber = `${moveNumber}... `;
        }
      }
    }

    const moveText = `${displayedMoveNumber}${node.san} `;

    elements.push(
      <span
        key={`move-${node.id}`}
        className={`move-text ${
          node === currentMoveNode ? 'selected-move' : ''
        } variation-level-${variationLevel}`}
        onClick={() => goToMove(node)}
      >
        {moveText}
      </span>
    );

 
    if (
      pendingVariations.length > 0 &&
      node.move.color === pendingVariations[0].opponentColor
    ) {
      elements.push(...renderPendingVariations(pendingVariations));
      pendingVariations.length = 0;
    }

    
    if (node.variations.length > 0) {
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
      elements.push(
        ...renderMoves(
          node.next,
          variationLevel,
          nextMoveNumber,
          node.move.color,
          pendingVariations
        )
      );
    } else {
      if (pendingVariations.length > 0) {
        elements.push(...renderPendingVariations(pendingVariations));
        pendingVariations.length = 0;
      }
    }

    return elements;
  }

  function renderPendingVariations(pendingVariations) {
    const elements = [];
    pendingVariations.forEach(
      ({ node, variationLevel, moveNumber, lastMoveColor }, index) => {
        node.variations.forEach((variationNode, varIndex) => {
          elements.push(
            <span
              key={`variation-start-${node.id}-${varIndex}`}
              className="variation-start"
            >
              (
            </span>
          );

          const variationMoveNumber =
            node.move.color === 'b' ? moveNumber + 1 : moveNumber;
          const variationLastMoveColor = node.move.color;

          elements.push(
            ...renderMoves(
              variationNode,
              variationLevel + 1,
              variationMoveNumber,
              variationLastMoveColor
            )
          );

          elements.push(
            <span
              key={`variation-end-${node.id}-${varIndex}`}
              className="variation-end"
            >
              ){node.next ? ' ' : ''}
            </span>
          );
        });
      }
    );
    return elements;
  }

  return <div className="notation">{renderMoves(rootNode)}</div>;
}

export default Notation;
