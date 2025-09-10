import { useState } from "react";
function Square({ value, Stamp }) {
  return (
    <button className="square" onClick={Stamp}>
      {value ?(
        <img src={value} alt="stamp" style={{ width: "70%", height: "70%" }}
        />
      ): null}
    </button>
  );
}
export default function Card(){
  const[squares,setSquares]=useState(Array(25).fill(null))
  function handleClick(i){
    if (squares[i]||Complete(squares)){
      return;
    }
    const nextSquares=squares.slice();
    nextSquares[i]="/logo.png";
    setSquares(nextSquares)
  }
  const clear=Complete(squares);
  let status;
  if (clear){
    status="コンプリート!"
  }
  return(
    <>
      <div className="status">{status}</div>
      <div className="board-row">
        <Square value={squares[0]} Stamp={()=>handleClick(0)}/>
        <Square value={squares[1]} Stamp={()=>handleClick(1)}/>
        <Square value={squares[2]} Stamp={()=>handleClick(2)}/>
        <Square value={squares[3]} Stamp={()=>handleClick(3)}/>
        <Square value={squares[4]} Stamp={()=>handleClick(4)}/>
      </div>
      <div className="board-row">
        <Square value={squares[5]} Stamp={()=>handleClick(5)}/>
        <Square value={squares[6]} Stamp={()=>handleClick(6)}/>
        <Square value={squares[7]} Stamp={()=>handleClick(7)}/>
        <Square value={squares[8]} Stamp={()=>handleClick(8)}/>
        <Square value={squares[9]} Stamp={()=>handleClick(9)}/>
      </div>
      <div className="board-row">
        <Square value={squares[10]} Stamp={()=>handleClick(10)}/>
        <Square value={squares[11]} Stamp={()=>handleClick(11)}/>
        <Square value={squares[12]} Stamp={()=>handleClick(12)}/>
        <Square value={squares[13]} Stamp={()=>handleClick(13)}/>
        <Square value={squares[14]} Stamp={()=>handleClick(14)}/>
      </div>
      <div className="board-row">
        <Square value={squares[15]} Stamp={()=>handleClick(15)}/>
        <Square value={squares[16]} Stamp={()=>handleClick(16)}/>
        <Square value={squares[17]} Stamp={()=>handleClick(17)}/>
        <Square value={squares[18]} Stamp={()=>handleClick(18)}/>
        <Square value={squares[19]} Stamp={()=>handleClick(19)}/>
      </div>
      <div className="board-row">
        <Square value={squares[20]} Stamp={()=>handleClick(20)}/>
        <Square value={squares[21]} Stamp={()=>handleClick(21)}/>
        <Square value={squares[22]} Stamp={()=>handleClick(22)}/>
        <Square value={squares[23]} Stamp={()=>handleClick(23)}/>
        <Square value={squares[24]} Stamp={()=>handleClick(24)}/>
      </div>
    </>
  )
}
function Complete(squares) {
  const lines = [
    // 横
    [0, 1, 2, 3, 4],
    [5, 6, 7, 8, 9],
    [10, 11, 12, 13, 14],
    [15, 16, 17, 18, 19],
    [20, 21, 22, 23, 24],
    // 縦
    [0, 5, 10, 15, 20],
    [1, 6, 11, 16, 21],
    [2, 7, 12, 17, 22],
    [3, 8, 13, 18, 23],
    [4, 9, 14, 19, 24],
    // 斜め
    [0, 6, 12, 18, 24],
    [4, 8, 12, 16, 20],
  ];

  for (let i = 0; i < lines.length; i++) {
    const [a, b, c, d, e] = lines[i];
    if (
      squares[a] &&
      squares[a] === squares[b] &&
      squares[a] === squares[c] &&
      squares[a] === squares[d] &&
      squares[a] === squares[e]
    ) {
      return squares[a];
    }
  }
  return null;
}
