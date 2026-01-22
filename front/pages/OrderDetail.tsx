
import React, { useEffect, useState } from 'react';
import { useApp } from '../App';
import { Drop, Order, OrderStatus } from '../types';
import Badge from '../components/Badge';
import { api } from '../api';
import { FALLBACK_DROP_IMAGE, formatKRW } from '../constants';

const OrderDetail: React.FC<{ id: string }> = ({ id }) => {
  const { addToast } = useApp();
  const [order, setOrder] = useState<Order | null>(null);

  useEffect(() => {
    const loadOrder = async () => {
      const orderId = Number(id);
      if (Number.isNaN(orderId)) {
        addToast('잘못된 주문 ID입니다.', 'error');
        return;
      }
      try {
        const rawOrder = await api<Order>(`/api/orders/${orderId}`);
        const drop = await api<Drop>(`/api/drops/${rawOrder.dropEventId}`);
        setOrder({
          ...rawOrder,
          dropName: drop.name,
          dropBrand: drop.brand,
          dropImageUrl: drop.imageUrl,
          amount: drop.price,
          sizeLabel: `SKU ${rawOrder.skuId}`,
        });
      } catch (err) {
        addToast('주문을 찾을 수 없습니다.', 'error');
      }
    };
    loadOrder();
  }, [id]);

  if (!order) return <div className="p-20 text-center">주문을 찾을 수 없습니다.</div>;

  const steps = [
    { label: '주문 생성', status: OrderStatus.PAYMENT_PENDING, active: true },
    { label: '결제 완료', status: OrderStatus.PAID, active: [OrderStatus.PAID, OrderStatus.SHIPPING, OrderStatus.DELIVERED].includes(order.status) },
    { label: '배송중', status: OrderStatus.SHIPPING, active: [OrderStatus.SHIPPING, OrderStatus.DELIVERED].includes(order.status) },
    { label: '배송 완료', status: OrderStatus.DELIVERED, active: order.status === OrderStatus.DELIVERED },
  ];

  const isFailed = [OrderStatus.CANCELED, OrderStatus.EXPIRED].includes(order.status);

  return (
    <div className="max-w-4xl mx-auto space-y-10">
      <div className="flex justify-between items-center">
        <div>
          <a href="#/orders" className="text-sm font-bold text-indigo-600 hover:underline mb-2 block">← 주문내역</a>
          <h1 className="text-3xl font-black text-gray-900">주문 {order.id}</h1>
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
            <p className="font-bold text-red-900">이 주문은 {order.status === OrderStatus.CANCELED ? '취소' : '만료'}되었습니다.</p>
            <p className="text-sm text-red-700">재고가 복구되었으며 결제는 확정되지 않았습니다.</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white border border-gray-200 rounded-2xl p-8 space-y-6">
          <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest">주문 요약</h2>
          <div className="flex gap-4">
            <img
              src={order.dropImageUrl}
              className="w-20 h-20 rounded-xl object-cover bg-gray-50"
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = FALLBACK_DROP_IMAGE;
              }}
            />
            <div>
              <p className="text-lg font-bold text-gray-900">{order.dropName}</p>
              <p className="text-gray-500 font-medium">사이즈: {order.sizeLabel}</p>
              <p className="text-gray-500 font-medium">가격: {formatKRW(order.amount)}</p>
            </div>
          </div>
          <div className="pt-6 border-t border-gray-100 space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">상품 금액</span>
              <span className="font-bold text-gray-900">{formatKRW(order.amount)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">배송비</span>
              <span className="font-bold text-gray-900">{formatKRW(0)}</span>
            </div>
            <div className="flex justify-between text-lg pt-2">
              <span className="font-bold text-gray-900">총 결제금액</span>
              <span className="font-black text-gray-900">{formatKRW(order.amount)}</span>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-2xl p-8 space-y-6 h-fit">
          <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest">상세 타임라인</h2>
          <div className="space-y-4">
            <div className="flex justify-between text-sm border-b border-gray-50 pb-2">
              <span className="text-gray-500">주문 생성</span>
              <span className="text-gray-900 font-medium">{new Date(order.createdAt).toLocaleString()}</span>
            </div>
            {order.paidAt && (
              <div className="flex justify-between text-sm border-b border-gray-50 pb-2">
                <span className="text-gray-500">결제 완료</span>
                <span className="text-gray-900 font-medium">{new Date(order.paidAt).toLocaleString()}</span>
              </div>
            )}
            {order.shippedAt && (
              <div className="flex flex-col gap-2 border-b border-gray-50 pb-2">
                <div className="flex justify-between text-sm">
                   <span className="text-gray-500">배송 시작</span>
                   <span className="text-gray-900 font-medium">{new Date(order.shippedAt).toLocaleString()}</span>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg text-xs space-y-1">
                  <p className="flex justify-between">
                    <span className="text-gray-400">택배사</span>
                    <span className="font-bold text-gray-600">{order.carrier}</span>
                  </p>
                  <p className="flex justify-between">
                    <span className="text-gray-400">운송장</span>
                    <span className="font-mono text-indigo-600 font-bold">{order.trackingNo}</span>
                  </p>
                </div>
              </div>
            )}
            {order.status === OrderStatus.PAYMENT_PENDING && (
              <div className="pt-4">
                <div className="w-full text-center text-sm font-bold text-gray-400 py-3 rounded-xl border border-gray-100">
                  취소 기능은 아직 준비중입니다
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;
