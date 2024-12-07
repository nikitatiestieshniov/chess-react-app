// File: /mnt/data/engine.js

import { useState, useEffect, useRef } from 'react';
import { Chess } from 'chess.js';

export default function useEngine(gameStateRef, engineEnabled, currentPosition) {
  const [evaluation, setEvaluation] = useState(null);
  const [variations, setVariations] = useState([]);
  const [numLines, setNumLines] = useState(1);
  const stockfishWorker = useRef(null);

  const evaluatePosition = () => {
    if (stockfishWorker.current) {
      setVariations([]); 
      const currentFen = gameStateRef.current.getCurrentFen(); 
      stockfishWorker.current.postMessage(`position fen ${currentFen}`);
      stockfishWorker.current.postMessage("go depth 20");
    }
  };

  useEffect(() => {
    if (!engineEnabled) {
      if (stockfishWorker.current) {
        stockfishWorker.current.postMessage('stop');
        stockfishWorker.current.terminate();
        stockfishWorker.current = null;
      }
      setEvaluation(null);
      setVariations([]);
      return;
    }

    stockfishWorker.current = new Worker("./stockfish.js");
    stockfishWorker.current.postMessage("uci");
    stockfishWorker.current.postMessage("isready");

    stockfishWorker.current.onmessage = (event) => {
      const message = event.data;

      if (message.includes("info depth")) {
        let match = message.match(/info .*\bdepth (\d+) .*\bmultipv (\d+) .*score (cp|mate) (-?\d+) .*pv (.+)/);
        if (match) {
          let depth = parseInt(match[1], 10);
          let multipv = parseInt(match[2], 10);
          let scoreType = match[3];
          let scoreValue = parseInt(match[4], 10);
          let pv = match[5];

          let score;
          if (scoreType === 'cp') {
            score = (scoreValue / 100).toFixed(2);
          } else if (scoreType === 'mate') {
            score = `#${scoreValue}`;
          }

          
          const currentFen = gameStateRef.current.getCurrentFen();
          const chess = new Chess(currentFen);
          const uciMoves = pv.split(' ');
          const sanMoves = [];
          for (let uciMove of uciMoves) {
            const move = chess.move(uciMove, { sloppy: true });
            if (move === null) {
              console.error("Invalid move", uciMove);
              break;
            }
            sanMoves.push(move.san);
          }
          const sanPv = sanMoves.join(' ');

          setVariations(prevVariations => {
            let newVariations = [...prevVariations];
            newVariations[multipv - 1] = { depth, score, pv: sanPv };
            return newVariations;
          });

          if (multipv === 1) {
            setEvaluation(score);
          }
        }
      }

      if (message.includes("bestmove")) {
        console.log("Best move:", message);
      }
      if (message === "readyok") {
        console.log("Stockfish is ready.");
        if (numLines > 0) {
          stockfishWorker.current.postMessage(`setoption name MultiPV value ${numLines}`);
          evaluatePosition(); 
        }
      }
    };

    return () => {
      if (stockfishWorker.current) {
        stockfishWorker.current.terminate();
        stockfishWorker.current = null;
      }
    };
  }, [engineEnabled, currentPosition]); 

  useEffect(() => {
    if (engineEnabled) {
      evaluatePosition();
    }
  }, [currentPosition, engineEnabled]); 

 
  const increaseLines = () => {
    if (numLines < 3) {
      const newNumLines = numLines + 1;
      setNumLines(newNumLines);
      if (stockfishWorker.current) {
        stockfishWorker.current.postMessage(`setoption name MultiPV value ${newNumLines}`);
        evaluatePosition();
      }
    }
  };

  const decreaseLines = () => {
    if (numLines > 1) {
      const newNumLines = numLines - 1;
      setNumLines(newNumLines);
      if (stockfishWorker.current) {
        stockfishWorker.current.postMessage(`setoption name MultiPV value ${newNumLines}`);
        evaluatePosition();
      }
    } else if (numLines === 1) {
      setNumLines(0);
      if (stockfishWorker.current) {
        stockfishWorker.current.postMessage("stop");
      }
    }
  };

  return {
    evaluation,
    variations,
    numLines,
    increaseLines,
    decreaseLines,
  };
}
