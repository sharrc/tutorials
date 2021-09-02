import { useCallback, useState } from "react";

const BLANK_BOARD = [
  [0, 0, 0],
  [0, 0, 0],
  [0, 0, 0],
];

const blank = () => {
  return BLANK_BOARD.map((arr) => arr.slice());
};

const P1_WIN = "P1 wins the game!";
const P2_WIN = "P2 wins the game!";

function App() {
  const [grid, setGrid] = useState(blank());
  // spread operator only does a shallow copy, we have nested arrays we need to deep copy the arrays.
  const [turn, setTurn] = useState("X");
  const [status, setStatus] = useState(false);
  console.log(status, BLANK_BOARD);
  const toggleTurn = () => setTurn((prev) => (prev === "X" ? "O" : "X"));

  // 0 -> blank
  // 1 -> X
  // 2 -> O

  const clearBoard = () => setGrid(blank());

  const showStatus = useCallback((message) => {
    console.log("show status:", message);
    setStatus(message);
    setTimeout(() => {
      setStatus(false);
      clearBoard();
    }, 4000);
  }, []);

  const checkStatus = useCallback(() => {
    const rotated = grid[0].map((val, index) =>
      grid.map((row) => row[index]).reverse()
    );
    // Total of 8 scenarios => 3 horizontal + 3 vertical + 2 diagonal

    // Horizontal checks
    for (let i = 0; i < grid.length; i += 1) {
      const row = grid[i];
      const stringified = JSON.stringify(row);
      if (stringified === '["X","X","X"]') {
        showStatus(P1_WIN);
      } else if (stringified === '["O","O","O"]') {
        showStatus(P2_WIN);
      }
    }

    // Vertical checks
    for (let i = 0; i < rotated.length; i += 1) {
      const row = rotated[i];
      const stringified = JSON.stringify(row);
      if (stringified === '["X","X","X"]') {
        showStatus(P1_WIN);
      } else if (stringified === '["O","O","O"]') {
        showStatus(P2_WIN);
      }
    }

    // Diagonal check 1
    let diagString = "";
    for (let i = 0; i < grid.length; i += 1) {
      const row = grid[i];
      for (let j = 0; j < row.length; j += 1) {
        if (j !== i) continue;
        const col = row[j];
        diagString += col;
      }
    }
    if (diagString === "XXX") {
      showStatus(P1_WIN);
    } else if (diagString === "OOO") {
      showStatus(P2_WIN);
    }

    // Diagonal check 2
    let diagString2 = "";
    for (let i = 0; i < grid.length; i += 1) {
      const row = grid[i];
      for (let j = 0; j < row.length; j += 1) {
        if (i + j !== 2) continue;
        const col = row[j];
        // console.log("Col:", col);
        diagString2 += col;
      }
    }
    if (diagString2 === "XXX") {
      showStatus(P1_WIN);
    } else if (diagString2 === "OOO") {
      showStatus(P2_WIN);
    }
    // console.log(diagString2);
  }, [grid, showStatus]);

  const handleClick = useCallback(
    (i, j) => {
      if (status) return; // To return if someone has won already
      // i -> Row index
      // j -> Col index
      const newGrid = [...grid];
      if (newGrid[i][j]) return;
      newGrid[i][j] = turn;
      setGrid([...newGrid]);
      toggleTurn();
      checkStatus();
    },
    [grid, turn, status, checkStatus]
  );

  const renderIcon = (value) => {
    if (!value) return null;
    if (value === "X")
      return (
        <img
          className="icon"
          src="/assets/heart.png"
          alt="p1 icon sharrc tutorials"
        />
      );
    if (value === "O")
      return (
        <img
          className="icon"
          src="/assets/golden-apple.png"
          alt="p2 icon sharrc tutorials"
        />
      );
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
      <img
        style={{ height: "700px" }}
        src="/assets/crafting-table.png"
        alt="crafting table sharrc tutorials"
      />
      <div className="grid-container">
        {grid.map((row, rowI) => (
          <div className="grid-row">
            {row.map((col, colI) => (
              <button
                disabled={col !== 0}
                onClick={() => handleClick(rowI, colI)}
              >
                {renderIcon(col)}
              </button>
            ))}
          </div>
        ))}
      </div>
      <div className={`status ${status ? "show" : "hide"}`}>{status}</div>
    </div>
  );
}

export default App;
