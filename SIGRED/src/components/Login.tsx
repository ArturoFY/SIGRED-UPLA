import React, { useState } from 'react';
import { useStore } from '../store';
import { LogIn } from 'lucide-react';

export default function Login() {
  const { login } = useStore();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      login(email);
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="bg-blue-600 p-3 rounded-full">
            <LogIn className="w-8 h-8 text-white" />
          </div>
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          SIGRED-UPLA
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Sistema de Gestión y Reserva de Espacios Deportivos
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-xl sm:px-10 border border-gray-100">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Correo Institucional
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="ej. estudiante@ms.upla.edu.pe"
                />
              </div>
            </div>

            {error && (
              <div className="text-red-600 text-sm bg-red-50 p-3 rounded-md border border-red-100">
                {error}
              </div>
            )}

            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Ingresar
              </button>
            </div>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Cuentas de prueba</span>
              </div>
            </div>
            <div className="mt-6 grid grid-cols-1 gap-2 text-xs text-gray-500 text-center">
              <button onClick={() => setEmail('estudiante@ms.upla.edu.pe')} className="hover:text-blue-600">estudiante@ms.upla.edu.pe (Estudiante)</button>
              <button onClick={() => setEmail('admin@upla.edu.pe')} className="hover:text-blue-600">admin@upla.edu.pe (DGA)</button>
              <button onClick={() => setEmail('vigilante@upla.edu.pe')} className="hover:text-blue-600">vigilante@upla.edu.pe (Vigilancia)</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
