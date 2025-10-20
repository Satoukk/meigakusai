import React, { useState, useEffect } from "react";
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
    if (squares[a] === '/povy.png' && squares[a] === squares[b] && squares[a] === squares[c] && squares[a] === squares[d] && squares[a] === squares[e]) {
      return line;
    }
  }
  return null; // ビンゴなし
}


function Square({ value, Stamp, index, isBingoSquare, bingoLineIndex, isWinner }) { 
  const isFreeSpace = index === 12;
  const isClicked = !!value; 
  
  const bingoGlowClass = isWinner && isBingoSquare ? 'bingo-line-glow' : '';

  return (
    <button 
      className={`square ${isClicked ? 'clicked' : ''} ${isFreeSpace ? 'free-space' : ''} ${bingoGlowClass}`} 
      onClick={Stamp}
      style={{ '--bingo-index': bingoLineIndex }} // スロットアニメーション遅延用
    >
      {value ? <img src={value} alt="stamp" style={{ width: "70%", height: "70%" }} /> : null}
    </button>
  );
}

/*ポヴィのカットイン*/
function PovyCutIn({ isVisible }) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (isVisible) {
      setShow(true);
      const timer = setTimeout(() => {
        setShow(false);
      }, 1500); 
      
      return () => clearTimeout(timer);
    }
  }, [isVisible]);

  if (!show) return null;

  return (
    <div className="povy-cutin-container">
      <div className="povy-cutin-box">
        <img 
          src='/povy_smile.png' 
          alt="Povy Cut In" 
          className="povy-cutin-img"
        />
        <div className="cutin-text">
          <h1>BINGO!!!</h1>
        </div>
      </div>
    </div>
  );
}

/*ビンゴカード*/
function Card({ squares, setSquares }) {
  const bingoLine = bingo_judge(squares); // ライン配列 or null
  const winner = !!bingoLine;

  const [bingoTriggered, setBingoTriggered] = useState(false);
  
  useEffect(() => {
    if (winner && !bingoTriggered) {
      setBingoTriggered(true);
      const resetTimer = setTimeout(() => setBingoTriggered(false), 2000); 
      return () => clearTimeout(resetTimer);
    }
    if (!winner && bingoTriggered) {
        setBingoTriggered(false);
    }
  }, [winner, bingoTriggered]);

  useEffect(() => {
    if (winner && bingoLine) {
      const isFreeSpaceInLine = bingoLine.includes(12);
      if (isFreeSpaceInLine && !squares[12]) {
        const nextSquares = squares.slice();
        nextSquares[12] = "/povy.png"; 
        setSquares(nextSquares);
      }
    }
  }, [squares, setSquares, winner, bingoLine]);
  
  function handleClick(i) {
    if (squares[i] || winner) return;
    if (i === 12) return; 

    const nextSquares = squares.slice();
    nextSquares[i] = "/povy.png"; 
    setSquares(nextSquares);
  }

  // ステータス表示
  const status = winner ? "BINGO!! " : "名学祭へようこそ！"; 

  return (
    <div className="card-wrapper">
      <div className={`status ${winner ? 'bingo-win' : 'connecting'}`}>
        {status}
        <img 
          src='/povy_smile.png' 
          width="70" 
          height="70" 
          alt="ポヴィの顔" 
          className={winner ? 'bingo-win-img' : 'povy'} 
        />
      </div>
      
      {winner && <div className="bingo-overlay"></div>}
      
      <div className="board-grid">
        {Array.from({ length: 5 }).map((_, rowIndex) => (
          <div className="board-row" key={rowIndex}>
            {Array.from({ length: 5 }).map((_, colIndex) => {
              const i = rowIndex * 5 + colIndex;
              const isBingoSquare = winner && bingoLine && bingoLine.includes(i);
              const bingoIndex = bingoLine ? bingoLine.indexOf(i) : -1;

              return (
                <Square 
                  key={i}
                  index={i} 
                  value={squares[i]} 
                  Stamp={() => handleClick(i)}
                  isBingoSquare={isBingoSquare}
                  bingoLineIndex={bingoIndex}
                  isWinner={winner}
                />
              );
            })}
          </div>
        ))}
      </div>
      
      <PovyCutIn isVisible={winner && bingoTriggered} />
    </div>
  );
}

// ビンゴカード2
function Card2({ squares, setSquares }) {
  return <Card squares={squares} setSquares={setSquares} />;
}

/*ナビゲーション*/
const Navigation = () => {
  const location = useLocation();

  const isCard1Active = location.pathname === "/";
  const isCard2Active = location.pathname === "/card2";

  // ナビゲーションリンクのスタイル
  const baseLinkStyle = {
    textDecoration: "none",
    fontFamily: 'var(--main-font)', 
    fontSize: "clamp(1.2rem, 4vw, 2.5rem)",
    marginRight: "clamp(15px, 5vw, 30px)",
    color: "var(--color-primary)", 
    textShadow: "0 0 5px var(--color-primary), 0 0 15px var(--color-primary)",
    transition: 'all 0.3s ease',
    letterSpacing: '1.5px', 
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
  
  const initialSquares = (size) => {
    const arr = Array(size).fill(null);
    arr[12] = "/povy.png"; 
    return arr;
  };
  
  const [squares1, setSquares1] = useState(initialSquares(25));
  const [squares2, setSquares2] = useState(initialSquares(25));

  return (
    <BrowserRouter>
      <link href="https://fonts.googleapis.com/css2?family=Electrolize&family=Rajdhani:wght@400;700&family=Orbitron:wght@600;800&display=swap" rel="stylesheet"></link>
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
            --neon-magenta: #ff00c1; 
            --color-primary: #08f7fe; /* シアン */
            --color-secondary: #00ff66; /* グリーン */
            --color-accent: #ff00c1; /* マゼンタ */
            --bg-dark: #010408;        
            --main-font: 'Rajdhani', sans-serif;
            --title-font: 'Orbitron', sans-serif; 
            --glitch-speed: 0.05s;
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
            overflow-x: hidden;
            font-family: var(--main-font);
            color: var(--color-primary); 
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
                linear-gradient(to right, rgba(8, 247, 254, 0.2) 1px, transparent 1px),
                linear-gradient(to bottom, rgba(8, 247, 254, 0.2) 1px, transparent 1px),
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
            100% { box-shadow: 0 50px 100px rgba(0, 0, 0, 0.6), 0 0 10px var(--color-primary); } 
        }

        .navigation-bar {
          z-index: 9999; 
          background: rgba(0, 0, 0, 0.9);
          position: fixed; 
          top: 0;
          left: 0;
          right: 0;
          
          border-bottom: 5px solid var(--color-primary); 
          box-shadow: 0 0 30px rgba(8, 247, 254, 0.6);
          padding: 10px 20px;
          display: flex;
          justify-content: center;
        }
        
        .card-wrapper {
            padding: 20px;
            background: rgba(10, 20, 30, 0.85); 
            border-radius: 8px; 
            backdrop-filter: blur(10px);
            border: 2px solid var(--color-secondary); 
            box-shadow: 
                0 0 15px rgba(0, 255, 102, 0.6), 
                inset 0 0 20px rgba(0, 255, 102, 0.3); 
            margin: 20px auto;
            width: fit-content;
            max-width: 95vw; 
            box-sizing: border-box;
            transform: rotateX(2deg) rotateY(-2deg); 
            transition: all 0.5s ease-out;
            position: relative; 
            animation: cardGlitch 4s infinite linear;
        }

        @keyframes cardGlitch {
            0%, 100% { transform: translate(0, 0) rotateX(2deg) rotateY(-2deg); }
            1% { transform: translate(-1px, 0.5px) rotateX(2.1deg) rotateY(-1.9deg); }
            3% { transform: translate(1px, -0.5px) rotateX(1.9deg) rotateY(-2.1deg); }
            5% { transform: translate(-0.5px, 1px) rotateX(2.05deg) rotateY(-2.05deg); }
            7% { transform: translate(0.5px, -1px) rotateX(1.95deg) rotateY(-1.95deg); }
            8% { transform: translate(0, 0) rotateX(2deg) rotateY(-2deg); }
            15%, 25%, 35%, 45%, 55%, 65%, 75%, 85%, 95% { opacity: 1; }
            15.1%, 25.1%, 35.1%, 45.1%, 55.1%, 65.1%, 75.1%, 85.1%, 95.1% { opacity: 0.98; }
        }
        
        .board-grid {
            display: grid; 
            grid-template-columns: repeat(1, 1fr); 
            gap: 6px; 
            width: 550px; 
            max-width: 100%; 
            margin: 0 auto;
            border: 1px solid var(--color-secondary); 
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
            border: 1px solid var(--color-primary); 
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
            border-color: var(--color-secondary); 
            box-shadow: 
                inset 0 0 15px rgba(0, 255, 102, 0.5), 
                0 0 10px var(--color-secondary), 
                0 0 20px rgba(0, 255, 102, 0.4),
                -1px 0 0 var(--color-accent), 
                1px 0 0 var(--color-primary); 
        }

        .square.clicked {
            background: rgba(0, 255, 102, 0.3); 
            box-shadow: 
                inset 0 0 25px rgba(0, 255, 102, 0.8), 
                0 0 10px var(--color-secondary); 
            border-color: var(--color-secondary); 
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
            filter: drop-shadow(0 0 8px var(--color-secondary)) drop-shadow(0 0 15px rgba(0, 255, 102, 0.5)); 
            transition: transform 0.3s ease, filter 0.3s ease;
        }
        /* ------------------ END BINGO BOARD STYLE ------------------ */

        
        /* ------------------ BINGO ANIMATIONS (STATUS/SQUARES) ------------------ */

        .status {
            text-align: center;
            font-family: var(--title-font); 
            font-size: 60px;
            font-weight: bold;
            letter-spacing: 2px;
            text-transform: uppercase;
            margin-bottom: 10px;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 10px;
            position: relative; 
        }
        
        .povy{
          animation: fluffyBounce 2s cubic-bezier(0.4, 0.0, 0.2, 1.0) infinite alternate;
          transform-origin: center bottom;
        }
        .bingo-win-img {
            animation: fluffyBounce 2s cubic-bezier(0.4, 0.0, 0.2, 1.0) infinite alternate;
            transform-origin: center bottom;
            filter: drop-shadow(0 0 15px var(--neon-green));
        }

        .status.bingo-win {
            color: var(--neon-green);
            text-shadow: 
                0 0 10px var(--neon-green), 
                0 0 20px var(--neon-green),
                0 0 40px rgba(0, 255, 102, 0.8); 
            animation: neon-pulse 0.5s infinite alternate; 
        }
        
        @keyframes neon-pulse {
            0% { transform: scale(1); text-shadow: 0 0 10px var(--neon-green), 0 0 20px var(--neon-green); }
            100% { transform: scale(1.05); text-shadow: 0 0 20px var(--neon-green), 0 0 50px rgba(0, 255, 102, 0.8); }
        }

        .status.connecting {
            color: var(--color-primary); 
            text-shadow: 0 0 5px var(--color-primary); 
            animation: textGlitchEffect 1.5s infinite alternate; 
        }
        
        @keyframes textGlitchEffect {
            0% { 
                transform: translate(0, 0); 
                text-shadow: 0 0 5px var(--color-primary);
            }
            20% { 
                transform: translate(-1px, 0.5px); 
                text-shadow: 0 0 5px var(--color-primary), -3px 0 0 var(--color-accent);
            }
            40% { 
                transform: translate(1px, -0.5px); 
                text-shadow: 0 0 5px var(--color-primary), 3px 0 0 var(--color-accent);
            }
            60% { 
                transform: translate(-0.5px, 1px); 
                text-shadow: 0 0 5px var(--color-primary), -3px 0 0 var(--color-accent);
            }
            80% { 
                transform: translate(0.5px, -1px); 
                text-shadow: 0 0 5px var(--color-primary), 2px 0 0 var(--color-accent); 
            }
            100% { 
                transform: translate(0, 0); 
                text-shadow: 0 0 5px var(--color-primary);
            }
        }

        .square.bingo-line-glow {
            background: rgba(0, 255, 102, 0.5); 
            border: 3px solid var(--neon-green);
            box-shadow: 
                inset 0 0 30px rgba(0, 255, 102, 1), 
                0 0 20px var(--neon-green);
            
            animation: 
                bingo-sequence 0.2s ease-in-out forwards, 
                slot-flicker 1s infinite; 
            
            animation-delay: calc(0.1s * var(--bingo-index)); 
        }

        @keyframes slot-flicker {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.5; } 
        }
        
        @keyframes bingo-sequence {
            0% { transform: scale(1); }
            50% { transform: scale(1.1); box-shadow: inset 0 0 60px rgba(255, 255, 255, 1), 0 0 40px var(--neon-green); } 
            100% { transform: scale(1); }
        }

        .bingo-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            background-color: var(--color-secondary); 
            z-index: 99; 
            opacity: 0;
            animation: bingoFlash 0.15s ease-out; 
            pointer-events: none;
        }

        @keyframes bingoFlash {
            0% { opacity: 0.8; }
            100% { opacity: 0; }
        }
        
        .povy-cutin-container {
            position: fixed;
            top: 50%; /* 中央揃えの基準 */
            left: 50%; /* 中央揃えの基準 */
            transform: translate(-50%, -50%); /* 中央揃えを完了 */
            
            width: 100vw;
            height: 100vh;
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 101; 
            pointer-events: none;
            overflow: hidden;
            background: rgba(0, 0, 0, 0.8); /* 背景をより暗く */
            backdrop-filter: blur(8px); /* ぼかしを強める */
            animation: cutinBackgroundFade 0.2s forwards;
        }
        
        .povy-cutin-box {
            position: relative;
            animation: cutinBoxAppear 1.5s cubic-bezier(0.25, 1.5, 0.5, 1) forwards;
            padding: 40px; /* パディングを増やして迫力を出す */
            background: radial-gradient(circle at center, rgba(255, 0, 193, 0.2), rgba(0, 0, 0, 0.9)); /* マゼンタを基調としたグラデーション */
            border: 4px solid white; 
            border-radius: 4px;
            box-shadow: 
                0 0 40px var(--color-primary), 
                0 0 80px cyan,
                inset 0 0 30px var(--color-primary); 
            transform: scale(0);
        }

        .povy-cutin-img {
            width: clamp(150px, 40vw, 300px);
            height: auto;
            filter: drop-shadow(0 0 15px cyan)) drop-shadow(0 0 30px cyan); 
            animation: cutinImageGlow 0.2s ease-in-out;
        }

        .cutin-text {
            font-family: 'Press Start 2P', cursive;
            color: white;
            font-size: clamp(1.5rem, 4vw, 3rem); 
            text-align: center;
            margin-top: 25px;
            text-shadow: 
                0 0 10px white, 
                0 0 20px var(--color-accent); 
            letter-spacing: 3px;
            animation: textGlitch 0.3s infinite alternate; 
        }
        
        .povy-cutin-img {
            width: clamp(150px, 40vw, 300px);
            height: auto;
            filter: drop-shadow(0 0 10px var(--color-secondary)) drop-shadow(0 0 20px var(--color-primary)); 
            animation: cutinImageGlow 0.3s ease-in-out;
        }

        .cutin-text {
            font-family: 'Press Start 2P', cursive;
            color: white;
            font-size: clamp(1rem, 3vw, 2rem);
            text-align: center;
            margin-top: 15px;
            text-shadow: 
                0 0 5px white, 
                0 0 10px var(--color-secondary); 
            letter-spacing: 2px;
            animation: textGlitch 0.5s infinite alternate;
        }
        
        @keyframes cutinBackgroundFade {
            from { opacity: 0; }
            to { opacity: 1; }
        }
        
        @keyframes cutinBoxAppear {
            0% { transform: scale(0) rotate(0deg); opacity: 0; }
            40% { transform: scale(1.1) rotate(2deg); opacity: 1; }
            60% { transform: scale(1) rotate(-1deg); }
            100% { transform: scale(1) rotate(0deg); opacity: 1; }
        }
        
        @keyframes cutinImageGlow {
            0% { opacity: 0; }
            100% { opacity: 1; }
        }
        
        @keyframes textGlitch {
            0% { transform: translate(0); text-shadow: 0 0 5px white; }
            50% { transform: translate(1px, -1px); text-shadow: 0 0 5px var(--color-secondary), 2px 2px 0 var(--color-accent); } 
            100% { transform: translate(-1px, 1px); text-shadow: 0 0 5px white, -2px -2px 0 var(--color-primary); } 
        }
        
        @media (max-width: 600px) {
            
            body { padding-top: 70px; }

            .main-3d-container { 
                animation: none; 
                transform: none;
            }

            .navigation-bar {
                padding: 5px 10px;
            }

            .board-grid {
                width: 100%;
                max-width: 400px; 
                gap: 2px;
                padding: 2px;
            }
            .board-row { gap: 1px; }

            .status { font-size: 30px; margin-bottom: 10px; } 

            .card-wrapper { 
                transform: none;
                padding: 10px;
                margin-top: 10px;
            }

            .square {
                border-width: 1px;
                border-radius: 5px; 
            }
        }
      `}</style>
    </BrowserRouter>
  );
}
