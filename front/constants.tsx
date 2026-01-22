
import { DropStatus, OrderStatus } from './types';

export const ACCENT_COLOR = 'indigo-600';
export const ACCENT_TEXT = 'text-indigo-600';
export const ACCENT_BG = 'bg-indigo-600';

export const DROP_STATUS_LABELS: Record<DropStatus, string> = {
  [DropStatus.LIVE]: '진행중',
  [DropStatus.SCHEDULED]: '예정',
  [DropStatus.ENDED]: '종료',
};

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  [OrderStatus.PAYMENT_PENDING]: '결제 대기',
  [OrderStatus.PAID]: '결제 완료',
  [OrderStatus.CANCELED]: '취소',
  [OrderStatus.EXPIRED]: '만료',
  [OrderStatus.SHIPPING]: '배송중',
  [OrderStatus.DELIVERED]: '배송 완료',
};

export const FALLBACK_DROP_IMAGE = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="800" viewBox="0 0 800 800">
    <rect width="800" height="800" fill="#f3f4f6"/>
    <circle cx="640" cy="140" r="120" fill="#e5e7eb"/>
    <circle cx="160" cy="660" r="140" fill="#e5e7eb"/>
    <text x="50%" y="50%" text-anchor="middle" dominant-baseline="middle" fill="#9ca3af" font-size="44" font-family="Arial, sans-serif" letter-spacing="6">FORS DROP</text>
  </svg>`
)}`;
