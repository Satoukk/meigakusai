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
      background: 'rgba(1, 4, 8, 0.95)',
      border: '2px solid #08f7fe',
      borderRadius: '12px',
      padding: '15px 20px',
      color: '#08f7fe',
      fontFamily: 'DotGothic16, monospace',
      fontSize: '0.9rem',
      maxWidth: '600px',
      width: '90%',
      margin: '0 auto',
      backdropFilter: 'blur(10px)',
      boxShadow: '0 0 15px rgba(8, 247, 254, 0.3)',
      zIndex: 100
    }}>
      <div 
        onClick={() => setShowDetails(!showDetails)}
        style={{ 
          cursor: 'pointer', 
          marginBottom: showDetails ? '15px' : '0',
          textAlign: 'center',
          fontSize: '1rem',
          fontWeight: 'bold',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '10px'
        }}
      >
        📊 統計情報 
        <span style={{ 
          fontSize: '0.8rem',
          color: showDetails ? '#00f5d4' : '#08f7fe',
          transition: 'all 0.2s ease'
        }}>
          {showDetails ? '▼ 閉じる' : '▶ 詳細表示'}
        </span>
      </div>
      
      {showDetails && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '15px' }}>
          <div style={{ 
            textAlign: 'center',
            padding: '10px',
            background: 'rgba(8, 247, 254, 0.1)',
            borderRadius: '8px',
            border: '1px solid rgba(8, 247, 254, 0.3)'
          }}>
            <div style={{ color: '#00f5d4', fontWeight: 'bold', marginBottom: '5px' }}>全体統計</div>
            <div>総ライン: {stats.player?.totalLines || 0}</div>
            <div>総スタンプ: {stats.player?.totalStamps || 0}</div>
          </div>
          
          <div style={{ 
            textAlign: 'center',
            padding: '10px',
            background: 'rgba(0, 245, 212, 0.1)',
            borderRadius: '8px',
            border: '1px solid rgba(0, 245, 212, 0.3)'
          }}>
            <div style={{ color: '#00f5d4', fontWeight: 'bold', marginBottom: '5px' }}>カード1</div>
            <div>ライン: {stats.card1?.lines || 0}</div>
            <div>スタンプ: {stats.card1?.totalStamps || 0}</div>
          </div>
          
          <div style={{ 
            textAlign: 'center',
            padding: '10px',
            background: 'rgba(170, 255, 0, 0.1)',
            borderRadius: '8px',
            border: '1px solid rgba(170, 255, 0, 0.3)'
          }}>
            <div style={{ color: '#00f5d4', fontWeight: 'bold', marginBottom: '5px' }}>カード2</div>
            <div>ライン: {stats.card2?.lines || 0}</div>
            <div>スタンプ: {stats.card2?.totalStamps || 0}</div>
          </div>
          
          <div style={{ 
            display: 'flex', 
            gap: '10px', 
            justifyContent: 'center',
            gridColumn: '1 / -1',
            marginTop: '10px'
          }}>
            <button 
              onClick={exportData}
              style={{
                background: 'rgba(8, 247, 254, 0.2)',
                border: '1px solid #08f7fe',
                color: '#08f7fe',
                padding: '8px 15px',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '0.8rem',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.target.style.background = 'rgba(8, 247, 254, 0.4)';
                e.target.style.transform = 'scale(1.05)';
              }}
              onMouseLeave={(e) => {
                e.target.style.background = 'rgba(8, 247, 254, 0.2)';
                e.target.style.transform = 'scale(1)';
              }}
            >
              📥 データ出力
            </button>
            <button 
              onClick={resetData}
              style={{
                background: 'rgba(255, 68, 68, 0.2)',
                border: '1px solid #ff4444',
                color: '#ff4444',
                padding: '8px 15px',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '0.8rem',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.target.style.background = 'rgba(255, 68, 68, 0.4)';
                e.target.style.transform = 'scale(1.05)';
              }}
              onMouseLeave={(e) => {
                e.target.style.background = 'rgba(255, 68, 68, 0.2)';
                e.target.style.transform = 'scale(1)';
              }}
            >
              🗑️ データリセット
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default BingoStats;