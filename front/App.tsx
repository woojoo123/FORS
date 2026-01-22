
import React, { useState, useEffect, createContext, useContext } from 'react';
import { User, UserRole } from './types';
import Layout from './components/Layout';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Home from './pages/Home';
import DropList from './pages/DropList';
import DropDetail from './pages/DropDetail';
import OrderList from './pages/OrderList';
import OrderDetail from './pages/OrderDetail';
import AdminOrders from './pages/AdminOrders';
import ToastContainer from './components/ToastContainer';
import { api } from './api';

interface AppState {
  user: User | null;
  login: (email: string, role: UserRole) => void;
  logout: () => void;
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
  const [authChecked, setAuthChecked] = useState(false);
  const [toasts, setToasts] = useState<{ id: number; message: string; type: 'success' | 'error' }[]>([]);
  const [currentPath, setCurrentPath] = useState<string>(window.location.hash || '#/');

  useEffect(() => {
    const handleHashChange = () => {
      setCurrentPath(window.location.hash || '#/');
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  useEffect(() => {
    api<{ id: number; email: string; role: UserRole }>('/api/auth/me')
      .then((me) => {
        setUser({ email: me.email, role: me.role });
      })
      .catch(() => {
        setUser(null);
      })
      .finally(() => {
        setAuthChecked(true);
      });
  }, []);

  const login = (email: string, role: UserRole) => {
    setUser({ email, role });
    window.location.hash = '#/drops';
  };

  const logout = () => {
    api<void>('/api/auth/logout', { method: 'POST' }).catch(() => {});
    setUser(null);
    window.location.hash = '#/login';
  };

  const addToast = (message: string, type: 'success' | 'error') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3000);
  };

  const renderRoute = () => {
    if (!authChecked) {
      return (
        <div className="min-h-[60vh] flex items-center justify-center">
          <div className="flex flex-col items-center gap-3 text-gray-500">
            <div className="text-xl font-bold tracking-tight text-gray-900">FORS</div>
            <div className="h-6 w-6 border-2 border-gray-200 border-t-gray-900 rounded-full animate-spin" />
            <div className="text-xs uppercase tracking-[0.3em]">loading</div>
          </div>
        </div>
      );
    }

    if (currentPath === '#/login') return <Login />;
    if (currentPath === '#/signup') return <Signup />;
    if (currentPath === '#/' || currentPath === '#/home') return <Home />;

    // Auth Guard
    if (!user) {
      if (currentPath === '#/drops' || currentPath.startsWith('#/drops/')) {
        return currentPath.startsWith('#/drops/')
          ? (() => {
              const id = currentPath.split('/')[2];
              return <DropDetail id={id} />;
            })()
          : <DropList />;
      }
      return <Login />;
    }

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

  const state: AppState = { user, login, logout, addToast };

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
