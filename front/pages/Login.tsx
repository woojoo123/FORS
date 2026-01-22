
import React, { useState } from 'react';
import { useApp } from '../App';
import { api } from '../api';
import { UserRole } from '../types';
const Login: React.FC = () => {
  const { login, addToast } = useApp();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await api<void>('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });
      const me = await api<{ id: number; email: string; role: UserRole }>('/api/auth/me');
      login(me.email, me.role);
      addToast(`${me.email} 님, 환영합니다.`, 'success');
    } catch (err) {
      setError('이메일 또는 비밀번호가 올바르지 않습니다.');
      addToast('로그인에 실패했습니다.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20">
      <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm">
        <h1 className="text-2xl font-bold mb-2">로그인</h1>
        <p className="text-gray-500 text-sm mb-8">한정 드랍, 지금 바로.</p>
        
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">이메일</label>
            <input 
              type="email" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent transition-all"
              placeholder="user@fors.com"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">비밀번호</label>
            <input 
              type="password" 
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent transition-all"
              placeholder="••••••••"
            />
          </div>
          
          {error && <p className="text-sm text-red-600 bg-red-50 p-3 rounded-lg">{error}</p>}
          
          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 text-white font-semibold py-3.5 rounded-xl hover:bg-indigo-700 transition-colors disabled:opacity-50 flex justify-center items-center gap-2"
          >
            {loading && (
              <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            )}
            로그인
          </button>
        </form>

        <div className="mt-6 text-sm text-gray-500">
          아직 계정이 없으신가요?{' '}
          <a href="/signup" className="text-indigo-600 font-semibold hover:underline">
            회원가입
          </a>
        </div>
      </div>
    </div>
  );
};

export default Login;
