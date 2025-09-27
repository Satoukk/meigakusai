import React, { useState } from "react";
import { BrowserRouter, Routes, Route, Link, useLocation } from "react-router-dom";

//ビンゴを判定
function bingo_judge(squares) {
  const lines = [
    [0, 1, 2, 3, 4], [5, 6, 7, 8, 9], [10, 11, 12, 13, 14], [15, 16, 17, 18, 19], [20, 21, 22, 23, 24], // 横
    [0, 5, 10, 15, 20], [1, 6, 11, 16, 21], [2, 7, 12, 17, 22], [3, 8, 13, 18, 23], [4, 9, 14, 19, 24], // 縦
    [0, 6, 12, 18, 24], // 斜め \
    [4, 8, 12, 16, 20], // 斜め /
  ];
  for (let line of lines) {
    const [a, b, c, d, e] = line;
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c] && squares[a] === squares[d] && squares[a] === squares[e]) {
      return squares[a];
    }
  }
  return null;
}


function Square({ value, onClick }) {
  const isClicked = !!value;//スタンプが押されているか判定
  return (
    <button className={`square ${isClicked ? 'clicked' : ''}`} onClick={onClick}>
      {value ? <img src={value} alt="stamp" style={{ width: "70%", height: "70%" }} /> : null}
    </button>
  );
}

/*ビンゴカード1*/
function Card({ squares, setSquares }) {
  function handleClick(i) {
    // 既にスタンプがあるかビンゴしている場合はクリックできない
    if (squares[i] || bingo_judge(squares)) return;
    //コピーを作成
    const nextSquares = squares.slice();
    //スタンプをセット
    nextSquares[i] = "/NKC2.png";
    //状態を更新
    setSquares(nextSquares);
  }

  const bingo = bingo_judge(squares);
  const status = bingo ? "ＢＩＮＧＯ!" : "";

  return (
    <div className="card-wrapper">
      <div className="status">{status}</div>
      <div className="board-grid">
        {Array.from({ length: 25 }, (_, idx) => (
          <Square key={idx} value={squares[idx]} onClick={() => handleClick(idx)} />
        ))}
      </div>
    </div>
  );
}

/* ビンゴカード2*/
function Card2({ squares, setSquares }) {
  function handleClick(i) {
    if (squares[i] || bingo_judge(squares)) return;
    const nextSquares = squares.slice();
    nextSquares[i] = "/NKC2.png";
    setSquares(nextSquares);
  }

  const winner = bingo_judge(squares);
  const status = winner ? "ＢＩＮＧＯ!" : "";

  return (
    <div className="card-wrapper">
      <div className="status">{status}</div>
      <div className="board-grid">
        {Array.from({ length: 25 }, (_, idx) => (
          <Square key={idx} value={squares[idx]} onClick={() => handleClick(idx)} />
        ))}
      </div>
    </div>
  );
}

/*ナビゲーション*/
const Navigation = ({ squares1, squares2 }) => {
  const location = useLocation();
  //現在のパスを判定
  const isCard1Active = location.pathname === "/";
  const isCard2Active = location.pathname === "/card2";

  const baseLinkStyle = {
    textDecoration: "none",
    fontFamily: 'DotGothic16, monospace',
    fontSize: "clamp(1.5rem, 5vw, 3.125rem)", // 24px, 5vw, 50px の間でサイズを調整
    marginRight: "clamp(15px, 5vw, 30px)", // マージンも調整
    color: "cyan",
    textShadow: "0 0 10px cyan, 0 0 20px cyan",
  };

  const activeLinkStyle = {
    color: "lime",
    textShadow: "0 0 10px lime, 0 0 20px lime",
  };

  return (
    <div className="navigation-bar">
      <Link
        to="/"
        style={{
          ...baseLinkStyle,
          ...(isCard1Active ? activeLinkStyle : {}),
        }}
      >
        {isCard1Active ? "▶" : ""}ビンゴカード1
      </Link>

      <Link
        to="/card2"
        style={{
          ...baseLinkStyle,
          ...(isCard2Active ? activeLinkStyle : {}),
          marginRight: 0
        }}
      >
        {isCard2Active ? "▶" : ""}ビンゴカード2
      </Link>
    </div>
  );
};

// メインアプリケーションコンポーネント
export default function App() {
  const [squares1, setSquares1] = useState(Array(25).fill(null));
  const [squares2, setSquares2] = useState(Array(25).fill(null));

  // センターにスタンプを押す
  if (!squares1[12]) squares1[12] = "/NKC2.png";
  if (!squares2[12]) squares2[12] = "/NKC2.png";

  return (
    <BrowserRouter>
      <link href="https://fonts.googleapis.com/css2?family=DotGothic16&family=Train+One&family=Rampart+One&display=swap" rel="stylesheet"></link>

      <Navigation squares1={squares1} squares2={squares2} />

      <div className="main-content">
        <Routes>
          <Route path="/" element={<Card squares={squares1} setSquares={setSquares1} />} />
          <Route path="/card2" element={<Card2 squares={squares2} setSquares={setSquares2} />} />
        </Routes>
      </div>
      
      <style jsx="true">{`
        
        body {
            display: flex;
            justify-content: center;
            align-items: center;
            flex-direction: column;
            min-height: 100vh;
            margin: 0;
            padding-top: 100px;
            background: radial-gradient(circle at center, #010408 0%, #000000 100%);
            overflow-x: hidden;
            font-family: 'Segoe UI', -apple-system, BlinkMacSystemFont, Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
            color: #08f7fe;
        }

        body::before {
            content: "";
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: 
                linear-gradient(to right, #08f7fe40 1px, transparent 1px),
                linear-gradient(to bottom, #08f7fe40 1px, transparent 1px);
            background-size: 50px 50px;
            opacity: 0.15;
            z-index: -1;
            animation: gridScroll 30s linear infinite;
        }

        @keyframes gridScroll {
            0% { background-position: 0 0; }
            100% { background-position: 500px 500px; }
        }

        .navigation-bar {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          padding: 10px;
          display: flex;
          justify-content: center;
          align-items: center;
          background: rgba(0, 0, 0, 0.9);
          backdrop-filter: blur(5px);
          border-bottom: 2px solid rgba(8, 247, 254, 0.3);
          z-index: 100;
        }

        .card-wrapper {
            padding: 20px;
            background: rgba(10, 20, 30, 0.7);
            border-radius: 16px;
            backdrop-filter: blur(8px);
            border: 1px solid rgba(8, 247, 254, 0.5);
            box-shadow: 0 0 40px rgba(8, 247, 254, 0.3), inset 0 0 10px rgba(8, 247, 254, 0.1);
            margin: 20px auto; /* 中央寄せと上下マージン */
            width: fit-content;
            max-width: 95vw; /* ビューポート幅に合わせて最大幅を設定 */
            box-sizing: border-box;
        }
        
        .board-grid {
            display: grid;
            /*５行５列に指定*/
            grid-template-columns: repeat(5, 1fr);
            gap: 10px;
            width: 550px;
            margin: 0 auto;
        }

        .square {
            width: 100%;
            height: auto; 
            aspect-ratio: 1 / 1; /* 正方形を維持 */
            margin: 0;
            font-size: 2.5rem;
            background: rgba(0, 255, 200, 0.08);
            border: 2px solid #08f7fe;
            border-radius: 12px;
            text-shadow: 0 0 10px #00f5d4;
            box-shadow: inset 0 0 15px rgba(0, 255, 200, 0.4), 0 0 15px rgba(0, 255, 200, 0.4);
            transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
            position: relative;
            overflow: hidden;
            cursor: pointer;
            display: flex;
            justify-content: center;
            align-items: center;
            padding: 0;
        }

        .square::before {
            content: '';
            position: absolute;
            top: 50%;
            left: 50%;
            width: 0;
            height: 0;
            background: radial-gradient(circle, #08f7fe 0%, transparent 80%);
            opacity: 0;
            transform: translate(-50%, -50%);
            transition: all 0.5s ease-out;
        }
        .square.clicked::before {
            width: 200px;
            height: 200px;
            opacity: 0.8;
        }

        .square img {
            width: 75%;
            height: 75%;
            object-fit: contain;
            filter: drop-shadow(0 0 10px #08f7fe) drop-shadow(0 0 20px #00f5d4);
            transition: transform 0.3s ease, filter 0.3s ease;
        }

        .square:hover img {
            transform: scale(1.15) rotate(3deg);
            filter: drop-shadow(0 0 20px #ffffff) drop-shadow(0 0 40px #08f7fe);
        }

        .status {
            text-align: center;
            font-family:"DotGothic16", monospace;
            font-size: 3.0rem;
            font-weight: bold;
            color: #08f7fe;
            text-shadow: 
                0 0 15px #08f7fe, 
                0 0 30px #00f5d4,
                0 0 45px rgba(8, 247, 254, 0.8);
            margin-bottom: 40px;
            animation: glowText 1.5s ease-in-out infinite alternate;
            letter-spacing: 3px;
            text-transform: uppercase;
        }

        @keyframes glowText {
            0% { 
                text-shadow: 
                    0 0 10px #08f7fe, 
                    0 0 20px #00f5d4; 
            }
            100% { 
                text-shadow: 
                    0 0 25px #08f7fe, 
                    0 0 50px #00f5d4,
                    0 0 70px rgba(8, 247, 254, 0.5);
            }
        }

        /* スマホ対応 */

        @media (max-width: 600px) {
            
            body {
                padding-top: 60px;
            }
                
            .board-grid {
                width: 90vw; /* 画面幅の90%を使用 */
                max-width: 400px; /* 必要に応じて最大幅を設定 */
                gap: 5px; /* マス目の間隔を詰める */
            }

            .status {
                font-size: 2.0rem;
                margin-bottom: 20px;
            }

            .card-wrapper {
                padding: 10px;
                margin-top: 10px;
            }

            .square {
                border-width: 1px;
                border-radius: 8px;
                box-shadow: inset 0 0 10px rgba(0, 255, 200, 0.3), 0 0 10px rgba(0, 255, 200, 0.3);
            }
        }
      `}</style>
    </BrowserRouter>
  );
}
