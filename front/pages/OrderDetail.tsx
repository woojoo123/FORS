
import React from 'react';
import { useApp } from '../App';
import { OrderStatus } from '../types';
import Badge from '../components/Badge';

const OrderDetail: React.FC<{ id: string }> = ({ id }) => {
  const { orders, updateOrder, addToast } = useApp();
  const order = orders.find(o => o.id === id);

  if (!order) return <div className="p-20 text-center">Order not found.</div>;

  const handleCancel = () => {
    updateOrder(order.id, { status: OrderStatus.CANCELED });
    addToast('Order canceled successfully', 'success');
  };

  const steps = [
    { label: 'Created', status: OrderStatus.PAYMENT_PENDING, active: true },
    { label: 'Paid', status: OrderStatus.PAID, active: [OrderStatus.PAID, OrderStatus.SHIPPING, OrderStatus.DELIVERED].includes(order.status) },
    { label: 'Shipping', status: OrderStatus.SHIPPING, active: [OrderStatus.SHIPPING, OrderStatus.DELIVERED].includes(order.status) },
    { label: 'Delivered', status: OrderStatus.DELIVERED, active: order.status === OrderStatus.DELIVERED },
  ];

  const isFailed = [OrderStatus.CANCELED, OrderStatus.EXPIRED].includes(order.status);

  return (
    <div className="max-w-4xl mx-auto space-y-10">
      <div className="flex justify-between items-center">
        <div>
          <a href="#/orders" className="text-sm font-bold text-indigo-600 hover:underline mb-2 block">← Back to Orders</a>
          <h1 className="text-3xl font-black text-gray-900">Order {order.id}</h1>
        </div>
        <Badge status={order.status} className="text-lg px-4 py-1.5" />
      </div>

      {!isFailed && (
        <div className="bg-white border border-gray-200 rounded-2xl p-8">
          <div className="flex justify-between relative">
            <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gray-100 -translate-y-1/2 z-0"></div>
            {steps.map((step, i) => (
              <div key={step.label} className="relative z-10 flex flex-col items-center gap-3 bg-white px-4">
                <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-colors ${step.active ? 'bg-indigo-600 border-indigo-600 text-white' : 'bg-white border-gray-200 text-gray-300'}`}>
                  {step.active ? (
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    <span className="text-xs font-bold">{i + 1}</span>
                  )}
                </div>
                <span className={`text-xs font-bold uppercase tracking-widest ${step.active ? 'text-indigo-600' : 'text-gray-400'}`}>{step.label}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {isFailed && (
        <div className="bg-red-50 border border-red-100 p-6 rounded-2xl flex items-center gap-4">
          <div className="bg-red-100 p-2 rounded-full text-red-600">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <div>
            <p className="font-bold text-red-900">This order was {order.status.toLowerCase()}.</p>
            <p className="text-sm text-red-700">Stock has been restored to the drop inventory. No charges were finalized.</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white border border-gray-200 rounded-2xl p-8 space-y-6">
          <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Order Summary</h2>
          <div className="flex gap-4">
            <img src={order.dropImage} className="w-20 h-20 rounded-xl object-cover bg-gray-50" />
            <div>
              <p className="text-lg font-bold text-gray-900">{order.dropName}</p>
              <p className="text-gray-500 font-medium">Size: {order.size}</p>
              <p className="text-gray-500 font-medium">Price: ${order.amount}</p>
            </div>
          </div>
          <div className="pt-6 border-t border-gray-100 space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Subtotal</span>
              <span className="font-bold text-gray-900">${order.amount}.00</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Shipping</span>
              <span className="font-bold text-gray-900">$0.00</span>
            </div>
            <div className="flex justify-between text-lg pt-2">
              <span className="font-bold text-gray-900">Total</span>
              <span className="font-black text-gray-900">${order.amount}.00</span>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-2xl p-8 space-y-6 h-fit">
          <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Details & Timeline</h2>
          <div className="space-y-4">
            <div className="flex justify-between text-sm border-b border-gray-50 pb-2">
              <span className="text-gray-500">Created</span>
              <span className="text-gray-900 font-medium">{new Date(order.createdAt).toLocaleString()}</span>
            </div>
            {order.paidAt && (
              <div className="flex justify-between text-sm border-b border-gray-50 pb-2">
                <span className="text-gray-500">Paid</span>
                <span className="text-gray-900 font-medium">{new Date(order.paidAt).toLocaleString()}</span>
              </div>
            )}
            {order.shippedAt && (
              <div className="flex flex-col gap-2 border-b border-gray-50 pb-2">
                <div className="flex justify-between text-sm">
                   <span className="text-gray-500">Shipped</span>
                   <span className="text-gray-900 font-medium">{new Date(order.shippedAt).toLocaleString()}</span>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg text-xs space-y-1">
                  <p className="flex justify-between">
                    <span className="text-gray-400">Carrier</span>
                    <span className="font-bold text-gray-600">{order.carrier}</span>
                  </p>
                  <p className="flex justify-between">
                    <span className="text-gray-400">Tracking</span>
                    <span className="font-mono text-indigo-600 font-bold">{order.trackingNo}</span>
                  </p>
                </div>
              </div>
            )}
            {order.status === OrderStatus.PAYMENT_PENDING && (
              <div className="pt-4">
                <button 
                  onClick={handleCancel}
                  className="w-full text-center text-sm font-bold text-red-600 hover:bg-red-50 py-3 rounded-xl transition-colors border border-red-100"
                >
                  Cancel Order
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;
