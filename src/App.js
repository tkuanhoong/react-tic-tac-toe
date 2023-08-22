import { useState } from "react";

function Square({ value, onSquareClick }) {
  return (
    <button className="square" onClick={onSquareClick}>
      {value}
    </button>
  );
}

function Board({ xIsNext, squares, onPlay }) {
  function handleClick(i) {
    // Check if has winner OR if the square is occupied
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    // make a copy of current squares
    const nextSquares = squares.slice();
    // if xIsNext is true, assign X to copied square, else assign O
    xIsNext ? (nextSquares[i] = "X") : (nextSquares[i] = "O");
    // call handlePlay(nextSquares) in parent to update states
    onPlay(nextSquares);
  }
  // Display status text
  const winner = calculateWinner(squares);
  let status;
  if (winner) {
    status = "Winner: " + winner;
  } else {
    status = "Next player: " + (xIsNext ? "X" : "O");
  }

  // Rewrite Board to use two loops to make the squares instead of hardcoding them.
  const board = [];
  for (let row = 0; row < 3; row++) {
    const boardRow = [];
    for (let col = 0; col < 3; col++) {
      // 1 row = 3 column --> row * 3 + col equals to exact number
      boardRow.push(
        <Square
          value={squares[row * 3 + col]}
          onSquareClick={() => handleClick(row * 3 + col)}
        />
      );
    }
    board.push(<div className="board-row">{boardRow}</div>);
  }

  return (
    <>
      <div className="status">{status}</div>
      {board}
    </>
  );
}

export default function Game() {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];

  function handlePlay(nextSquares) {
    // make history with the nextSquares
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    // update history
    setHistory(nextHistory);
    // update currentMove to point to the latest history entry
    setCurrentMove(nextHistory.length - 1);
  }

  function jumpTo(nextMove) {
    // update currentMove to the move that the index user selected
    setCurrentMove(nextMove);
  }
  // Iterate moves
  const moves = history.map((squares, move) => {
    let description;
    move > 0
      ? (description = "Go to move #" + move)
      : (description = "Go to game start");
    return (
      <li key={move}>
        {currentMove === move ? (
          <p>You are at move {move}</p>
        ) : (
          <button onClick={() => jumpTo(move)}>{description}</button>
        )}
      </li>
    );
  });

  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      </div>
      <div className="game-info">
        <ol>{moves}</ol>
      </div>
    </div>
  );
}

function calculateWinner(squares) {
  // List out winning lines rules
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  // loop through the winning lines
  for (let i = 0; i < lines.length; i++) {
    // Destructure the lines numbers
    const [a, b, c] = lines[i];
    // if the squares[a] is not null AND squares[b] & squares[c] same with squares[a]
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      // return the "X" and "O" winner here
      return squares[a];
    }
  }
  // return null if none of conditions are met (no winner)
  return null;
}
