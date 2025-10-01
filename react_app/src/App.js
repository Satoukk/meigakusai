import React, { useState } from "react";
import { BrowserRouter, Routes, Route, Link, useLocation } from "react-router-dom";
/* ビンゴを判定*/
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

/**
 * ビンゴカード
 */
function Card({ squares, setSquares }) {
  function handleClick(i) {
    if (squares[i] || bingo_judge(squares)) return;
    const nextSquares = squares.slice();
    nextSquares[i] = "/povy.png";
    setSquares(nextSquares);
  }

  const winner = bingo_judge(squares);
  const status = winner ? "ビンゴ！おめでとう！！": "名学祭へようこそ！"; 

  return (
    <div className="card-wrapper">
      <div className="status">{status}<img src='/povy_smile.png' width="70" height="70" alt="ポヴィの顔" /></div>
      <div className="board-grid">
        {Array.from({ length: 25 }, (_, idx) => (
          <Square key={idx} index={idx} value={squares[idx]} onClick={() => handleClick(idx)} />
        ))}
      </div>
    </div>
  );
}

// ビンゴカード2
function Card2({ squares, setSquares }) {
  return <Card squares={squares} setSquares={setSquares} />;
}

/**
 * ナビゲーション
 */
const Navigation = ({ squares1, squares2 }) => {
  const location = useLocation();

  const isCard1Active = location.pathname === "/";
  const isCard2Active = location.pathname === "/card2";

  const baseLinkStyle = {
    textDecoration: "none",
    fontFamily: 'DotGothic16, monospace',
    fontSize: "clamp(1.5rem, 5vw, 2.8rem)",
    marginRight: "clamp(15px, 5vw, 30px)",
    color: "#00eeff",
    textShadow: "0 0 5px #00eeff, 0 0 15px #00eeff",
    transition: 'all 0.3s ease',
  };

  const activeLinkStyle = {
    color: "#aaff00",
    textShadow: "0 0 10px #aaff00, 0 0 25px #aaff00, 0 0 40px #aaff00",
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
        {isCard1Active ? "▶ " : ""}ビンゴカード1
      </Link>

      <Link
        to="/card2"
        style={{
          ...baseLinkStyle,
          ...(isCard2Active ? activeLinkStyle : {}),
          marginRight: 0
        }}
      >
        {isCard2Active ? "▶ " : ""}ビンゴカード2
      </Link>
    </div>
  );
};

// -------------------------------------------------------------------
// メインアプリケーションコンポーネント
// -------------------------------------------------------------------

export default function App() {
  const [squares1, setSquares1] = useState(Array(25).fill(null));
  const [squares2, setSquares2] = useState(Array(25).fill(null));

  // センターフリースペースの設定
  if (!squares1[12]) squares1[12] = "/povy.png";
  if (!squares2[12]) squares2[12] = "/povy.png";

  return (
    <BrowserRouter>
      {/*フォントを読み込み*/}
      <link href="https://fonts.googleapis.com/css2?family=DotGothic16&family=Train+One&family=Rampart+One&display=swap" rel="stylesheet"></link>

      <Navigation squares1={squares1} squares2={squares2} />

      <div className="main-3d-container"> 
        <div className="main-content">
          <Routes>
            <Route path="/" element={<Card squares={squares1} setSquares={setSquares1} />} />
            <Route path="/card2" element={<Card2 squares={squares2} setSquares={setSquares2} />} />
          </Routes>
        </div>
      </div>
      
      <style jsx="true">{`
        :root {
            --neon-cyan: #08f7fe;
            --bg-dark: #010408;
            --main-font: 'DotGothic16', monospace;
        }

        body {
            display: flex;
            justify-content: center;
            align-items: center;
            flex-direction: column;
            min-height: 100vh;
            margin: 0;
            padding-top: 100px; 
            background: radial-gradient(circle at center, #000000 0%, #010408 100%);
            overflow-x: hidden;
            font-family: var(--main-font);
            color: var(--neon-cyan);
            perspective: 1000px;
        }

        body::before {
            content: "";
            position: fixed;
            top: 0; left: 0; right: 0; bottom: 0;
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



        .main-3d-container {
          transform: rotateX(5deg) translateY(-20px); /* 画面を少し傾けてコンソール感を出す */
          transition: transform 0.5s ease-out;
          box-shadow: 0 50px 100px rgba(0, 0, 0, 0.5); /* 影で浮いているように見せる */
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
          background: rgba(0, 0, 0, 0.95);
          backdrop-filter: blur(8px);
          border-bottom: 3px solid rgba(0, 238, 255, 0.7); /* 境界線を強調 */
          box-shadow: 0 0 20px rgba(0, 238, 255, 0.4);
          z-index: 100;
        }
        
        .card-wrapper {
            padding: 20px;
            background: rgba(10, 20, 30, 0.8);
            border-radius: 16px;
            backdrop-filter: blur(10px);
            border: 2px solid var(--neon-cyan);
            box-shadow: 
                0 0 10px rgba(8, 247, 254, 0.6),
                0 0 30px rgba(8, 247, 254, 0.4),
                inset 0 0 15px rgba(8, 247, 254, 0.2);
            margin: 20px auto;
            width: fit-content;
            max-width: 95vw;
            box-sizing: border-box;
        }
        
        .board-grid {
            display: grid;
            grid-template-columns: repeat(5, 1fr);
            gap: 8px;
            width: 550px; 
            margin: 0 auto;
        }

        .square {
            width: 100%;
            height: auto;
            aspect-ratio: 1 / 1;
            background: rgba(0, 255, 200, 0.05);
            border: 1px solid var(--neon-cyan);
            border-radius: 6px;
            box-shadow: inset 0 0 10px rgba(0, 255, 200, 0.2), 0 0 5px rgba(0, 255, 200, 0.3);
            transition: all 0.2s ease-out, transform 0.1s;
        }

        .square:hover:not(.clicked) {
            transform: scale(1.05);
            border-color: #ffffff;
            box-shadow: 
              inset 0 0 20px rgba(255, 255, 255, 0.5), /* 内側の強い白光 */
              0 0 15px var(--neon-cyan), 
              0 0 30px var(--neon-cyan);
        }

        /* クリック済み (スタンプあり) の状態 */
        .square.clicked {
            background: rgba(0, 255, 200, 0.2); /* クリック後は少し明るく */
            box-shadow: 
              inset 0 0 20px rgba(0, 255, 200, 0.8), /* 内側を強く光らせる */
              0 0 10px #aaff00; /* ライムグリーンの光を追加 */
        }
        
        /* センターフリースペースを強調 */
        .square.free-space {
            background: cyan
            border: 2px solid var(--neon-pink);
            box-shadow: 
              0 0 15px var(--neon-cyan), 
              inset 0 0 10px var(--neon-cyan);
            animation: pulseFreeSpace 2s infinite alternate;
        }

        @keyframes pulseFreeSpace {
            0% { opacity: 1; }
            100% { opacity: 0.8; }
        }

        .square img {
            width: 70%;
            height: 70%;
            filter: drop-shadow(0 0 10px #08f7fe) drop-shadow(0 0 20px #00f5d4);
            transition: transform 0.3s ease, filter 0.3s ease;
        }

        /* --- ステータス (BINGO!) --- */
        .status {
            text-align: center;
            font-family: 'Rampart One', sans-serif; /* BINGO!をより目立つフォントに変更 */
            font-size: 3.5rem;
            font-weight: bold;
            color: #aaff00; /* BINGO時はライムグリーン */
            text-shadow: 
                0 0 10px #aaff00, 
                0 0 30px #aaff00,
                0 0 60px rgba(170, 255, 0, 0.8);
            margin-bottom: 40px;
            animation: glowText 0.8s ease-in-out infinite alternate; /* 点滅速度を上げる */
            letter-spacing: 5px; /* 字間を広げる */
            text-transform: uppercase;
        }

        @keyframes glowText {
            0% { text-shadow: 0 0 10px #aaff00, 0 0 20px #aaff00; }
            100% { text-shadow: 0 0 30px #aaff00, 0 0 70px rgba(170, 255, 0, 0.8), 0 0 100px rgba(170, 255, 0, 0.5); }
        }
        
       /*スマホ対応*/
       
        @media (max-width: 600px) {
            
            body {
                padding-top: 60px;
            }

            .main-3d-container {
                transform: rotateX(0deg) translateY(0); /* モバイルでは傾きを無効化 */
            }

            .board-grid {
                width: 95vw; 
                max-width: 450px;
                gap: 4px;
            }

            .status {
                font-size: 1.8rem;
                margin-bottom: 15px;
                letter-spacing: 2px;
            }

            .card-wrapper {
                padding: 10px;
                margin-top: 10px;
            }

            .square {
                border-width: 1px;
                border-radius: 5px;
                box-shadow: inset 0 0 5px rgba(0, 255, 200, 0.2), 0 0 3px rgba(0, 255, 200, 0.2);
            }
        }
      `}</style>
    </BrowserRouter>
  );
}
