
import React, { useState, useEffect, createContext, useContext } from 'react';
import { User, Drop, Order, UserRole, DropStatus, OrderStatus } from './types';
import { INITIAL_DROPS, MOCK_USERS } from './constants';
import Layout from './components/Layout';
import Login from './pages/Login';
import DropList from './pages/DropList';
import DropDetail from './pages/DropDetail';
import OrderList from './pages/OrderList';
import OrderDetail from './pages/OrderDetail';
import AdminOrders from './pages/AdminOrders';
import ToastContainer from './components/ToastContainer';

interface AppState {
  user: User | null;
  drops: Drop[];
  orders: Order[];
  login: (email: string, role: UserRole) => void;
  logout: () => void;
  addOrder: (order: Order) => void;
  updateOrder: (orderId: string, updates: Partial<Order>) => void;
  addToast: (msg: string, type: 'success' | 'error') => void;
}

const AppContext = createContext<AppState | undefined>(undefined);

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [drops, setDrops] = useState<Drop[]>(INITIAL_DROPS);
  const [orders, setOrders] = useState<Order[]>([]);
  const [toasts, setToasts] = useState<{ id: number; message: string; type: 'success' | 'error' }[]>([]);
  const [currentPath, setCurrentPath] = useState<string>(window.location.hash || '#/drops');

  useEffect(() => {
    const handleHashChange = () => {
      setCurrentPath(window.location.hash || '#/drops');
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const login = (email: string, role: UserRole) => {
    setUser({ email, role });
    window.location.hash = '#/drops';
  };

  const logout = () => {
    setUser(null);
    window.location.hash = '#/login';
  };

  const addOrder = (order: Order) => {
    setOrders(prev => [order, ...prev]);
    // Simulate inventory reduction
    setDrops(prev => prev.map(d => d.id === order.dropId ? { ...d, remainingQty: d.remainingQty - 1 } : d));
  };

  const updateOrder = (orderId: string, updates: Partial<Order>) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, ...updates } : o));
    
    // If order is canceled or expired, restore stock
    if (updates.status === OrderStatus.CANCELED || updates.status === OrderStatus.EXPIRED) {
      const order = orders.find(o => o.id === orderId);
      if (order) {
        setDrops(prev => prev.map(d => d.id === order.dropId ? { ...d, remainingQty: d.remainingQty + 1 } : d));
      }
    }
  };

  const addToast = (message: string, type: 'success' | 'error') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3000);
  };

  const renderRoute = () => {
    if (currentPath === '#/login') return <Login />;
    
    // Auth Guard
    if (!user) return <Login />;

    if (currentPath.startsWith('#/drops/')) {
      const id = currentPath.split('/')[2];
      return <DropDetail id={id} />;
    }
    if (currentPath === '#/drops') return <DropList />;
    if (currentPath === '#/orders') return <OrderList />;
    if (currentPath.startsWith('#/orders/')) {
      const id = currentPath.split('/')[2];
      return <OrderDetail id={id} />;
    }
    if (currentPath === '#/admin/orders' && user.role === UserRole.ADMIN) return <AdminOrders />;
    
    return <DropList />;
  };

  const state: AppState = { user, drops, orders, login, logout, addOrder, updateOrder, addToast };

  return (
    <AppContext.Provider value={state}>
      <Layout>
        {renderRoute()}
      </Layout>
      <ToastContainer toasts={toasts} />
    </AppContext.Provider>
  );
};

export default App;
