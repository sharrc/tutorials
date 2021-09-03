import { useCallback, useState } from "react";
const apple = require("./assets/golden-apple.png").default;
const heart = require("./assets/heart.png").default;

const BLANK = [
  [0, 0, 0],
  [0, 0, 0],
  [0, 0, 0],
];

const blank = () => {
  return BLANK.map((row) => row.slice());
};

export default function App() {
  const [grid, setGrid] = useState(blank()); // Main grid
  const [turn, setTurn] = useState("X"); // To hold the turn of current player
  const [status, setStatus] = useState(false); // The state of the game: e.g. Won, Draw

  const toggleTurn = () => setTurn((prev) => (prev === "X" ? "O" : "X"));

  const clearBoard = () => {
    setGrid(blank());
    setStatus(false);
  };

  const p1Wins = () => {
    setStatus("X WON");
    setTimeout(() => {
      clearBoard();
    }, 4000);
  };

  const p2Wins = () => {
    setStatus("O WON");
    setTimeout(() => {
      clearBoard();
    }, 4000);
  };

  const checkStatus = useCallback(() => {
    // 8 checks: 3 horizontal + 3 vertical + 2 diagonal

    const rotated = grid[0].map((val, index) =>
      grid.map((row) => row[index]).reverse()
    );

    // Horizontal
    for (let i = 0; i < grid.length; i += 1) {
      const row = grid[i];
      const stringified = JSON.stringify(row);

      console.log("Horizontal:", stringified);

      if (stringified === '["X","X","X"]') {
        p1Wins();
      } else if (stringified === '["O","O","O"]') {
        p2Wins();
      }
    }

    // Vertical
    for (let i = 0; i < rotated.length; i += 1) {
      const row = rotated[i];
      const stringified = JSON.stringify(row);

      console.log("Vertical:", stringified);

      if (stringified === '["X","X","X"]') {
        p1Wins();
      } else if (stringified === '["O","O","O"]') {
        p2Wins();
      }
    }

    // Diagonal 1
    let d1String = "";
    for (let i = 0; i < grid.length; i += 1) {
      const row = grid[i];
      for (let j = 0; j < row.length; j += 1) {
        if (i !== j) continue;
        d1String += row[j];
      }
    }

    if (d1String === "XXX") {
      p1Wins();
    } else if (d1String === "OOO") {
      p2Wins();
    }

    // Diagonal 2
    let d2String = "";
    for (let i = 0; i < grid.length; i += 1) {
      const row = grid[i];
      for (let j = 0; j < row.length; j += 1) {
        if (i + j !== 2) continue;
        d2String += row[j];
      }
    }

    if (d2String === "XXX") {
      p1Wins();
    } else if (d2String === "OOO") {
      p2Wins();
    }
  }, [grid]);

  const handleClick = useCallback(
    (i, j) => {
      const newGrid = [...grid];
      if (status) return;
      if (newGrid[i][j]) return;
      newGrid[i][j] = turn;
      setGrid(newGrid);
      toggleTurn();
      checkStatus();
    },
    [grid, turn, status]
  );

  const renderBtn = (value) => {
    if (value === "X") {
      return <img className="icon" src={apple} />;
    }
    if (value === "O") {
      return <img className="icon" src={heart} />;
    }
    return null;
  };

  return (
    <div className="container">
      <div className="content">
        <div className="grid">
          {grid.map((row, i) => (
            <div className="row">
              {row.map((col, j) => (
                <button onClick={() => handleClick(i, j)}>
                  {renderBtn(col)}
                </button>
              ))}
            </div>
          ))}
        </div>
      </div>
      <div className={`status ${status ? "show" : ""}`}>{status}</div>
    </div>
  );
}
