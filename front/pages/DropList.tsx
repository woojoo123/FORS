
import React, { useState } from 'react';
import { useApp } from '../App';
import { DropStatus } from '../types';
import Badge from '../components/Badge';

const DropList: React.FC = () => {
  const { drops } = useApp();
  const [filter, setFilter] = useState<DropStatus | 'ALL'>('ALL');

  const filteredDrops = filter === 'ALL' 
    ? drops 
    : drops.filter(d => d.status === filter);

  const tabs: (DropStatus | 'ALL')[] = ['ALL', DropStatus.LIVE, DropStatus.SCHEDULED, DropStatus.ENDED];

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Drops</h1>
          <p className="text-gray-500 mt-1">Exclusive releases, limited quantities.</p>
        </div>
        
        <div className="flex p-1 bg-gray-100 rounded-xl">
          {tabs.map(tab => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${filter === tab ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-900'}`}
            >
              {tab.charAt(0) + tab.slice(1).toLowerCase()}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredDrops.map(drop => (
          <div key={drop.id} className="bg-white border border-gray-200 rounded-2xl overflow-hidden group hover:shadow-xl hover:shadow-gray-200/50 transition-all duration-300">
            <div className="aspect-square bg-gray-50 relative overflow-hidden">
              <img 
                src={drop.image} 
                alt={drop.name} 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
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
                <p className="font-bold text-indigo-600">${drop.price}</p>
              </div>
              
              <div className="mt-6 flex items-center justify-between">
                <div className="text-xs text-gray-500">
                  {drop.status === DropStatus.LIVE ? (
                    <span className="flex items-center gap-1.5 text-indigo-600 font-semibold">
                      <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 animate-ping"></span>
                      Ending soon
                    </span>
                  ) : drop.status === DropStatus.SCHEDULED ? (
                    <span>Opens {new Date(drop.opensAt).toLocaleDateString()}</span>
                  ) : (
                    <span>Sold out</span>
                  )}
                </div>
                
                <a 
                  href={`#/drops/${drop.id}`}
                  className="bg-black text-white px-5 py-2 text-sm font-semibold rounded-lg hover:bg-gray-800 transition-colors"
                >
                  View Detail
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {filteredDrops.length === 0 && (
        <div className="text-center py-20 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
          <p className="text-gray-400">No drops found for this filter.</p>
        </div>
      )}
    </div>
  );
};

export default DropList;
