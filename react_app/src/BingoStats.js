import React, { useState, useEffect } from 'react';

const BingoStats = ({ bingoManager }) => {
  const [stats, setStats] = useState(null);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    if (bingoManager) {
      const playerStats = bingoManager.getPlayerStats();
      const card1Data = bingoManager.getCardData('card1');
      const card2Data = bingoManager.getCardData('card2');
      
      setStats({
        player: playerStats,
        card1: card1Data?.achievements,
        card2: card2Data?.achievements
      });
    }
  }, [bingoManager]);

  if (!stats || !bingoManager) {
    return null;
  }

  const resetData = () => {
    if (window.confirm('全てのデータをリセットしますか？')) {
      bingoManager.resetAllData();
      window.location.reload();
    }
  };

  const exportData = () => {
    const data = bingoManager.exportData();
    const dataStr = JSON.stringify(data, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'bingo-data-backup.json';
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div style={{
      position: 'fixed',
      bottom: '20px',
      right: '20px',
      background: 'rgba(0, 0, 0, 0.9)',
      border: '2px solid #08f7fe',
      borderRadius: '10px',
      padding: '15px',
      color: '#08f7fe',
      fontFamily: 'DotGothic16, monospace',
      fontSize: '0.9rem',
      maxWidth: '300px',
      zIndex: 1000
    }}>
      <div 
        onClick={() => setShowDetails(!showDetails)}
        style={{ cursor: 'pointer', marginBottom: '10px' }}
      >
        📊 統計情報 {showDetails ? '▼' : '▶'}
      </div>
      
      {showDetails && (
        <div>
          <div style={{ marginBottom: '10px' }}>
            <strong>全体統計:</strong><br/>
            総ライン数: {stats.player?.totalLines || 0}<br/>
            総スタンプ数: {stats.player?.totalStamps || 0}
          </div>
          
          <div style={{ marginBottom: '10px' }}>
            <strong>カード1:</strong><br/>
            ライン: {stats.card1?.lines || 0} | スタンプ: {stats.card1?.totalStamps || 0}
          </div>
          
          <div style={{ marginBottom: '15px' }}>
            <strong>カード2:</strong><br/>
            ライン: {stats.card2?.lines || 0} | スタンプ: {stats.card2?.totalStamps || 0}
          </div>
          
          <div style={{ display: 'flex', gap: '5px', flexDirection: 'column' }}>
            <button 
              onClick={exportData}
              style={{
                background: 'transparent',
                border: '1px solid #08f7fe',
                color: '#08f7fe',
                padding: '5px 10px',
                borderRadius: '5px',
                cursor: 'pointer',
                fontSize: '0.8rem'
              }}
            >
              データ出力
            </button>
            <button 
              onClick={resetData}
              style={{
                background: 'transparent',
                border: '1px solid #ff4444',
                color: '#ff4444',
                padding: '5px 10px',
                borderRadius: '5px',
                cursor: 'pointer',
                fontSize: '0.8rem'
              }}
            >
              データリセット
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default BingoStats;