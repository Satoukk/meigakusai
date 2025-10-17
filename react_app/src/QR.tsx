import React, { useState } from "react";
import { Scanner, IDetectedBarcode } from "@yudiel/react-qr-scanner";
import { useNavigate } from "react-router-dom";

export default function QRReader() {
  const [qrData, setQrData] = useState<string>("");
  const navigate = useNavigate();

  // スキャン時の処理
  const handleScan = (results: IDetectedBarcode[]) => {
    if (results.length > 0) {
      const data = results[0].rawValue;
      setQrData(data);
      
      // ランダムでCardまたはCard2のどちらかに遷移
      const pages = ["/", "/card2"];
      const randomPage = pages[Math.floor(Math.random() * pages.length)];
      navigate(randomPage, { state: { qrData: data } });
    }
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
        </div>
      )}
    </div>
  );
}