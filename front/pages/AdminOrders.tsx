
import React, { useState, useEffect } from 'react';
import { useApp } from '../App';
import { OrderStatus, Order } from '../types';
import Badge from '../components/Badge';
import { api } from '../api';
import { ORDER_STATUS_LABELS, formatKRW } from '../constants';

const AdminOrders: React.FC = () => {
  const { addToast } = useApp();
  const [orders, setOrders] = useState<Order[]>([]);
  const [statusFilter, setStatusFilter] = useState<OrderStatus | 'ALL'>('ALL');
  const [search, setSearch] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  
  // Shipping form state
  const [carrier, setCarrier] = useState('UPS');
  const [tracking, setTracking] = useState('');

  useEffect(() => {
    const loadOrders = async () => {
      try {
        const data = await api<Order[]>('/api/admin/orders');
        setOrders(data);
      } catch (err) {
        addToast('관리자 주문을 불러오지 못했습니다.', 'error');
      }
    };
    loadOrders();
  }, []);

  const filteredOrders = orders.filter(o => {
    const matchesStatus = statusFilter === 'ALL' || o.status === statusFilter;
    const idMatch = String(o.id).toLowerCase().includes(search.toLowerCase());
    const userMatch = String(o.userId ?? '').toLowerCase().includes(search.toLowerCase());
    return matchesStatus && (idMatch || userMatch);
  });

  const handleShip = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOrder || !tracking) return;
    
    try {
      await api<Order>(`/api/admin/orders/${selectedOrder.id}/ship`, {
        method: 'POST',
      });
      setOrders(prev => prev.map(o => o.id === selectedOrder.id ? { ...o, status: OrderStatus.SHIPPING } : o));
      addToast(`주문 ${selectedOrder.id} 배송 처리가 시작되었습니다.`, 'success');
      setSelectedOrder(null);
      setTracking('');
    } catch (err) {
      addToast('배송 처리에 실패했습니다.', 'error');
    }
  };

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">관리자 · 주문</h1>
          <p className="text-gray-500 mt-1">주문 및 배송 상태를 관리합니다.</p>
        </div>
        
        <div className="flex gap-4">
          <div className="relative">
              <input 
              type="text"
              placeholder="주문/드랍 ID 검색..."
              className="bg-white border border-gray-200 px-4 py-2 pl-10 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-600 w-64"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
               <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
               </svg>
            </div>
          </div>
          
          <select 
            className="bg-white border border-gray-200 px-4 py-2 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-600"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
          >
            <option value="ALL">전체 상태</option>
            {Object.values(OrderStatus).map(v => (
              <option key={v} value={v}>{ORDER_STATUS_LABELS[v]}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">주문번호</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">사용자</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">상품</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">상세</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">상태</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">작업</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {filteredOrders.map(order => (
                <tr key={order.id} className="hover:bg-gray-50/50">
                  <td className="px-6 py-5 font-mono font-bold text-gray-900">{order.id}</td>
                  <td className="px-6 py-5">
                    <p className="font-medium text-gray-900">사용자 #{order.userId ?? '—'}</p>
                    <p className="text-xs text-gray-400">{new Date(order.createdAt).toLocaleDateString()}</p>
                  </td>
                  <td className="px-6 py-5">
                    <p className="font-bold text-gray-900">드랍 #{order.dropEventId}</p>
                    <p className="text-xs text-gray-400">SKU {order.skuId}</p>
                  </td>
                  <td className="px-6 py-5">
                    <p className="text-gray-600">SKU {order.skuId}</p>
                    <p className="font-bold text-gray-900">{formatKRW(order.amount)}</p>
                  </td>
                  <td className="px-6 py-5"><Badge status={order.status} /></td>
                  <td className="px-6 py-5">
                    {order.status === OrderStatus.PAID && (
                      <button 
                        onClick={() => setSelectedOrder(order)}
                        className="bg-indigo-600 text-white text-xs font-bold px-3 py-1.5 rounded-lg hover:bg-indigo-700 transition-colors"
                      >
                        배송 처리
                      </button>
                    )}
                    {![OrderStatus.PAID, OrderStatus.SHIPPING].includes(order.status) && (
                      <span className="text-gray-300">—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredOrders.length === 0 && (
          <div className="py-20 text-center text-gray-400">일치하는 주문이 없습니다.</div>
        )}
      </div>

      {/* Ship Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-6">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
              <h3 className="font-bold text-lg">주문 {selectedOrder.id} 배송 처리</h3>
              <button onClick={() => setSelectedOrder(null)} className="text-gray-400 hover:text-gray-900">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <form onSubmit={handleShip} className="p-6 space-y-6">
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">택배사</label>
                <select 
                  className="w-full bg-gray-50 border border-gray-200 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-600"
                  value={carrier}
                  onChange={(e) => setCarrier(e.target.value)}
                >
                  <option>UPS</option>
                  <option>FedEx</option>
                  <option>DHL</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">운송장 번호</label>
                <input 
                  autoFocus
                  required
                  type="text" 
                  className="w-full bg-gray-50 border border-gray-200 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-600"
                  placeholder="예: 1Z999AA10123456784"
                  value={tracking}
                  onChange={(e) => setTracking(e.target.value)}
                />
              </div>
              
              <div className="pt-4 flex gap-3">
                 <button 
                  type="button"
                  onClick={() => setSelectedOrder(null)}
                  className="flex-1 text-sm font-bold text-gray-500 hover:bg-gray-100 py-3 rounded-xl"
                 >
                   취소
                 </button>
                 <button 
                  type="submit"
                  className="flex-1 bg-indigo-600 text-white font-bold text-sm py-3 rounded-xl shadow-lg shadow-indigo-100"
                 >
                   배송 처리
                 </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminOrders;
