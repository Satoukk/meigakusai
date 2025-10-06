'use client';

import React, { useState } from 'react';
import { Scanner, IDetectedBarcode } from '@yudiel/react-qr-scanner';

const Home = () => {
  const [scanResult, setScanResult] = useState({ format: '', rawValue: '' });

  const handleScan = (results: IDetectedBarcode[]) => {
    if (results.length > 0) {
      setScanResult({
        format: results[0].format,
        rawValue: results[0].rawValue,
      });
    }
  };

  // コード検出時のカスタムトラッカー
  const customTracker = (
    detectedCodes: IDetectedBarcode[],
    ctx: CanvasRenderingContext2D
  ) => {
    detectedCodes.forEach((code) => {
      // 検出されたコードの周りに赤い枠を描画
      ctx.strokeStyle = 'red';
      ctx.lineWidth = 2;
      ctx.strokeRect(
        code.boundingBox.x,
        code.boundingBox.y,
        code.boundingBox.width,
        code.boundingBox.height
      );

      // コードの内容を表示
      ctx.fillStyle = 'white';
      ctx.fillRect(
        code.boundingBox.x,
        code.boundingBox.y + code.boundingBox.height,
        code.boundingBox.width,
        20
      );
      ctx.fillStyle = 'black';
      ctx.fillText(
        code.rawValue,
        code.boundingBox.x,
        code.boundingBox.y + code.boundingBox.height + 15
      );
    });
  };

  return (
    <div className='h-screen flex flex-col items-center'>
      <h1>QR コードをスキャンしてください</h1>
      <div className='w-[300px]'>
        <Scanner
          onScan={handleScan}
          formats={[
            'qr_code', // QR コード
            'micro_qr_code', // マイクロ QR
          ]}
          allowMultiple={true} // これを指定すると連続でスキャンできる
          // スキャン時の UI をカスタマイズ
          components={{
            tracker: customTracker, // コード検出時の視覚的なフィードバックをカスタマイズ
            onOff: true, // スキャンのオンオフを切り替えるボタンを表示する (default: false)
            zoom: true, // ズーム機能を有効にする (default: false)
            finder: false, // ファインダーを表示する (default: true)
            torch: true, // フラッシュライトを有効にする (default: false)
          }}
        />
      </div>
      {scanResult.rawValue && (
        <div className='mt-4 p-2 border border-gray-300 rounded'>
          <p>
            <strong>フォーマット:</strong> {scanResult.format}
          </p>
          <p>
            <strong>内容:</strong> {scanResult.rawValue}
          </p>
        </div>
      )}
    </div>
  );
};

export default Home;
