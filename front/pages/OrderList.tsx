
import React, { useState } from 'react';
import { useApp } from '../App';
import { OrderStatus } from '../types';
import Badge from '../components/Badge';

const OrderList: React.FC = () => {
  const { orders, user } = useApp();
  const [statusFilter, setStatusFilter] = useState<OrderStatus | 'ALL'>('ALL');

  const myOrders = orders.filter(o => o.userEmail === user?.email);
  const filteredOrders = statusFilter === 'ALL' 
    ? myOrders 
    : myOrders.filter(o => o.status === statusFilter);

  const filterOptions: (OrderStatus | 'ALL')[] = [
    'ALL', 
    OrderStatus.PAYMENT_PENDING, 
    OrderStatus.PAID, 
    OrderStatus.SHIPPING, 
    OrderStatus.DELIVERED,
    OrderStatus.CANCELED
  ];

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">My Orders</h1>
          <p className="text-gray-500 mt-1">Manage your wins and fulfillment status.</p>
        </div>
        
        <div className="relative">
          <select 
            className="appearance-none bg-white border border-gray-200 px-4 py-2 pr-10 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-600 transition-all"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
          >
            {filterOptions.map(opt => (
              <option key={opt} value={opt}>{opt === 'ALL' ? 'All Statuses' : opt.replace('_', ' ')}</option>
            ))}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-400">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Date</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Order ID</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Product</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Size</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Amount</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Status</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredOrders.map(order => (
                <tr key={order.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-5 text-sm text-gray-600">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-5 text-sm font-mono font-medium text-gray-900">
                    {order.id}
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-3">
                      <img src={order.dropImage} className="w-10 h-10 rounded-lg object-cover bg-gray-100" />
                      <div>
                        <p className="text-sm font-bold text-gray-900">{order.dropName}</p>
                        <p className="text-xs text-gray-400">{order.dropBrand}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5 text-sm text-gray-600">
                    {order.size}
                  </td>
                  <td className="px-6 py-5 text-sm font-bold text-gray-900">
                    ${order.amount}
                  </td>
                  <td className="px-6 py-5">
                    <Badge status={order.status} />
                    {order.status === OrderStatus.PAYMENT_PENDING && (
                      <p className="text-[10px] text-gray-400 mt-1">Exp: {new Date(order.expiresAt!).toLocaleTimeString()}</p>
                    )}
                  </td>
                  <td className="px-6 py-5">
                    <a 
                      href={`#/orders/${order.id}`}
                      className="text-indigo-600 hover:text-indigo-800 text-sm font-bold"
                    >
                      Details
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {filteredOrders.length === 0 && (
          <div className="py-20 text-center space-y-4">
            <div className="inline-flex p-4 bg-gray-50 rounded-full text-gray-300">
              <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
            <p className="text-gray-400 font-medium">No orders found.</p>
            <a href="#/drops" className="inline-block text-indigo-600 font-bold hover:underline">Browse drops</a>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderList;
