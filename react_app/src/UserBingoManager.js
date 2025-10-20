import { db } from './firebase.tsx';
import { doc, setDoc, getDoc, updateDoc, increment } from 'firebase/firestore';

// ユーザーのBINGOデータ管理クラス
export class UserBingoManager {
  constructor(userId) {
    this.userId = userId;
    this.userDocRef = doc(db, 'users', userId);
  }

  // ユーザープロフィールの初期化
  async initializeUser(isAnonymous = false) {
    try {
      const userDoc = await getDoc(this.userDocRef);
      
      if (!userDoc.exists()) {
        const initialData = {
          userId: this.userId,
          isAnonymous,
          createdAt: new Date().toISOString(),
          totalGames: 0,
          totalBingos: 0,
          bestTime: null,
          cards: {
            card1: {
              squares: Array(25).fill(null),
              bingoCount: 0,
              stampCount: 0,
              usedQRCodes: [],
              lastUpdated: new Date().toISOString()
            },
            card2: {
              squares: Array(25).fill(null),
              bingoCount: 0,
              stampCount: 0,
              usedQRCodes: [],
              lastUpdated: new Date().toISOString()
            }
          }
        };
        
        await setDoc(this.userDocRef, initialData);
        console.log('ユーザーデータを初期化しました');
        return initialData;
      } else {
        console.log('既存ユーザーデータを取得しました');
        return userDoc.data();
      }
    } catch (error) {
      console.error('ユーザー初期化エラー:', error);
      throw error;
    }
  }

  // ビンゴカードの保存
  async saveBingoCard(cardType, squares, usedQRCodes) {
    try {
      const bingoCount = this.countBingoLines(squares);
      const stampCount = squares.filter(s => s !== null).length;
      
      const updateData = {
        [`cards.${cardType}.squares`]: squares,
        [`cards.${cardType}.bingoCount`]: bingoCount,
        [`cards.${cardType}.stampCount`]: stampCount,
        [`cards.${cardType}.usedQRCodes`]: usedQRCodes,
        [`cards.${cardType}.lastUpdated`]: new Date().toISOString()
      };

      await updateDoc(this.userDocRef, updateData);
      console.log(`${cardType}のデータを保存しました`);
      
      return { bingoCount, stampCount };
    } catch (error) {
      console.error('カード保存エラー:', error);
      throw error;
    }
  }

  // ビンゴ達成時のスコア更新
  async updateBingoAchievement(cardType, completionTime) {
    try {
      const userData = await this.getUserData();
      const updates = {
        totalBingos: increment(1),
        [`cards.${cardType}.completedAt`]: new Date().toISOString()
      };

      // ベストタイム更新
      if (!userData.bestTime || completionTime < userData.bestTime) {
        updates.bestTime = completionTime;
      }

      await updateDoc(this.userDocRef, updates);
      console.log('ビンゴ達成記録を更新しました');
    } catch (error) {
      console.error('スコア更新エラー:', error);
      throw error;
    }
  }

  // ユーザーデータの取得
  async getUserData() {
    try {
      const userDoc = await getDoc(this.userDocRef);
      if (userDoc.exists()) {
        return userDoc.data();
      } else {
        console.log('ユーザーデータが存在しません');
        return null;
      }
    } catch (error) {
      console.error('データ取得エラー:', error);
      throw error;
    }
  }

  // 特定のビンゴカードデータの取得
  async getBingoCard(cardType) {
    try {
      const userData = await this.getUserData();
      return userData?.cards?.[cardType] || null;
    } catch (error) {
      console.error('カードデータ取得エラー:', error);
      throw error;
    }
  }

  // ビンゴライン数のカウント
  countBingoLines(squares) {
    if (!squares || squares.length !== 25) return 0;
    
    const lines = [
      // 横
      [0, 1, 2, 3, 4], [5, 6, 7, 8, 9], [10, 11, 12, 13, 14],
      [15, 16, 17, 18, 19], [20, 21, 22, 23, 24],
      // 縦
      [0, 5, 10, 15, 20], [1, 6, 11, 16, 21], [2, 7, 12, 17, 22],
      [3, 8, 13, 18, 23], [4, 9, 14, 19, 24],
      // 斜め
      [0, 6, 12, 18, 24], [4, 8, 12, 16, 20]
    ];

    let bingoCount = 0;
    for (let line of lines) {
      const [a, b, c, d, e] = line;
      if (squares[a] && squares[a] === squares[b] && 
          squares[a] === squares[c] && squares[a] === squares[d] && 
          squares[a] === squares[e]) {
        bingoCount++;
      }
    }
    return bingoCount;
  }

  // ゲーム開始記録
  async startGame() {
    try {
      await updateDoc(this.userDocRef, {
        totalGames: increment(1),
        lastPlayedAt: new Date().toISOString()
      });
    } catch (error) {
      console.error('ゲーム開始記録エラー:', error);
    }
  }
}