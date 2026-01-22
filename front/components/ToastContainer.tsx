
import React from 'react';

interface Toast {
  id: number;
  message: string;
  type: 'success' | 'error';
}

const ToastContainer: React.FC<{ toasts: Toast[] }> = ({ toasts }) => {
  return (
    <div className="fixed bottom-6 right-6 z-[60] flex flex-col gap-3">
      {toasts.map(toast => (
        <div 
          key={toast.id}
          className={`px-4 py-3 rounded-xl shadow-lg border text-sm font-medium flex items-center gap-3 animate-in slide-in-from-right fade-in duration-300
            ${toast.type === 'success' ? 'bg-white text-gray-900 border-emerald-100' : 'bg-white text-red-700 border-red-100'}`}
        >
          {toast.type === 'success' ? (
             <svg className="w-5 h-5 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
             </svg>
          ) : (
            <svg className="w-5 h-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          )}
          {toast.message}
        </div>
      ))}
    </div>
  );
};

export default ToastContainer;
