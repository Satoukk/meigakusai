import React, { useState } from "react";
import { Scanner, IDetectedBarcode } from "@yudiel/react-qr-scanner";
import { useNavigate } from "react-router-dom";

export default function QRReader() {
  const [qrData, setQrData] = useState<string>("");
  const [usedQRCodes, setUsedQRCodes] = useState<string[]>([]);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const navigate = useNavigate();

  // 許可されたQRコードのリスト
  const allowedQRCodes = [
    "http://127.0.0.1:5500/",
    "STAMP2", 
    "STAMP3",
    "BINGO_STAMP",
    "SPECIAL_CODE"
  ];

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
      
      // 許可されたQRコードかチェック
      if (allowedQRCodes.includes(data)) {
        // 使用済みリストに追加
        setUsedQRCodes(prev => {
          // 再度チェック（競合状態を防ぐ）
          if (prev.includes(data)) {
            alert("このQRコードは既に使用済みです。");
            setIsProcessing(false);
            return prev;
          }
          return [...prev, data];
        });
        
        // ランダムでCardまたはCard2のどちらかに遷移
        const pages = ["/", "/card2"];
        const randomPage = pages[Math.floor(Math.random() * pages.length)];
        navigate(randomPage, { state: { qrData: data } });
        
        // 遷移後に処理中フラグをリセット（少し遅延）
        setTimeout(() => setIsProcessing(false), 1000);
      } else {
        // 許可されていないQRコードの場合はエラーメッセージを表示
        alert("このQRコードは無効です。正しいQRコードをスキャンしてください。");
        setIsProcessing(false);
      }
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
            color: usedQRCodes.includes(qrData) ? "orange" :
                   allowedQRCodes.includes(qrData) ? "green" : "red",
            fontWeight: "bold"
          }}>
            {usedQRCodes.includes(qrData) ? "⚠ 使用済みQRコード" :
             allowedQRCodes.includes(qrData) ? "✓ 有効なQRコード" : "✗ 無効なQRコード"}
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