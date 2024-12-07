import React from 'react';
import { svgPieces } from '../media/pieces'; 

function PromotionDialog({ color, onSelect }) {
  const promotionTypes = ['q', 'r', 'b', 'n'];

  const promotionPieces = promotionTypes.map((type) => {
    const pieceKey = color + type.toUpperCase();
    const pieceSvg = svgPieces[pieceKey];
    return {
      type,
      piece: pieceSvg,
    };
  });

  return (
    <div className="promotion-dialog">
      <h3></h3>
      <div className="promotion-options">
        {promotionPieces.map((piece) => (
          <button key={piece.type} onClick={() => onSelect(piece.type)} className="promotion-button">
            {piece.piece} {/*  */}
          </button>
        ))}
      </div>
    </div>
  );
}

export default PromotionDialog;
