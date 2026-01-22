
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

export interface Drop {
  id: string;
  name: string;
  brand: string;
  price: number;
  image: string;
  description: string;
  opensAt: string;
  endsAt: string;
  remainingQty: number;
  status: DropStatus;
}

export interface Order {
  id: string;
  userId: string;
  userEmail: string;
  dropId: string;
  dropName: string;
  dropBrand: string;
  dropImage: string;
  size: string;
  amount: number;
  status: OrderStatus;
  createdAt: string;
  expiresAt?: string;
  paidAt?: string;
  shippedAt?: string;
  deliveredAt?: string;
  carrier?: string;
  trackingNo?: string;
}
