// ローカルストレージを使用したBINGOデータ管理クラス
export class LocalBingoManager {
  constructor() {
    this.storageKey = 'bingoData';
    this.initializeData();
  }

  // 初期データの設定
  initializeData() {
    const existingData = this.getBingoData();
    if (!existingData) {
      const initialData = {
        cards: {
          card1: {
            squares: Array(25).fill(false),
            achievements: {
              lines: 0,
              totalStamps: 0,
              lastUpdated: new Date().toISOString()
            }
          },
          card2: {
            squares: Array(25).fill(false), 
            achievements: {
              lines: 0,
              totalStamps: 0,
              lastUpdated: new Date().toISOString()
            }
          }
        },
        playerStats: {
          totalLines: 0,
          totalStamps: 0,
          createdAt: new Date().toISOString()
        }
      };
      this.saveBingoData(initialData);
    }
  }

  // ローカルストレージからデータを取得
  getBingoData() {
    try {
      const data = localStorage.getItem(this.storageKey);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('データの読み込みエラー:', error);
      return null;
    }
  }

  // ローカルストレージにデータを保存
  saveBingoData(data) {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(data));
      return true;
    } catch (error) {
      console.error('データの保存エラー:', error);
      return false;
    }
  }

  // 特定のカードのデータを取得
  getCardData(cardType) {
    const data = this.getBingoData();
    return data?.cards?.[cardType] || null;
  }

  // 特定のマスの状態を更新
  updateSquare(cardType, squareIndex, isStamped) {
    const data = this.getBingoData();
    if (!data || !data.cards[cardType]) return false;

    data.cards[cardType].squares[squareIndex] = isStamped;
    data.cards[cardType].achievements.totalStamps = data.cards[cardType].squares.filter(Boolean).length;
    data.cards[cardType].achievements.lastUpdated = new Date().toISOString();

    // ライン数をカウント
    data.cards[cardType].achievements.lines = this.countLines(data.cards[cardType].squares);

    // 全体の統計を更新
    this.updatePlayerStats(data);

    return this.saveBingoData(data);
  }

  // カード全体のデータを保存
  saveBingoCard(cardType, squares) {
    const data = this.getBingoData();
    if (!data) return false;

    data.cards[cardType].squares = squares;
    data.cards[cardType].achievements.totalStamps = squares.filter(Boolean).length;
    data.cards[cardType].achievements.lines = this.countLines(squares);
    data.cards[cardType].achievements.lastUpdated = new Date().toISOString();

    // 全体の統計を更新
    this.updatePlayerStats(data);

    return this.saveBingoData(data);
  }

  // プレイヤー全体の統計を更新
  updatePlayerStats(data) {
    let totalLines = 0;
    let totalStamps = 0;

    Object.values(data.cards).forEach(card => {
      totalLines += card.achievements.lines;
      totalStamps += card.achievements.totalStamps;
    });

    data.playerStats.totalLines = totalLines;
    data.playerStats.totalStamps = totalStamps;
  }

  // ライン数をカウント（横、縦、斜め）
  countLines(squares) {
    let lines = 0;

    // 横のライン
    for (let i = 0; i < 5; i++) {
      if (squares.slice(i * 5, i * 5 + 5).every(Boolean)) {
        lines++;
      }
    }

    // 縦のライン
    for (let i = 0; i < 5; i++) {
      if ([0, 1, 2, 3, 4].every(row => squares[row * 5 + i])) {
        lines++;
      }
    }

    // 左上から右下の斜めライン
    if ([0, 6, 12, 18, 24].every(index => squares[index])) {
      lines++;
    }

    // 右上から左下の斜めライン
    if ([4, 8, 12, 16, 20].every(index => squares[index])) {
      lines++;
    }

    return lines;
  }

  // プレイヤーの統計を取得
  getPlayerStats() {
    const data = this.getBingoData();
    return data?.playerStats || null;
  }

  // データをリセット
  resetAllData() {
    localStorage.removeItem(this.storageKey);
    this.initializeData();
    return true;
  }

  // データをエクスポート（バックアップ用）
  exportData() {
    return this.getBingoData();
  }

  // データをインポート（復元用）
  importData(importedData) {
    try {
      this.saveBingoData(importedData);
      return true;
    } catch (error) {
      console.error('データのインポートエラー:', error);
      return false;
    }
  }
}