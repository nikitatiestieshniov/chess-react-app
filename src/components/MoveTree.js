// Файл: MoveTree.js
import React, { useState } from 'react';

function MoveTree({ rootNode, currentMoveNode, goToMove }) {
  const [expandedNodes, setExpandedNodes] = useState({});

  const toggleNode = (nodeId) => {
    setExpandedNodes((prev) => ({
      ...prev,
      [nodeId]: !prev[nodeId],
    }));
  };

  const renderNode = (node, depth = 0, moveNumber = 0, lastMoveColor = 'b', isVariation = false) => {
    if (!node) return null;

    const isCurrent = node === currentMoveNode;
    const isExpanded = expandedNodes[node.id];

    
    const hasChildren = (node.next || (node.variations && node.variations.length > 0));

    
    let displayMoveNumber = '';
    if (node.move && node.move.color === 'w' && lastMoveColor === 'b') {
      moveNumber += 1;
      displayMoveNumber = `${moveNumber}. `;
    } else if (node.move && node.move.color === 'b' && lastMoveColor === 'w') {
      displayMoveNumber = `${moveNumber}... `;
    }

    
    const nodeStyle = {
      marginLeft: depth * 1,
      position: 'relative',
    };

    return (
      <div key={node.id} style={nodeStyle}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          {hasChildren && (
            <button onClick={() => toggleNode(node.id)} style={{ marginRight: 5 }}>
              {isExpanded ? '-' : '+'}
            </button>
          )}
          <span
            onClick={() => goToMove(node)}
            style={{
              cursor: 'pointer',
              color: isCurrent ? 'red' : isVariation ? 'gray' : 'black',
              fontWeight: isCurrent ? 'bold' : 'normal',
              fontStyle: isVariation ? 'italic' : 'normal',
            }}
          >
            {displayMoveNumber}{node.san || 'Начало'}
          </span>
        </div>
        {/*  */}
        {isExpanded && (
          <div>
            {node.next && renderNode(node.next, depth + 1, moveNumber, node.move.color, isVariation)}
            {node.variations && node.variations.map((variation) =>
              renderNode(variation, depth + 1, moveNumber, node.move.color, true)
            )}
          </div>
        )}
      </div>
    );
  };

 
  const initialNodes = [];
  if (rootNode.next) {
    initialNodes.push(rootNode.next);
  }
  if (rootNode.variations && rootNode.variations.length > 0) {
    initialNodes.push(...rootNode.variations);
  }

  return (
    <div>
      {initialNodes.map((node) =>
        renderNode(node, 0, 0, 'b', false)
      )}
    </div>
  );
}

export default MoveTree;
