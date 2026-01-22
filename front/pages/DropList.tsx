
import React, { useState, useEffect } from 'react';
import { useApp } from '../App';
import { Drop, DropStatus } from '../types';
import Badge from '../components/Badge';
import { api } from '../api';
import { DROP_STATUS_LABELS, FALLBACK_DROP_IMAGE, formatKRW } from '../constants';

const DropList: React.FC = () => {
  const { addToast } = useApp();
  const [drops, setDrops] = useState<Drop[]>([]);
  const [filter, setFilter] = useState<DropStatus | 'ALL'>('ALL');

  useEffect(() => {
    api<Drop[]>('/api/drops')
      .then(setDrops)
      .catch(() => addToast('드랍을 불러오지 못했어요.', 'error'));
  }, []);

  const filteredDrops = filter === 'ALL' 
    ? drops 
    : drops.filter(d => d.status === filter);

  const tabs: (DropStatus | 'ALL')[] = ['ALL', DropStatus.LIVE, DropStatus.SCHEDULED, DropStatus.ENDED];

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">드랍</h1>
          <p className="text-gray-500 mt-1">한정 수량, 한정 기회.</p>
        </div>
        
        <div className="flex p-1 bg-gray-100 rounded-xl">
          {tabs.map(tab => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${filter === tab ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-900'}`}
            >
              {tab === 'ALL' ? '전체' : DROP_STATUS_LABELS[tab]}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredDrops.map(drop => (
          <a
            key={drop.id}
            href={`#/drops/${drop.id}`}
            className="block bg-white border border-gray-200 rounded-2xl overflow-hidden group hover:shadow-xl hover:shadow-gray-200/50 transition-all duration-300 cursor-pointer"
          >
            <div className="aspect-square bg-gray-50 relative overflow-hidden">
              <img 
                src={drop.imageUrl} 
                alt={drop.name} 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = FALLBACK_DROP_IMAGE;
                }}
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors" />
              <div className="absolute top-4 left-4">
                <Badge status={drop.status} />
              </div>
            </div>
            
            <div className="p-6">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">{drop.brand}</p>
                  <h3 className="font-bold text-lg text-gray-900 leading-tight">{drop.name}</h3>
                </div>
                  <p className="font-bold text-indigo-600">{formatKRW(drop.price)}</p>
                </div>
              
              <div className="mt-6 flex items-center justify-between">
                <div className="text-xs text-gray-500">
                  {drop.status === DropStatus.LIVE ? (
                    <span className="flex items-center gap-1.5 text-indigo-600 font-semibold">
                      <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 animate-ping"></span>
                      마감 임박
                    </span>
                  ) : drop.status === DropStatus.SCHEDULED ? (
                    <span>오픈 {new Date(drop.startsAt).toLocaleDateString('ko-KR')}</span>
                  ) : (
                    <span>종료</span>
                  )}
                </div>
              </div>
            </div>
          </a>
        ))}
      </div>
      
      {filteredDrops.length === 0 && (
        <div className="text-center py-20 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
          <p className="text-gray-400">해당 조건의 드랍이 없습니다.</p>
        </div>
      )}
    </div>
  );
};

export default DropList;
