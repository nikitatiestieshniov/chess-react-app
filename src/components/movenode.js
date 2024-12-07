class MoveNode {
  static idCounter = 0;

  constructor(san, fen, move, prev = null, moveNumber = null) {
    this.id = MoveNode.idCounter++;
    this.san = san || '';
    this.fen = fen;
    this.move = move || {};
    this.prev = prev;
    this.next = null;
    this.variations = [];

    if (moveNumber !== null && moveNumber !== undefined) {
      this.moveNumber = moveNumber;
    } else if (prev) {
      if (this.move.color === 'w' && prev.move.color === 'b') {
        this.moveNumber = prev.moveNumber + 1;
      } else {
        this.moveNumber = prev.moveNumber;
      }
    } else {
      this.moveNumber = 1; 
    }
  }
}

export default MoveNode;
