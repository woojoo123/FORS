import React, { useEffect, useMemo, useState } from 'react';
import { useApp } from '../App';
import { Drop } from '../types';
import Badge from '../components/Badge';
import { api } from '../api';
import { FALLBACK_DROP_IMAGE } from '../constants';

const Home: React.FC = () => {
  const { addToast } = useApp();
  const [drops, setDrops] = useState<Drop[]>([]);
  const [tab, setTab] = useState<'today' | 'new'>('today');

  useEffect(() => {
    api<Drop[]>('/api/drops')
      .then(setDrops)
      .catch(() => addToast('드랍을 불러오지 못했어요.', 'error'));
  }, []);

  const todayDrops = useMemo(() => {
    const now = new Date();
    const y = now.getFullYear();
    const m = now.getMonth();
    const d = now.getDate();
    return drops.filter(drop => {
      const end = new Date(drop.endsAt);
      return end.getFullYear() === y && end.getMonth() === m && end.getDate() === d;
    });
  }, [drops]);

  const newDrops = useMemo(() => {
    return [...drops]
      .sort((a, b) => new Date(b.startsAt).getTime() - new Date(a.startsAt).getTime())
      .slice(0, 6);
  }, [drops]);

  const activeDrops = tab === 'today' ? todayDrops : newDrops;

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-center border-b border-gray-200">
        <div className="flex gap-8 text-sm font-semibold text-gray-400">
          <button
            onClick={() => setTab('today')}
            className={`pb-4 transition-colors ${
              tab === 'today' ? 'text-gray-900 border-b-2 border-gray-900' : 'hover:text-gray-900'
            }`}
          >
            오늘 마감
          </button>
          <button
            onClick={() => setTab('new')}
            className={`pb-4 transition-colors ${
              tab === 'new' ? 'text-gray-900 border-b-2 border-gray-900' : 'hover:text-gray-900'
            }`}
          >
            신규 등록
          </button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row md:items-center justify-between text-sm text-gray-500 gap-3">
        <div className="font-medium text-gray-700">
          {new Date().toLocaleDateString('ko-KR', {
            month: 'long',
            day: 'numeric',
            weekday: 'short',
          })}
          <span className="text-gray-300 mx-2">|</span>
          {tab === 'today' ? `오늘 마감 ${todayDrops.length}` : `신규 등록 ${newDrops.length}`}
        </div>
        <div className="flex items-center gap-4 text-xs text-gray-400">
          <button className="flex items-center gap-2 hover:text-gray-700 transition-colors">
            <span className="text-sm">▤</span>
            필터
          </button>
          <button className="flex items-center gap-2 hover:text-gray-700 transition-colors">
            배송 유형: 전체
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        {activeDrops.map(drop => (
          <div key={drop.id} className="group">
            <div className="text-xs font-semibold text-red-500 mb-3">
              {tab === 'today'
                ? `마감 ${new Date(drop.endsAt).toLocaleTimeString('ko-KR', {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}`
                : `오픈 ${new Date(drop.startsAt).toLocaleTimeString('ko-KR', {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}`}
            </div>
            <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
              <div className="aspect-[4/3] bg-gray-50 flex items-center justify-center">
                <img
                  src={drop.imageUrl}
                  alt={drop.name}
                  className="w-full h-full object-contain group-hover:scale-[1.02] transition-transform duration-300"
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = FALLBACK_DROP_IMAGE;
                  }}
                />
              </div>
              <div className="p-5 border-t border-gray-200">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xs text-gray-400">{drop.brand}</p>
                    <p className="text-sm font-semibold text-gray-900 mt-1">{drop.name}</p>
                  </div>
                  <Badge status={drop.status} />
                </div>
                <div className="mt-4 flex items-center justify-between">
                  <div className="text-sm font-semibold text-gray-900">${drop.price}</div>
                  <a
                    href={`#/drops/${drop.id}`}
                    className="text-xs font-semibold bg-gray-100 text-gray-700 px-3 py-1.5 rounded-full hover:bg-gray-200 transition-colors"
                  >
                    상세보기
                  </a>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {activeDrops.length === 0 && (
        <div className="text-center py-20 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
          <p className="text-gray-400">해당 조건에 맞는 드랍이 없습니다.</p>
        </div>
      )}
    </div>
  );
};

export default Home;
