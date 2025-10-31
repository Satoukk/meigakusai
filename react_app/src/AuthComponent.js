import React, { useState, useEffect } from 'react';
import { auth } from './firebase.tsx';
import { 
  signInAnonymously, 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged 
} from 'firebase/auth';

export default function AuthComponent({ onAuthChange }) {
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
      onAuthChange(user); // 親コンポーネントに認証状態を通知
    });

    return () => unsubscribe();
  }, [onAuthChange]);

  // 匿名ログイン（簡単スタート）
  const handleAnonymousLogin = async () => {
    try {
      await signInAnonymously(auth);
      console.log('匿名ログインしました');
    } catch (error) {
      console.error('匿名ログインエラー:', error);
    }
  };

  // メール/パスワードでの認証
  const handleEmailAuth = async (e) => {
    e.preventDefault();
    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
        console.log('ログインしました');
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
        console.log('アカウントを作成しました');
      }
    } catch (error) {
      console.error('認証エラー:', error);
      alert('認証に失敗しました: ' + error.message);
    }
  };

  // ログアウト
  const handleLogout = async () => {
    try {
      await signOut(auth);
      console.log('ログアウトしました');
    } catch (error) {
      console.error('ログアウトエラー:', error);
    }
  };

  if (loading) {
    return <div>認証状態を確認中...</div>;
  }

  if (user) {
    return (
      <div style={{ 
        padding: '20px', 
        background: '#f0f0f0', 
        borderRadius: '10px',
        margin: '10px 0'
      }}>
        <h3>👤 ログイン中</h3>
        <p>
          <strong>ユーザーID:</strong> {user.uid.slice(0, 8)}...
        </p>
        <p>
          <strong>認証方法:</strong> {user.isAnonymous ? '匿名ユーザー' : 'メール認証'}
        </p>
        {!user.isAnonymous && (
          <p><strong>メール:</strong> {user.email}</p>
        )}
        <button 
          onClick={handleLogout}
          style={{ 
            padding: '10px 20px', 
            backgroundColor: '#ff6b6b', 
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer'
          }}
        >
          ログアウト
        </button>
      </div>
    );
  }

  return (
    <div style={{ 
      padding: '20px', 
      background: '#f9f9f9', 
      borderRadius: '10px',
      margin: '10px 0'
    }}>
      <h3>🔐 ログインが必要です</h3>
      
      {/* 簡単スタート */}
      <div style={{ marginBottom: '20px' }}>
        <button 
          onClick={handleAnonymousLogin}
          style={{ 
            padding: '15px 30px', 
            backgroundColor: '#4CAF50', 
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            fontSize: '16px',
            width: '100%',
            marginBottom: '10px'
          }}
        >
          🚀 匿名でクイックスタート
        </button>
        <p style={{ fontSize: '12px', color: '#666' }}>
          ※ アカウント不要でBINGOを始められます
        </p>
      </div>

      {/* メール/パスワード認証 */}
      <div style={{ borderTop: '1px solid #ddd', paddingTop: '20px' }}>
        <h4>{isLogin ? 'ログイン' : 'アカウント作成'}</h4>
        <form onSubmit={handleEmailAuth}>
          <input
            type="email"
            placeholder="メールアドレス"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ 
              width: '100%', 
              padding: '10px', 
              margin: '5px 0',
              borderRadius: '5px',
              border: '1px solid #ddd'
            }}
            required
          />
          <input
            type="password"
            placeholder="パスワード"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ 
              width: '100%', 
              padding: '10px', 
              margin: '5px 0',
              borderRadius: '5px',
              border: '1px solid #ddd'
            }}
            required
          />
          <button 
            type="submit"
            style={{ 
              width: '100%',
              padding: '10px', 
              backgroundColor: '#2196F3', 
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              margin: '10px 0'
            }}
          >
            {isLogin ? 'ログイン' : 'アカウント作成'}
          </button>
        </form>
        
        <button 
          onClick={() => setIsLogin(!isLogin)}
          style={{ 
            background: 'none',
            border: 'none',
            color: '#2196F3',
            cursor: 'pointer',
            textDecoration: 'underline'
          }}
        >
          {isLogin ? 'アカウントを作成' : 'ログインに戻る'}
        </button>
      </div>
    </div>
  );
}