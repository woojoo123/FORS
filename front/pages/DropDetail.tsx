
import React, { useState, useEffect } from 'react';
import { useApp } from '../App';
import { Drop, DropStatus, OrderStatus, Order, Stock } from '../types';
import Badge from '../components/Badge';
import { api } from '../api';
import { FALLBACK_DROP_IMAGE, formatKRW } from '../constants';

const DropDetail: React.FC<{ id: string }> = ({ id }) => {
  const { addToast, user } = useApp();
  const [drop, setDrop] = useState<Drop | null>(null);
  const [selectedSkuId, setSelectedSkuId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [currentOrder, setCurrentOrder] = useState<Order | null>(null);

  useEffect(() => {
    const dropId = Number(id);
    if (Number.isNaN(dropId)) {
      addToast('잘못된 드랍 ID입니다.', 'error');
      return;
    }
    api<Drop>(`/api/drops/${dropId}`)
      .then(setDrop)
      .catch(() => addToast('드랍을 찾을 수 없습니다.', 'error'));
  }, [id]);

  if (!drop) return <div className="p-20 text-center">드랍을 찾을 수 없습니다.</div>;

  const handleCreateOrder = async () => {
    if (!selectedSkuId) {
      addToast('사이즈를 선택해주세요.', 'error');
      return;
    }
    if (!user) {
      window.location.hash = '#/login';
      return;
    }

    setLoading(true);
    try {
      const idempotencyKey = crypto.randomUUID();
      const res = await api<{ id: number; status: string; expiresAt: string }>('/api/orders', {
        method: 'POST',
        headers: { 'Idempotency-Key': idempotencyKey },
        body: JSON.stringify({
          dropEventId: drop.id,
          skuId: selectedSkuId,
          amount: drop.price,
        }),
      });
      const sizeLabel = `SKU ${selectedSkuId}`;
      const newOrder: Order = {
        id: res.id,
        dropEventId: drop.id,
        skuId: selectedSkuId,
        status: res.status as OrderStatus,
        createdAt: new Date().toISOString(),
        expiresAt: res.expiresAt,
        amount: drop.price,
        dropName: drop.name,
        dropBrand: drop.brand,
        dropImageUrl: drop.imageUrl,
        sizeLabel,
      };
      setCurrentOrder(newOrder);
      addToast('주문이 생성되었습니다. 5분 내 결제를 완료해주세요.', 'success');
    } catch (err) {
      addToast('주문 생성에 실패했습니다.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = async (success: boolean) => {
    if (!currentOrder) return;
    setLoading(true);
    try {
      const result = success ? 'SUCCEED' : 'FAIL';
      const res = await api<{ orderId: number; orderStatus: string; paymentStatus: string }>(
        `/api/orders/${currentOrder.id}/pay`,
        {
          method: 'POST',
          body: JSON.stringify({ result }),
        }
      );
      setCurrentOrder(prev => prev ? { ...prev, status: res.orderStatus as OrderStatus } : null);
      addToast(success ? '결제가 완료되었습니다.' : '결제에 실패했습니다.', success ? 'success' : 'error');
    } catch (err) {
      addToast('결제 요청에 실패했습니다.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const isLive = drop.status === DropStatus.LIVE;
  const isSoldOut = drop.remainingQty <= 0;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
      <div className="lg:col-span-7 space-y-8">
        <div className="aspect-square bg-white border border-gray-200 rounded-2xl overflow-hidden p-8 flex items-center justify-center">
          <img
            src={drop.imageUrl}
            alt={drop.name}
            className="max-w-full h-auto object-contain"
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = FALLBACK_DROP_IMAGE;
            }}
          />
        </div>
        
        <div>
          <div className="mb-4">
            <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">{drop.brand}</p>
            <h1 className="text-4xl font-black text-gray-900 leading-tight">{drop.name}</h1>
          </div>
          <p className="text-gray-600 leading-relaxed text-lg max-w-2xl">{drop.description}</p>
        </div>
      </div>

      <div className="lg:col-span-5">
        <div className="sticky top-32 bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
          <div className="p-8 border-b border-gray-100 flex justify-between items-center">
            <Badge status={drop.status} />
            <p className="text-2xl font-bold text-gray-900">{formatKRW(drop.price)}</p>
          </div>
          
          <div className="p-8 space-y-6">
            {!currentOrder ? (
              <>
                <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">사이즈 선택</label>
                  <div className="grid grid-cols-3 gap-2">
                    {(drop.stocks ?? []).map((stock: Stock) => (
                      <button
                        key={stock.skuId}
                        onClick={() => setSelectedSkuId(stock.skuId)}
                        disabled={stock.remainingQty <= 0}
                        className={`py-3 text-sm font-bold rounded-xl border transition-all ${selectedSkuId === stock.skuId ? 'bg-black text-white border-black' : 'bg-white text-gray-900 border-gray-200 hover:border-gray-900'} disabled:opacity-50 disabled:cursor-not-allowed`}
                      >
                        <div className="flex flex-col items-center gap-1 leading-tight">
                          <span>SKU {stock.skuId}</span>
                          <span className={`text-[10px] font-medium ${stock.remainingQty > 0 ? 'text-gray-400' : 'text-red-500'}`}>
                            {stock.remainingQty > 0 ? `잔여 ${stock.remainingQty}개` : '품절'}
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-xl space-y-2">
                  <div className="flex justify-between text-sm">
                      <span className="text-gray-500">남은 수량</span>
                      <span className="font-bold text-gray-900">{drop.remainingQty}개</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">구매 제한</span>
                      <span className="font-bold text-gray-900">1인 1개</span>
                    </div>
                  </div>

                <button
                  disabled={!isLive || isSoldOut || loading}
                  onClick={handleCreateOrder}
                  className="w-full bg-indigo-600 text-white font-bold py-4 rounded-xl hover:bg-indigo-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2 text-lg shadow-lg shadow-indigo-100"
                >
                  {loading && (
                    <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  )}
                  {isSoldOut ? '품절' : !isLive ? '진행중이 아님' : '구매하기'}
                </button>

                <p className="text-center text-xs text-gray-400">주문 생성 후 5분 내 결제가 필요합니다.</p>
              </>
            ) : (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
                <div className="bg-emerald-50 border border-emerald-100 p-6 rounded-2xl">
                  <div className="flex justify-between items-center mb-4">
                    <p className="text-sm font-bold text-emerald-800">주문 생성</p>
                    <Badge status={currentOrder.status} />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-emerald-700">주문 ID</span>
                      <span className="font-mono font-bold text-emerald-900">{currentOrder.id}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-emerald-700">만료 시간</span>
                      <span className="font-bold text-emerald-900">
                        {new Date(currentOrder.expiresAt!).toLocaleTimeString()}
                      </span>
                    </div>
                  </div>
                </div>

                {currentOrder.status === OrderStatus.PAYMENT_PENDING && (
                  <div className="space-y-3">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider text-center">결제 시뮬레이션</p>
                    <div className="flex gap-4">
                      <button 
                        onClick={() => handlePayment(true)}
                        disabled={loading}
                        className="flex-1 bg-emerald-600 text-white font-bold py-3 rounded-xl hover:bg-emerald-700 transition-colors disabled:opacity-50"
                      >
                        결제 성공
                      </button>
                      <button 
                        onClick={() => handlePayment(false)}
                        disabled={loading}
                        className="flex-1 bg-red-600 text-white font-bold py-3 rounded-xl hover:bg-red-700 transition-colors disabled:opacity-50"
                      >
                        결제 실패
                      </button>
                    </div>
                    <a href="#/orders" className="block text-center text-sm font-medium text-gray-500 hover:text-black mt-4 underline">내 주문에서 보기</a>
                  </div>
                )}

                {currentOrder.status === OrderStatus.PAID && (
                  <div className="text-center space-y-4">
                    <div className="p-3 bg-emerald-100 text-emerald-800 rounded-full inline-flex">
                      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <p className="font-bold text-xl">결제가 완료되었습니다!</p>
                    <p className="text-gray-500 text-sm">상품이 확보되었습니다. 배송 시작 시 알려드릴게요.</p>
                    <a href="#/orders" className="block bg-black text-white font-bold py-3 rounded-xl">주문내역 보기</a>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DropDetail;
