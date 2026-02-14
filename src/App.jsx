import { useState } from "react";
import "./sudoku.css";

const emptyBoard = Array(9)
  .fill(0)
  .map(() => Array(9).fill(""));

export default function App() {
  const [board, setBoard] = useState(emptyBoard);
  const [invalidCells, setInvalidCells] = useState([]);
  const [status, setStatus] = useState("");

  const handleChange = (row, col, value) => {
    if (value === "" || (/^[1-9]$/.test(value))) {
      const newBoard = board.map(r => [...r]);
      newBoard[row][col] = value;
      setBoard(newBoard);
    }
  };

  const validateBoard = () => {
    const conflicts = new Set();

    const check = (cells) => {
      const seen = {};
      cells.forEach(([r, c, val]) => {
        if (!val) return;
        if (seen[val]) {
          conflicts.add(`${r}-${c}`);
          conflicts.add(`${seen[val][0]}-${seen[val][1]}`);
        } else {
          seen[val] = [r, c];
        }
      });
    };

    // Rows
    for (let r = 0; r < 9; r++) {
      check(board[r].map((v, c) => [r, c, v]));
    }

    // Columns
    for (let c = 0; c < 9; c++) {
      check(board.map((row, r) => [r, c, row[c]]));
    }

    // 3x3 grids
    for (let br = 0; br < 3; br++) {
      for (let bc = 0; bc < 3; bc++) {
        const cells = [];
        for (let r = br * 3; r < br * 3 + 3; r++) {
          for (let c = bc * 3; c < bc * 3 + 3; c++) {
            cells.push([r, c, board[r][c]]);
          }
        }
        check(cells);
      }
    }

    if (conflicts.size > 0) {
      setInvalidCells([...conflicts]);
      setStatus("invalid");
    } else {
      setInvalidCells([]);
      setStatus("valid");
    }
  };

  const clearBoard = () => {
    setBoard(emptyBoard);
    setInvalidCells([]);
    setStatus("");
  };

  return (
    <div className="container">
      <h1>Sudoku Validator</h1>
      <p className="subtitle">Enter numbers 1-9 and validate the board.</p>

      <div className="board">
        {board.map((row, r) =>
          row.map((val, c) => {
            const key = `${r}-${c}`;
            const isInvalid = invalidCells.includes(key);

            return (
              <input
                key={key}
                className={`cell ${isInvalid ? "error" : ""}`}
                value={val}
                onChange={(e) => handleChange(r, c, e.target.value)}
              />
            );
          })
        )}
      </div>

      <div className="actions">
        <button className="validate" onClick={validateBoard}>
          Validate
        </button>
        <button className="clear" onClick={clearBoard}>
          Clear
        </button>
      </div>

      {status === "valid" && (
        <p className="success">✅ Sudoku is valid so far!</p>
      )}

      {status === "invalid" && (
        <p className="errorText">❌ Invalid Sudoku! Conflicts found.</p>
      )}
    </div>
  );
}