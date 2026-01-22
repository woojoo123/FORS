
import React from 'react';
import { useApp } from '../App';
import { UserRole } from '../types';
import { ACCENT_TEXT } from '../constants';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, logout } = useApp();

  return (
    <div className="min-h-screen flex flex-col">
      <nav className="sticky top-0 z-50 bg-white border-b border-gray-200 py-4 px-6 sm:px-12 flex justify-between items-center">
        <div className="flex items-center gap-10">
          <a href="#/drops" className="text-xl font-bold tracking-tight">FORS</a>
          {user && (
            <div className="hidden md:flex gap-6 text-sm font-medium text-gray-600">
              <a href="#/drops" className="hover:text-black transition-colors">Drops</a>
              <a href="#/orders" className="hover:text-black transition-colors">My Orders</a>
              {user.role === UserRole.ADMIN && (
                <a href="#/admin/orders" className="hover:text-black transition-colors font-semibold border-l pl-6 border-gray-200">Admin</a>
              )}
            </div>
          )}
        </div>
        
        <div className="flex items-center gap-4 text-sm font-medium">
          {user ? (
            <>
              <span className="text-gray-400 hidden sm:inline">{user.email}</span>
              <button 
                onClick={logout}
                className="text-gray-900 hover:bg-gray-100 px-3 py-1.5 rounded-lg transition-colors"
              >
                Sign out
              </button>
            </>
          ) : (
            <a href="#/login" className={`bg-black text-white px-5 py-2 rounded-lg transition-all hover:opacity-90`}>
              Sign in
            </a>
          )}
        </div>
      </nav>
      
      <main className="flex-1 w-full max-w-7xl mx-auto py-8 px-6 sm:px-12">
        {children}
      </main>

      <footer className="border-t border-gray-200 py-8 px-12 text-center text-sm text-gray-400">
        &copy; {new Date().getFullYear()} FORS Commerce MVP. All rights reserved.
      </footer>
    </div>
  );
};

export default Layout;
