
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
function Square({ value, onClick, index }) {
  //真ん中にスタンプを押す
  const isFreeSpace = index === 12;
  const isClicked = !!value; 
  
  return (
    <button className={`square ${isClicked ? 'clicked' : ''} ${isFreeSpace ? 'free-space' : ''}`} >
      {value ? (
        <img src={value} alt="stamp" style={{ width: "70%", height: "70%" }} />
      ) : (
        <span style={{ 
          fontSize: "2rem", 
          color: "#08f7fe", 
          fontWeight: "bold",
          textShadow: "0 0 10px rgba(8, 247, 254, 0.8)"
        }}>
          ？
        </span>
      )}
    </button>
  );
}

export default function Card2({ squares, setSquares, bingoManager, cardType }) {
   const location = useLocation(); // 追加
   const qrData = location.state?.qrData; // 追加
   
   // QRコードと特定のマス位置の対応表（Card2専用ID番号システム）
   const qrToSquareMapping = {
     // 基本ID番号システム（50000番台）
     "50001": 0,  "50002": 1,  "50003": 2,  "50004": 3,  "50005": 4,
     "50006": 5,  "50007": 6,  "50008": 7,  "50009": 8,  "50010": 9,
     "50011": 10, "50012": 11, "50025": 12, "50014": 13, "50015": 14,
     "50016": 15, "50017": 16, "50018": 17, "50019": 18, "50020": 19,
     "50021": 20, "50022": 21, "50023": 22, "50024": 23, "50013": 24,
     
   };
   
    useEffect(() => {
     if (qrData) {
       console.log("Card2.js - QRデータ受信:", qrData);
       // QRコードに対応するマス位置を取得
       const targetSquareIndex = qrToSquareMapping[qrData];
       console.log("Card2.js - 対応マス位置:", targetSquareIndex);
       
       if (targetSquareIndex !== undefined) {
         // 対応するマスが既に埋まっていない場合のみスタンプを配置
         if (!squares[targetSquareIndex]) {
           console.log("Card2.js - スタンプ配置実行 マス", targetSquareIndex);
           const nextSquares = squares.slice();
           nextSquares[targetSquareIndex] = "/pbe.png";
           setSquares(nextSquares);
           
          //データを保存
           if (bingoManager) {
             bingoManager.saveBingoCard(cardType, nextSquares);
           }
         } else {
           console.log("Card2.js - マスは既に埋まっています");
         }
       } else {
         console.log("Card2.js - 対応表にないQRコード:", qrData);
       }
       // 対応表にない場合は何もしない
     }
   }, [qrData, squares, setSquares]);

  function handleClick(i) {
    if (squares[i] || calculateWinner(squares)) return;
    const nextSquares = squares.slice();
    nextSquares[i] = "/pbe.png";
    setSquares(nextSquares);
    
    //データを保存
    if (bingoManager) {
      bingoManager.saveBingoCard(cardType, nextSquares);
    }
  }

  const winner = calculateWinner(squares);
  const bingoCount = countBingoLines(squares);
  // 実際に画像が設定されているマス（画像パスが文字列のマス）のみをカウント
  const stampCount = squares.filter(square => typeof square === 'string' && square.length > 0).length;
  const status = winner ? "ＢＩＮＧＯ！！！" : "";

  return (
    <div className="card-wrapper">
      <div className="status">{status}</div>
      <div className="bingo-count">ビンゴ数: {bingoCount}</div>
      <div className="stamp-count">スタンプ数: {stampCount}/25</div>
      <div className="board-grid">
        {Array.from({ length: 25 }, (_, idx) => (
          <Square key={idx} index={idx} value={squares[idx]} />
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

function countBingoLines(squares) {
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
  
  let bingoCount = 0;
  for (let line of lines) {
    const [a, b, c, d, e] = line;
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c] && squares[a] === squares[d] && squares[a] === squares[e]) {
      bingoCount++;
    }
  }
  return bingoCount;
}
 develop
