import React, { useState } from 'react';
import { useStore } from '../store';
import { LogOut, CalendarDays, User as UserIcon, RefreshCw } from 'lucide-react';
import { format } from 'date-fns';

export default function Layout({ children }: { children: React.ReactNode }) {
  const { currentUser, logout, resetStore } = useStore();

  if (!currentUser) return <>{children}</>;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <nav className="bg-blue-600 text-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center space-x-3">
              <CalendarDays className="w-8 h-8" />
              <span className="font-bold text-xl tracking-tight hidden sm:block">SIGRED-UPLA</span>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex flex-col text-right">
                <span className="text-sm font-medium">{currentUser.name}</span>
                <span className="text-xs text-blue-200 capitalize">{currentUser.role.toLowerCase()}</span>
              </div>
              <div className="h-8 w-8 bg-blue-500 rounded-full flex items-center justify-center">
                <UserIcon className="w-5 h-5 text-white" />
              </div>
              <button
                onClick={resetStore}
                className="ml-2 p-2 rounded-md text-blue-100 hover:text-white hover:bg-blue-700 transition-colors flex items-center"
                title="Resetear Datos"
              >
                <RefreshCw className="w-5 h-5" />
              </button>
              <button
                onClick={logout}
                className="p-2 rounded-md text-blue-100 hover:text-white hover:bg-blue-700 transition-colors"
                title="Cerrar Sesión"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </nav>
      
      {currentUser.penaltyUntil && new Date(currentUser.penaltyUntil) > new Date() && (
        <div className="bg-red-600 text-white px-4 py-3 text-center text-sm font-medium shadow-sm">
          ⚠️ Tienes una penalidad activa hasta el {format(new Date(currentUser.penaltyUntil), 'dd/MM/yyyy')} por inasistencia. No podrás reservar hasta entonces.
        </div>
      )}

      <main className="flex-1 w-full max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        {children}
      </main>
    </div>
  );
}
