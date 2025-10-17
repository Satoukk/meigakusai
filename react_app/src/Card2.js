import { useLocation } from "react-router-dom";
import { useEffect } from "react";
function Square({ value, onClick, index }) {
  //真ん中にスタンプを押す
  const isFreeSpace = index === 12;
  const isClicked = !!value; 
  
  return (
    <button className={`square ${isClicked ? 'clicked' : ''} ${isFreeSpace ? 'free-space' : ''}`} onClick={onClick}>
      {value ? <img src={value} alt="stamp" style={{ width: "70%", height: "70%" }} /> : null}
    </button>
  );
}

export default function Card2({ squares, setSquares }) {
   const location = useLocation(); // 追加
   const qrData = location.state?.qrData; // 追加
    useEffect(() => {
     if (qrData && !calculateWinner(squares)) {
       // 0から24までのランダムなインデックスを生成
       const randomIndex = Math.floor(Math.random() * 25);
       
       // そのマス目がまだ空の場合のみスタンプを配置
       if (!squares[randomIndex]) {
         const nextSquares = squares.slice();
         nextSquares[randomIndex] = "/NKC2.png";
         setSquares(nextSquares);
       }
     }
   }, [qrData]);

  function handleClick(i) {
    if (squares[i] || calculateWinner(squares)) return;
    const nextSquares = squares.slice();
    nextSquares[i] = "/NKC2.png";
    setSquares(nextSquares);
  }

  const winner = calculateWinner(squares);
  const status = winner ? "ＢＩＮＧＯ！！！" : "";

  return (
    <div className="card-wrapper">
      <div className="status">{status}</div>
      <div className="board-grid">
        {Array.from({ length: 25 }, (_, idx) => (
          <Square key={idx} index={idx} value={squares[idx]} onClick={() => handleClick(idx)} />
        ))}
      </div>
    </div>
  );
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2, 3, 4],
    [5, 6, 7, 8, 9],
    [10, 11, 12, 13, 14],
    [15, 16, 17, 18, 19],
    [20, 21, 22, 23, 24],
    [0, 5, 10, 15, 20],
    [1, 6, 11, 16, 21],
    [2, 7, 12, 17, 22],
    [3, 8, 13, 18, 23],
    [4, 9, 14, 19, 24],
    [0, 6, 12, 18, 24],
    [4, 8, 12, 16, 20],
  ];
  for (let line of lines) {
    const [a, b, c, d, e] = line;
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c] && squares[a] === squares[d] && squares[a] === squares[e]) {
      return squares[a];
    }
  }
  return null;
}
