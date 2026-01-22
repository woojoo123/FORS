
import { Drop, DropStatus, OrderStatus, UserRole } from './types';

export const ACCENT_COLOR = 'indigo-600';
export const ACCENT_TEXT = 'text-indigo-600';
export const ACCENT_BG = 'bg-indigo-600';

export const INITIAL_DROPS: Drop[] = [
  {
    id: 'd1',
    name: 'Air Jordan 1 Low "Wolf Grey"',
    brand: 'Jordan',
    price: 130,
    image: 'https://picsum.photos/seed/jordan1/600/600',
    description: 'The Air Jordan 1 Low Wolf Grey features a premium leather upper with cool grey overlays. A timeless silhouette for daily rotation.',
    opensAt: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
    endsAt: new Date(Date.now() + 3600000).toISOString(),  // 1 hour from now
    remainingQty: 12,
    status: DropStatus.LIVE
  },
  {
    id: 'd2',
    name: 'Yeezy Boost 350 V2 "Bone"',
    brand: 'Adidas',
    price: 230,
    image: 'https://picsum.photos/seed/yeezy/600/600',
    description: 'Clean, versatile, and comfortable. The Yeezy Boost 350 V2 Bone features a monochromatic primeknit upper.',
    opensAt: new Date(Date.now() + 86400000).toISOString(), // Tomorrow
    endsAt: new Date(Date.now() + 90000000).toISOString(),
    remainingQty: 50,
    status: DropStatus.SCHEDULED
  },
  {
    id: 'd3',
    name: 'Dunk Low "Panda"',
    brand: 'Nike',
    price: 115,
    image: 'https://picsum.photos/seed/panda/600/600',
    description: 'The classic black and white color blocking that took over the world. Durable leather construction.',
    opensAt: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
    endsAt: new Date(Date.now() - 169200000).toISOString(),
    remainingQty: 0,
    status: DropStatus.ENDED
  }
];

export const MOCK_USERS = [
  { email: 'user@fors.com', password: 'password', role: UserRole.USER },
  { email: 'admin@fors.com', password: 'password', role: UserRole.ADMIN }
];

export const SIZES = ['US 7', 'US 8', 'US 9', 'US 10', 'US 11', 'US 12'];
