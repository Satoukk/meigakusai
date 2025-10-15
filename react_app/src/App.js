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


function Square({ value, Stamp, index }) { // StampをhandleClickの代わりに受け取る
  //真ん中にスタンプを押す
  const isFreeSpace = index === 12;
  const isClicked = !!value; 
  
  return (
    <button className={`square ${isClicked ? 'clicked' : ''} ${isFreeSpace ? 'free-space' : ''}`} onClick={Stamp}>
      {value ? <img src={value} alt="stamp" style={{ width: "70%", height: "70%" }} /> : null}
    </button>
  );
}

/**
 * ビンゴカード
 */
function Card({ squares, setSquares }) {
  function handleClick(i) {
    // 既にスタンプがあるか、またはビンゴが成立していたら何もしない
    if (squares[i] || bingo_judge(squares)) return;

    const nextSquares = squares.slice();
    nextSquares[i] = "/povy.png"; 
    setSquares(nextSquares);
  }

  const winner = bingo_judge(squares);
  const status = winner ? "ビンゴ！！" : "名学祭へ　ようこそ！"; 

  return (
    <div className="card-wrapper">
      <div className={`status ${winner ? 'bingo-win' : 'connecting'}`}>
        {status}
        {/* ビンゴ成立時に bingo-win-img クラスを適用してアニメーションさせる */}
        <img 
          src='/povy_smile.png' 
          width="70" 
          height="70" 
          alt="ポヴィの顔" 
          className={winner ? 'bingo-win-img' : 'povy'}
        />
      </div>
      
      <div className="board-grid">
        <div className="board-row">
          <Square index={0} value={squares[0]} Stamp={()=>handleClick(0)}/>
          <Square index={1} value={squares[1]} Stamp={()=>handleClick(1)}/>
          <Square index={2} value={squares[2]} Stamp={()=>handleClick(2)}/>
          <Square index={3} value={squares[3]} Stamp={()=>handleClick(3)}/>
          <Square index={4} value={squares[4]} Stamp={()=>handleClick(4)}/>
        </div>
        <div className="board-row">
          <Square index={5} value={squares[5]} Stamp={()=>handleClick(5)}/>
          <Square index={6} value={squares[6]} Stamp={()=>handleClick(6)}/>
          <Square index={7} value={squares[7]} Stamp={()=>handleClick(7)}/>
          <Square index={8} value={squares[8]} Stamp={()=>handleClick(8)}/>
          <Square index={9} value={squares[9]} Stamp={()=>handleClick(9)}/>
        </div>
        <div className="board-row">
          <Square index={10} value={squares[10]} Stamp={()=>handleClick(10)}/>
          <Square index={11} value={squares[11]} Stamp={()=>handleClick(11)}/>
          <Square index={12} value={squares[12]} Stamp={()=>handleClick(12)}/> {/* Free Space */}
          <Square index={13} value={squares[13]} Stamp={()=>handleClick(13)}/>
          <Square index={14} value={squares[14]} Stamp={()=>handleClick(14)}/>
        </div>
        <div className="board-row">
          <Square index={15} value={squares[15]} Stamp={()=>handleClick(15)}/>
          <Square index={16} value={squares[16]} Stamp={()=>handleClick(16)}/>
          <Square index={17} value={squares[17]} Stamp={()=>handleClick(17)}/>
          <Square index={18} value={squares[18]} Stamp={()=>handleClick(18)}/>
          <Square index={19} value={squares[19]} Stamp={()=>handleClick(19)}/>
        </div>
        <div className="board-row">
          <Square index={20} value={squares[20]} Stamp={()=>handleClick(20)}/>
          <Square index={21} value={squares[21]} Stamp={()=>handleClick(21)}/>
          <Square index={22} value={squares[22]} Stamp={()=>handleClick(22)}/>
          <Square index={23} value={squares[23]} Stamp={()=>handleClick(23)}/>
          <Square index={24} value={squares[24]} Stamp={()=>handleClick(24)}/>
        </div>
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
const Navigation = () => {
  const location = useLocation();

  const isCard1Active = location.pathname === "/";
  const isCard2Active = location.pathname === "/card2";

  const baseLinkStyle = {
    textDecoration: "none",
    fontFamily: 'Share Tech Mono, monospace', // ターミナル風フォント
    fontSize: "clamp(1.2rem, 4vw, 2.5rem)",
    marginRight: "clamp(15px, 5vw, 30px)",
    color: "cyan",
    textShadow: "0 0 5px cyan, 0 0 15px cyan",
    transition: 'all 0.3s ease',
    letterSpacing: '1px',
    fontWeight: 'bold',
  };

  const activeLinkStyle = {
    color: "var(--neon-green)",
    textShadow: "0 0 10px var(--neon-green), 0 0 25px var(--neon-green), 0 0 40px var(--neon-green)",
    transform: 'scale(1.05)',
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
        {isCard1Active ? ">>" : "FILE: "}ビンゴカード/1
      </Link>

      <Link
        to="/card2"
        style={{
          ...baseLinkStyle,
          ...(isCard2Active ? activeLinkStyle : {}),
          marginRight: 0
        }}
      >
        {isCard2Active ? ">>" : "FILE: "}ビンゴカード/2
      </Link>
    </div>
  );
};

export default function App() {
  const [squares1, setSquares1] = useState(Array(25).fill(null));
  const [squares2, setSquares2] = useState(Array(25).fill(null));

  if (!squares1[12]) squares1[12] = "/povy.png";
  if (!squares2[12]) squares2[12] = "/povy.png";

  return (
    <BrowserRouter>
      <link href="https://fonts.googleapis.com/css2?family=Press+Start+2P&family=Share+Tech+Mono&display=swap" rel="stylesheet"></link>

      <Navigation />

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
            --neon-green: #00ff66;    
            --bg-dark: #010408;         
            --main-font: 'Share Tech Mono', monospace;
            --title-font: 'Press Start 2P', cursive;
            --glitch-speed: 0.1s; 
        }

        body {
            display: flex;
            justify-content: center;
            align-items: center;
            flex-direction: column;
            min-height: 100vh;
            margin: 0;
            padding-top: 100px; 
            background: linear-gradient(145deg, #020205 0%, #000000 100%);
            overflow-x: hidden; /*横スクロールを完全に禁止 */
            font-family: var(--main-font);
            color: var(--neon-cyan);
            perspective: 1000px;
            position: relative;
        }

        body::before {
            content: "";
            position: fixed;
            top: 0; left: 0; right: 0; bottom: 0;
            z-index: -1;
            opacity: 0.15;
            
            background: 
                linear-gradient(to right, var(--neon-cyan) 1px, transparent 1px),
                linear-gradient(to bottom, var(--neon-cyan) 1px, transparent 1px),
                
                repeating-linear-gradient(
                    0deg, 
                    rgba(0,0,0,0.2) 0, 
                    rgba(0,0,0,0.3) 1px, 
                    transparent 2px, 
                    transparent 3px
                );

            background-size: 50px 50px, 50px 50px, 100% 5px;
            
            animation: 
                gridScroll 30s linear infinite, 
                noiseFlicker 0.1s step-end infinite;
        }

        body::after {
            content: "";
            position: fixed;
            top: 0; left: 0; right: 0; bottom: 0;
            z-index: -1;
            pointer-events: none;
            background: repeating-linear-gradient(
                0deg, 
                rgba(0,0,0,0.1), 
                rgba(255,255,255,0.05) 1px, 
                transparent 2px 
            );
            background-size: 100% 4px;
            opacity: 0.5;
            animation: scanlineMovement 10s linear infinite; 
        }
        
        @keyframes scanlineMovement {
            from { background-position: 0 0; }
            to { background-position: 0 100%; }
        }

        @keyframes gridScroll {
            0% { background-position: 0 0; }
            100% { background-position: 500px 500px; } 
        }

        @keyframes noiseFlicker {
            0% { opacity: 0.15; }
            50% { opacity: 0.1; }
            100% { opacity: 0.2; }
        }


        @keyframes fluffyBounce {
            0%, 100% {
                transform: translateY(0) rotate(0deg); 
            }
            50% {
                transform: translateY(-15px) rotate(2deg) scale(1.05); 
            }
        }


        .main-3d-container {
          transform: rotateX(5deg) translateY(-20px); 
          transition: transform 0.5s ease-out;
          box-shadow: 0 50px 100px rgba(0, 0, 0, 0.5);
          animation: terminalGlow 2s infinite alternate;
        }
        @keyframes terminalGlow {
            0% { box-shadow: 0 50px 100px rgba(0, 0, 0, 0.5); }
            100% { box-shadow: 0 50px 100px rgba(0, 0, 0, 0.6), 0 0 10px rgba(8, 247, 254, 0.1); }
        }

        .navigation-bar {
          border-bottom: 5px solid var(--neon-cyan); 
          box-shadow: 0 0 30px rgba(8, 247, 254, 0.6);
        }
        
        .card-wrapper {
            padding: 20px;
            background: rgba(10, 20, 30, 0.85); 
            border-radius: 8px; 
            backdrop-filter: blur(10px);
            border: 2px solid var(--neon-green); 
            box-shadow: 
                0 0 15px rgba(0, 255, 102, 0.6), 
                inset 0 0 20px rgba(0, 255, 102, 0.3); 
            margin: 20px auto;
            width: fit-content;
            max-width: 95vw; 
            box-sizing: border-box;
            transform: rotateX(2deg) rotateY(-2deg); 
            transition: all 0.5s ease-out;
        }
        
        .board-grid {
            display: grid; 
            grid-template-columns: repeat(1, 1fr); 
            gap: 6px; 
            width: 550px; 
            max-width: 100%; 
            margin: 0 auto;
            border: 1px solid rgba(0, 255, 102, 0.5);
            box-shadow: inset 0 0 10px rgba(0, 255, 102, 0.3);
            padding: 5px;
            box-sizing: border-box;
        }
        
        .board-row {
            display: flex; 
            grid-template-columns: repeat(5, 1fr); 
            
        }

        .square {
            width: 100%;
            height: auto;
            aspect-ratio: 1 / 1;
            background: rgba(0, 255, 102, 0.05); 
            border: 1px solid var(--neon-cyan);
            border-radius: 10px; 
            box-shadow: inset 0 0 15px rgba(8, 247, 254, 0.2), 0 0 3px rgba(8, 247, 254, 0.3);
            transition: all 0.15s ease-out;
            cursor: pointer;
            display: flex;
            justify-content: center;
            align-items: center;
        }

        .square:hover:not(.clicked) {
            transform: scale(1.02);
            border-color: var(--neon-green);
            box-shadow: 
                inset 0 0 15px rgba(0, 255, 102, 0.5), 
                0 0 10px var(--neon-green), 
                0 0 20px rgba(0, 255, 102, 0.4),
                -1px 0 0 var(--neon-magenta), 
                1px 0 0 var(--neon-cyan); 
        }

        /* スタンプありの状態 */
        .square.clicked {
            background: rgba(0, 255, 102, 0.3); 
            box-shadow: 
                inset 0 0 25px rgba(0, 255, 102, 0.8), 
                0 0 10px var(--neon-green); 
            border-color: var(--neon-green);
            cursor: default;
            animation: glitchClick 0.4s ease-in-out;
        }
        @keyframes glitchClick {
            0% { transform: translate(0); }
            25% { transform: translate(1px, -1px); }
            50% { transform: translate(-1px, 1px); }
            75% { transform: translate(1px, 1px); }
            100% { transform: translate(0); }
        }
        
        /* センターフリースペースを強調 */
        .square.free-space {
            background: rgba(255, 255, 255, 0.3); 
            border: 2px solid white; 
            box-shadow: 
                0 0 18px white, 
                inset 0 0 12px white;
            animation: pulseFreeSpace 1.5s infinite alternate;
        }

        @keyframes pulseFreeSpace {
            0% { opacity: 1; transform: scale(1.0); }
            100% { opacity: 0.7; transform: scale(0.98); }
        }

        .square img {
            filter: drop-shadow(0 0 8px var(--neon-green)) drop-shadow(0 0 15px rgba(0, 255, 102, 0.5));
            transition: transform 0.3s ease, filter 0.3s ease;
        }

        /*ステータス*/
        .status {
            text-align: center;
            font-family: var(--title-font); 
            font-size: 45px;
            font-weight: bold;
            letter-spacing: 2px;
            text-transform: uppercase;
            margin-bottom: 30px;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 10px;
            
        }
        .povy{
          animation: fluffyBounce 2s cubic-bezier(0.4, 0.0, 0.2, 1.0) infinite alternate;
          transform-origin: center bottom;
        }
        .status.bingo-win {
            color: var(--neon-green);
            text-shadow: 0 0 10px var(--neon-green), 0 0 20px var(--neon-green);
        }
        
        .bingo-win-img {
            animation: fluffyBounce 2s cubic-bezier(0.4, 0.0, 0.2, 1.0) infinite alternate;
            transform-origin: center bottom;
            filter: drop-shadow(0 0 15px var(--neon-green));
        }

        /*スマホ対応*/
        
        @media (max-width: 600px) {
            
            body { padding-top: 70px; }

            .main-3d-container { 
                animation: none; 
                transform: none;
            }

            .board-grid {
                width: 100%;
                max-width: 400px; 
                gap: 2px;
                padding: 2px;
            }
            .board-row { gap: 1px; }

            .status { font-size: 45px; margin-bottom: 15px; }

            .card-wrapper { 
                transform: none;
                padding: 10px;
                margin-top: 10px;
            }

            .square {
                border-width: 1px;
                border-radius: 10px;
            }
        }
      `}</style>
    </BrowserRouter>
  );
}