
export enum UserRole {
  USER = 'USER',
  ADMIN = 'ADMIN'
}

export enum DropStatus {
  LIVE = 'LIVE',
  SCHEDULED = 'SCHEDULED',
  ENDED = 'ENDED'
}

export enum OrderStatus {
  PAYMENT_PENDING = 'PAYMENT_PENDING',
  PAID = 'PAID',
  CANCELED = 'CANCELED',
  EXPIRED = 'EXPIRED',
  SHIPPING = 'SHIPPING',
  DELIVERED = 'DELIVERED'
}

export interface User {
  email: string;
  role: UserRole;
}

export interface Stock {
  skuId: number;
  remainingQty: number;
}

export interface Drop {
  id: number;
  name: string;
  brand: string;
  price: number;
  imageUrl: string;
  description: string;
  startsAt: string;
  endsAt: string;
  remainingQty: number;
  status: DropStatus;
  stocks?: Stock[];
}

export interface Order {
  id: number;
  userId?: number;
  dropEventId: number;
  skuId: number;
  status: OrderStatus;
  createdAt: string;
  expiresAt?: string;
  paidAt?: string;
  shippedAt?: string;
  deliveredAt?: string;
  carrier?: string;
  trackingNo?: string;
  amount?: number;
  dropName?: string;
  dropBrand?: string;
  dropImageUrl?: string;
  sizeLabel?: string;
}
