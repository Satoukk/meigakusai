import React, { useState } from "react";
import { Scanner, IDetectedBarcode } from "@yudiel/react-qr-scanner";
import { useNavigate } from "react-router-dom";

export default function QRReader() {
  const [qrData, setQrData] = useState<string>("");
  const [usedQRCodes, setUsedQRCodes] = useState<string[]>([]);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const navigate = useNavigate();

  // スキャン時の処理
  const handleScan = (results: IDetectedBarcode[]) => {
    // 既に処理中の場合は無視
    if (isProcessing || results.length === 0) {
      return;
    }

    const data = results[0].rawValue;
    setQrData(data);

    // 処理中フラグを設定
    setIsProcessing(true);

    // 少し遅延を入れて状態の更新を待つ
    setTimeout(() => {
      // 既に使用済みのQRコードかチェック
      if (usedQRCodes.includes(data)) {
        alert("このQRコードは既に使用済みです。");
        setIsProcessing(false);
        return;
      }
      
      // すべてのQRコードを受け入れる
      // 使用済みリストに追加
      setUsedQRCodes(prev => [...prev, data])
      
      // URLの場合はID番号を抽出する
      let extractedId = data;
      
      // URLかどうかをチェック
      if (data.startsWith('http://') || data.startsWith('https://')) {
        // URLからID番号を抽出
        
        // test.htmlの場合は特別に10001を返す
        if (data.includes('test.html')) {
          extractedId = "10001";
        }
        // 方法3: ファイル名から数字を抽出 (例: test123.html → 123)
        else {
          const pathPart = data.split('/').pop(); // 最後の部分を取得
          const numberMatch = pathPart?.match(/(\d+)/); // 数字を抽出
          if (numberMatch) {
            extractedId = numberMatch[1];
          } else {
            // 方法4: 数字が見つからない場合はデフォルト値
            extractedId = "10001"; // デフォルトを10001に変更
          }
        }
      }
      
      console.log("元のデータ:", data);
      console.log("抽出されたID:", extractedId);
      
      // ID番号によって遷移先を決定
      let targetPage = "/"; // デフォルトはCard.js
      
      // Card.js用のID番号をチェック（抽出されたIDを使用）
      const isCard1ID = 
        // 10000番台（基本ID）
        (parseInt(extractedId) >= 10001 && parseInt(extractedId) <= 10025) ||
        // 20000番台（角マス）
        (parseInt(extractedId) >= 20001 && parseInt(extractedId) <= 20004) ||
        // 30000番台（十字パターン）
        (parseInt(extractedId) >= 30001 && parseInt(extractedId) <= 30005) ||
        // 40000番台（特別パターン）
        (parseInt(extractedId) >= 40001 && parseInt(extractedId) <= 40004) ||
        // 1-25番（簡単な番号）
        (parseInt(extractedId) >= 1 && parseInt(extractedId) <= 25) ||
        // Card.js専用レガシーID
        ["12345", "12346", "99999"].includes(extractedId);
      
      // Card2.js用のID番号をチェック（抽出されたIDを使用）
      const isCard2ID = 
        // 50000番台（基本ID）
        (parseInt(extractedId) >= 50001 && parseInt(extractedId) <= 50025) ||
        // 60000番台（角マス）
        (parseInt(extractedId) >= 60001 && parseInt(extractedId) <= 60004) ||
        // 70000番台（十字パターン）
        (parseInt(extractedId) >= 70001 && parseInt(extractedId) <= 70005) ||
        // 80000番台（特別パターン）
        (parseInt(extractedId) >= 80001 && parseInt(extractedId) <= 80004) ||
        // 101-125番（簡単な番号）
        (parseInt(extractedId) >= 101 && parseInt(extractedId) <= 125) ||
        // Card2専用レガシーID
        ["54321", "65432", "88888"].includes(extractedId);
      
      // 適切なページに遷移
      if (isCard2ID) {
        targetPage = "/card2";
      } else if (isCard1ID) {
        targetPage = "/";
      } else {
        // どちらにも該当しない場合はCard.jsをデフォルトに
        targetPage = "/";
      }
      
      // 決定されたページに遷移して抽出されたIDを渡す
      navigate(targetPage, { state: { qrData: extractedId } });
      
      // 遷移後に処理中フラグをリセット（少し遅延）
      setTimeout(() => setIsProcessing(false), 1000);
    }, 100);
  };

  const handleError = (err: unknown) => {
    console.error("QRスキャン中にエラー:", err);
  };

  return (
    <div style={{ height: "100vh", textAlign: "center" }}>
      <h2>QRコードをスキャンしてください</h2>
      <div style={{ width: 320, height: 320, margin: "0 auto" }}>
        <Scanner
          onScan={handleScan}
          onError={handleError}
        />
      </div>

      {qrData && (
        <div style={{ marginTop: "20px" }}>
          <p>
            <strong>読み取ったデータ:</strong> {qrData}
          </p>
          <p style={{ 
            color: usedQRCodes.includes(qrData) ? "orange" : "green",
            fontWeight: "bold"
          }}>
            {usedQRCodes.includes(qrData) ? "⚠ 使用済みQRコード" : "✓ 有効なQRコード"}
          </p>
          {usedQRCodes.length > 0 && (
            <div style={{ marginTop: "15px" }}>
              <p><strong>使用済みQRコード数:</strong> {usedQRCodes.length}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}