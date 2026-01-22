
import React from 'react';
import { DropStatus, OrderStatus } from '../types';
import { DROP_STATUS_LABELS, ORDER_STATUS_LABELS } from '../constants';

interface BadgeProps {
  status: DropStatus | OrderStatus;
  className?: string;
}

const Badge: React.FC<BadgeProps> = ({ status, className = "" }) => {
  const styles: Record<string, string> = {
    // Drop Statuses
    [DropStatus.LIVE]: "bg-indigo-100 text-indigo-700 border-indigo-200 animate-pulse",
    [DropStatus.SCHEDULED]: "bg-amber-50 text-amber-700 border-amber-200",
    [DropStatus.ENDED]: "bg-gray-100 text-gray-500 border-gray-200",
    
    // Order Statuses
    [OrderStatus.PAYMENT_PENDING]: "bg-blue-50 text-blue-700 border-blue-200",
    [OrderStatus.PAID]: "bg-emerald-50 text-emerald-700 border-emerald-200",
    [OrderStatus.CANCELED]: "bg-red-50 text-red-700 border-red-200",
    [OrderStatus.EXPIRED]: "bg-gray-100 text-gray-500 border-gray-200",
    [OrderStatus.SHIPPING]: "bg-indigo-50 text-indigo-700 border-indigo-200",
    [OrderStatus.DELIVERED]: "bg-gray-900 text-white border-transparent",
  };

  const label =
    status in DROP_STATUS_LABELS
      ? DROP_STATUS_LABELS[status as DropStatus]
      : ORDER_STATUS_LABELS[status as OrderStatus] ?? status.replace('_', ' ');

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${styles[status] || ""} ${className}`}>
      {label}
    </span>
  );
};

export default Badge;
