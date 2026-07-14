import React, { useState } from 'react';
import { useStore } from '../store';
import { Facility, Reservation, ReservationStatus } from '../types';
import { formatTimeSlot, FACILITY_NAMES, cn } from '../lib/utils';
import { Check, X, FileText, BarChart, Settings, Users, AlertCircle, Eye, Download, Calendar, MapPin, Clock, Search, CheckCircle2, PenTool } from 'lucide-react';
import { format } from 'date-fns';

export default function AdminDashboard() {
  const { reservations, users, updateReservationStatus, createReservation, resolveAppeal } = useStore();
  const [activeTab, setActiveTab] = useState<'REQUESTS' | 'FIXED' | 'REPORTS' | 'APPEALS'>('REQUESTS');
  const [rejectId, setRejectId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState('');
  const [viewDocUrl, setViewDocUrl] = useState<{name: string, url?: string} | null>(null);
  const [approveId, setApproveId] = useState<string | null>(null);
  const [notification, setNotification] = useState<{type: 'success' | 'error', message: string, title?: string} | null>(null);
  
  const [appealConfirm, setAppealConfirm] = useState<{userId: string, approve: boolean} | null>(null);

  const pendingRequests = reservations.filter(r => r.status === 'PENDING').sort((a,b) => new Date(`${a.date}T${a.time}`).getTime() - new Date(`${b.date}T${b.time}`).getTime());
  const pendingAppeals = users.filter(u => u.penaltyAppealStatus === 'PENDING');
  
  const handleApproveConfirm = () => {
    if (approveId) {
      const res = reservations.find(r => r.id === approveId);
      const signedName = `Resolucion_Aprobada_${res?.userName.replace(/\s+/g, '_') || approveId}.pdf`;
      updateReservationStatus(approveId, 'APPROVED', undefined, signedName);
      setApproveId(null);
      setNotification({ type: 'success', title: 'Solicitud Aprobada', message: 'La solicitud ha sido aprobada y firmada digitalmente.' });
    }
  };

  const handleResolveAppeal = () => {
    if (appealConfirm) {
      resolveAppeal(appealConfirm.userId, appealConfirm.approve);
      setNotification({ 
        type: 'success', 
        title: appealConfirm.approve ? 'Apelación Aprobada' : 'Apelación Rechazada', 
        message: appealConfirm.approve ? 'El estudiante ha sido absuelto de la penalidad.' : 'Se ha mantenido la penalidad del estudiante.'
      });
      setAppealConfirm(null);
    }
  };

  const handleReject = () => {
    if (!rejectReason.trim()) {
      setNotification({ type: 'error', title: 'Motivo requerido', message: 'Debe ingresar un motivo para rechazar la solicitud.' });
      return;
    }
    if (rejectId) {
      updateReservationStatus(rejectId, 'REJECTED', rejectReason);
      setRejectId(null);
      setRejectReason('');
      setNotification({ type: 'success', title: 'Solicitud Rechazada', message: 'La solicitud ha sido rechazada y se ha notificado al estudiante.' });
    }
  };

  const handleViewDoc = (fileName?: string) => {
    setViewDocUrl({ name: fileName || 'documento_adjunto.pdf' });
  };

  // Fixed Schedules state
  const [fixedFacility, setFixedFacility] = useState<Facility>('FUTSAL_1');
  const [fixedDate, setFixedDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [fixedTime, setFixedTime] = useState('10:00');

  const handleCreateFixed = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      createReservation({
        facility: fixedFacility,
        date: fixedDate,
        time: fixedTime,
        isFixed: true,
      });
      // Force it to be approved since admin creates it
      const created = reservations.find(r => r.date === fixedDate && r.time === fixedTime && r.facility === fixedFacility);
      if(created) updateReservationStatus(created.id, 'APPROVED');
      
      setNotification({ type: 'success', title: 'Horario Bloqueado', message: 'Horario fijo bloqueado exitosamente.' });
    } catch (err: any) {
      setNotification({ type: 'error', title: 'Error', message: err.message });
    }
  };

  // Reports
  const totalReservations = reservations.length;
  const approvedCount = reservations.filter(r => r.status === 'APPROVED' || r.status === 'ATTENDED').length;
  const absentCount = reservations.filter(r => r.status === 'ABSENT').length;
  const rejectedCount = reservations.filter(r => r.status === 'REJECTED').length;

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-12">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Panel Administrativo DGA</h1>
          <p className="text-gray-500 mt-1">Gestión de solicitudes, bloqueos y reportes estadísticos.</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="flex overflow-x-auto border-b border-gray-200 scrollbar-hide">
          <button
            onClick={() => setActiveTab('REQUESTS')}
            className={cn("whitespace-nowrap flex-1 py-4 px-6 text-sm font-medium border-b-2 transition-colors flex items-center justify-center min-w-[200px]", activeTab === 'REQUESTS' ? "border-blue-600 text-blue-600 bg-blue-50/50" : "border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50")}
          >
            <FileText className="w-4 h-4 mr-2" /> 
            Bandeja de Solicitudes
            {pendingRequests.length > 0 && (
              <span className="ml-2 bg-red-100 text-red-600 py-0.5 px-2.5 rounded-full text-xs font-bold">{pendingRequests.length}</span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('APPEALS')}
            className={cn("whitespace-nowrap flex-1 py-4 px-6 text-sm font-medium border-b-2 transition-colors flex items-center justify-center min-w-[200px]", activeTab === 'APPEALS' ? "border-blue-600 text-blue-600 bg-blue-50/50" : "border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50")}
          >
            <AlertCircle className="w-4 h-4 mr-2" /> 
            Apelaciones
            {pendingAppeals.length > 0 && (
              <span className="ml-2 bg-yellow-100 text-yellow-700 py-0.5 px-2.5 rounded-full text-xs font-bold">{pendingAppeals.length}</span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('FIXED')}
            className={cn("whitespace-nowrap flex-1 py-4 px-6 text-sm font-medium border-b-2 transition-colors flex items-center justify-center min-w-[200px]", activeTab === 'FIXED' ? "border-blue-600 text-blue-600 bg-blue-50/50" : "border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50")}
          >
            <Settings className="w-4 h-4 mr-2" /> 
            Bloqueo de Horarios
          </button>
          <button
            onClick={() => setActiveTab('REPORTS')}
            className={cn("whitespace-nowrap flex-1 py-4 px-6 text-sm font-medium border-b-2 transition-colors flex items-center justify-center min-w-[200px]", activeTab === 'REPORTS' ? "border-blue-600 text-blue-600 bg-blue-50/50" : "border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50")}
          >
            <BarChart className="w-4 h-4 mr-2" /> 
            Dashboard y Reportes
          </button>
        </div>

        <div className="p-6 sm:p-8">
          {activeTab === 'REQUESTS' && (
            <div className="space-y-6">
              {pendingRequests.length === 0 ? (
                <div className="text-center py-16 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
                  <div className="mx-auto w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm mb-4">
                    <Check className="w-8 h-8 text-green-500" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-1">¡Al día!</h3>
                  <p className="text-sm text-gray-500 max-w-sm mx-auto">
                    No hay solicitudes de reserva pendientes por revisar.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {pendingRequests.map(req => (
                    <div key={req.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow flex flex-col">
                      <div className="p-5 border-b border-gray-100 flex justify-between items-start bg-gray-50/50">
                        <div>
                          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-yellow-100 text-yellow-800 border border-yellow-200 mb-2">
                            Pendiente de Revisión
                          </span>
                          <h4 className="text-lg font-bold text-gray-900">{req.userName}</h4>
                          <p className="text-sm text-gray-500">Solicitante</p>
                        </div>
                        <button onClick={() => handleViewDoc(req.fileName)} className="flex items-center px-3 py-1.5 bg-white text-blue-600 text-sm font-medium rounded-lg border border-gray-200 hover:bg-blue-50 hover:border-blue-200 transition-colors shadow-sm">
                          <Eye className="w-4 h-4 mr-1.5" />
                          Ver Anexo
                        </button>
                      </div>
                      <div className="p-5 flex-1">
                        <div className="space-y-3">
                          <div className="flex items-start text-sm">
                            <MapPin className="w-4 h-4 text-gray-400 mr-2 mt-0.5" />
                            <span className="font-medium text-gray-900">{FACILITY_NAMES[req.facility]}</span>
                          </div>
                          <div className="flex items-start text-sm">
                            <Calendar className="w-4 h-4 text-gray-400 mr-2 mt-0.5" />
                            <span className="font-medium text-gray-900">{req.date}</span>
                          </div>
                          <div className="flex items-start text-sm">
                            <Clock className="w-4 h-4 text-gray-400 mr-2 mt-0.5" />
                            <span className="font-medium text-gray-900">{formatTimeSlot(req.time)}</span>
                          </div>
                        </div>
                      </div>
                      <div className="p-4 bg-gray-50 border-t border-gray-100 grid grid-cols-2 gap-3">
                        <button onClick={() => setRejectId(req.id)} className="flex items-center justify-center py-2.5 bg-white border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-red-50 hover:text-red-700 hover:border-red-200 transition-colors shadow-sm">
                          <X className="w-4 h-4 mr-2" />
                          Rechazar
                        </button>
                        <button onClick={() => setApproveId(req.id)} className="flex items-center justify-center py-2.5 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors shadow-sm">
                          <Check className="w-4 h-4 mr-2" />
                          Aprobar
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'APPEALS' && (
            <div className="space-y-6">
              {pendingAppeals.length === 0 ? (
                <div className="text-center py-16 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
                  <div className="mx-auto w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm mb-4">
                    <Check className="w-8 h-8 text-green-500" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-1">Sin apelaciones</h3>
                  <p className="text-sm text-gray-500 max-w-sm mx-auto">
                    No hay estudiantes solicitando apelación por inasistencias en este momento.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {pendingAppeals.map(user => (
                    <div key={user.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow flex flex-col">
                      <div className="p-5 border-b border-gray-100 bg-gray-50/50">
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-yellow-100 text-yellow-800 border border-yellow-200 mb-2">
                          Apelación Pendiente
                        </span>
                        <h4 className="text-lg font-bold text-gray-900">{user.name}</h4>
                        <p className="text-sm text-gray-500">{user.email}</p>
                        <p className="text-xs text-red-600 font-medium mt-1">Penalizado hasta: {format(new Date(user.penaltyUntil!), 'dd/MM/yyyy')}</p>
                      </div>
                      <div className="p-5 flex-1">
                        <h5 className="text-sm font-bold text-gray-900 mb-2 flex items-center">
                          <AlertCircle className="w-4 h-4 mr-1 text-gray-500" /> Motivo de Apelación:
                        </h5>
                        <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-lg border border-gray-200 whitespace-pre-wrap">
                          {user.penaltyAppealReason}
                        </p>
                      </div>
                      <div className="p-4 bg-gray-50 border-t border-gray-100 grid grid-cols-2 gap-3">
                        <button onClick={() => setAppealConfirm({userId: user.id, approve: false})} className="flex items-center justify-center py-2.5 bg-white border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-red-50 hover:text-red-700 hover:border-red-200 transition-colors shadow-sm text-sm">
                          <X className="w-4 h-4 mr-2" />
                          Mantener Penalidad
                        </button>
                        <button onClick={() => setAppealConfirm({userId: user.id, approve: true})} className="flex items-center justify-center py-2.5 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors shadow-sm text-sm">
                          <Check className="w-4 h-4 mr-2" />
                          Absolver Penalidad
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'FIXED' && (
            <div className="max-w-2xl mx-auto">
              <div className="bg-gray-50 p-6 rounded-2xl border border-gray-200">
                <div className="flex items-center mb-6">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                    <Settings className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">Bloquear Horario Recurrente</h3>
                    <p className="text-sm text-gray-500">Útil para talleres, mantenimiento o clases fijas.</p>
                  </div>
                </div>
                
                <form onSubmit={handleCreateFixed} className="space-y-5">
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-1.5">Espacio Deportivo</label>
                    <select value={fixedFacility} onChange={(e) => setFixedFacility(e.target.value as Facility)} className="block w-full px-4 py-2.5 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-shadow text-gray-900">
                      {Object.entries(FACILITY_NAMES).map(([key, name]) => <option key={key} value={key}>{name}</option>)}
                    </select>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-semibold text-gray-900 mb-1.5">Fecha Inicial</label>
                      <input type="date" value={fixedDate} onChange={(e) => setFixedDate(e.target.value)} required className="block w-full px-4 py-2.5 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-shadow text-gray-900" />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-900 mb-1.5">Hora de Inicio</label>
                      <input type="time" step="3600" value={fixedTime} onChange={(e) => setFixedTime(e.target.value)} required className="block w-full px-4 py-2.5 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-shadow text-gray-900" />
                    </div>
                  </div>
                  <button type="submit" className="w-full mt-4 flex items-center justify-center py-3 bg-gray-900 text-white font-bold rounded-xl hover:bg-gray-800 transition-colors shadow-sm">
                    Aplicar Bloqueo
                  </button>
                </form>
              </div>
            </div>
          )}

          {activeTab === 'REPORTS' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 flex flex-col justify-center">
                  <div className="flex items-center text-gray-500 text-sm font-medium mb-3 uppercase tracking-wider">
                    <BarChart className="h-5 w-5 mr-2 text-blue-500" /> Total Reservas
                  </div>
                  <div className="text-4xl font-black text-gray-900">{totalReservations}</div>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 flex flex-col justify-center">
                  <div className="flex items-center text-gray-500 text-sm font-medium mb-3 uppercase tracking-wider">
                    <Check className="h-5 w-5 mr-2 text-green-500" /> Aprobadas
                  </div>
                  <div className="text-4xl font-black text-gray-900">{approvedCount}</div>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 flex flex-col justify-center">
                  <div className="flex items-center text-gray-500 text-sm font-medium mb-3 uppercase tracking-wider">
                    <AlertCircle className="h-5 w-5 mr-2 text-red-500" /> Inasistencias
                  </div>
                  <div className="text-4xl font-black text-gray-900">{absentCount}</div>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 flex flex-col justify-center">
                  <div className="flex items-center text-gray-500 text-sm font-medium mb-3 uppercase tracking-wider">
                    <X className="h-5 w-5 mr-2 text-gray-500" /> Rechazadas
                  </div>
                  <div className="text-4xl font-black text-gray-900">{rejectedCount}</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Notification Modal */}
      {notification && (
        <div className="fixed z-[100] inset-0 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:p-0">
            <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm transition-opacity" onClick={() => setNotification(null)} />
            <div className="relative inline-block align-bottom bg-white rounded-2xl text-left overflow-hidden shadow-2xl transform transition-all sm:my-8 sm:align-middle sm:max-w-sm sm:w-full">
              <div className={cn("px-6 py-4 flex items-center justify-between", notification.type === 'success' ? "bg-green-600" : "bg-red-600")}>
                <h3 className="text-lg font-bold text-white flex items-center">
                  {notification.type === 'success' ? <CheckCircle2 className="w-5 h-5 mr-2" /> : <AlertCircle className="w-5 h-5 mr-2" />}
                  {notification.title || (notification.type === 'success' ? 'Éxito' : 'Error')}
                </h3>
                <button onClick={() => setNotification(null)} className={cn("hover:text-white transition-colors p-1.5 rounded-lg", notification.type === 'success' ? "text-green-200 bg-green-700/50" : "text-red-200 bg-red-700/50")}>
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className="p-6">
                <p className="text-gray-700">{notification.message}</p>
              </div>
              <div className="bg-gray-50 px-6 py-4 flex justify-end border-t border-gray-200">
                <button onClick={() => setNotification(null)} className={cn("px-6 py-2.5 rounded-xl text-sm font-bold text-white shadow-sm transition-colors", notification.type === 'success' ? "bg-green-600 hover:bg-green-700" : "bg-red-600 hover:bg-red-700")}>
                  Aceptar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Approve and Sign Modal */}
      {approveId && (
        <div className="fixed z-50 inset-0 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:p-0">
            <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm transition-opacity" aria-hidden="true" onClick={() => setApproveId(null)}></div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            <div className="relative inline-block align-bottom bg-white rounded-2xl text-left overflow-hidden shadow-2xl transform transition-all sm:my-8 sm:align-middle sm:max-w-md sm:w-full">
              
              <div className="bg-blue-600 px-6 py-4 flex items-center justify-between">
                <h3 className="text-lg font-bold text-white flex items-center">
                  <PenTool className="w-5 h-5 mr-2" />
                  Aprobar y Firmar Solicitud
                </h3>
                <button onClick={() => setApproveId(null)} className="text-blue-200 hover:text-white transition-colors bg-blue-700/50 p-1.5 rounded-lg">
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="p-6 space-y-4 text-center">
                <div className="mx-auto w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mb-2 shadow-sm">
                  <PenTool className="w-8 h-8" />
                </div>
                <h4 className="text-lg font-bold text-gray-900">¿Desea aprobar esta solicitud?</h4>
                <p className="text-sm text-gray-500">
                  Al confirmar, se generará una firma digital en el documento sustentatorio y se notificará al estudiante con la resolución aprobada.
                </p>
              </div>
              
              <div className="bg-gray-50 px-6 py-4 flex flex-col sm:flex-row-reverse gap-3 border-t border-gray-200">
                <button type="button" onClick={handleApproveConfirm} className="w-full sm:w-auto inline-flex justify-center items-center rounded-xl px-6 py-2.5 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                  Firmar Digitalmente y Aprobar
                </button>
                <button type="button" onClick={() => setApproveId(null)} className="w-full sm:w-auto inline-flex justify-center items-center rounded-xl px-6 py-2.5 bg-white border border-gray-300 text-sm font-semibold text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-200">
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Appeal Confirm Modal */}
      {appealConfirm && (
        <div className="fixed z-50 inset-0 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:p-0">
            <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm transition-opacity" aria-hidden="true" onClick={() => setAppealConfirm(null)}></div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            <div className="relative inline-block align-bottom bg-white rounded-2xl text-left overflow-hidden shadow-2xl transform transition-all sm:my-8 sm:align-middle sm:max-w-md sm:w-full">
              
              <div className={cn("px-6 py-4 flex items-center justify-between", appealConfirm.approve ? "bg-blue-600" : "bg-red-600")}>
                <h3 className="text-lg font-bold text-white flex items-center">
                  {appealConfirm.approve ? <Check className="w-5 h-5 mr-2" /> : <X className="w-5 h-5 mr-2" />}
                  {appealConfirm.approve ? "Absolver Penalidad" : "Mantener Penalidad"}
                </h3>
                <button onClick={() => setAppealConfirm(null)} className={cn("hover:text-white transition-colors p-1.5 rounded-lg", appealConfirm.approve ? "text-blue-200 bg-blue-700/50" : "text-red-200 bg-red-700/50")}>
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="p-6 space-y-4 text-center">
                <div className={cn("mx-auto w-16 h-16 rounded-full flex items-center justify-center mb-2 shadow-sm", appealConfirm.approve ? "bg-blue-50 text-blue-600" : "bg-red-50 text-red-600")}>
                  {appealConfirm.approve ? <Check className="w-8 h-8" /> : <AlertCircle className="w-8 h-8" />}
                </div>
                <h4 className="text-lg font-bold text-gray-900">
                  {appealConfirm.approve ? "¿Desea absolver la penalidad del estudiante?" : "¿Desea mantener la penalidad del estudiante?"}
                </h4>
                <p className="text-sm text-gray-500">
                  {appealConfirm.approve ? "Al confirmar, el estudiante podrá volver a realizar reservas inmediatamente." : "La solicitud de apelación será rechazada y el estudiante deberá esperar a que termine su penalidad."}
                </p>
              </div>
              
              <div className="bg-gray-50 px-6 py-4 flex flex-col sm:flex-row-reverse gap-3 border-t border-gray-200">
                <button type="button" onClick={handleResolveAppeal} className={cn("w-full sm:w-auto inline-flex justify-center items-center rounded-xl px-6 py-2.5 text-sm font-bold text-white shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2", appealConfirm.approve ? "bg-blue-600 hover:bg-blue-700 focus:ring-blue-500" : "bg-red-600 hover:bg-red-700 focus:ring-red-500")}>
                  Confirmar
                </button>
                <button type="button" onClick={() => setAppealConfirm(null)} className="w-full sm:w-auto inline-flex justify-center items-center rounded-xl px-6 py-2.5 bg-white border border-gray-300 text-sm font-semibold text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-200">
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Reject Modal */}
      {rejectId && (
        <div className="fixed z-50 inset-0 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:p-0">
            <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm transition-opacity" aria-hidden="true" onClick={() => setRejectId(null)}></div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            <div className="relative inline-block align-bottom bg-white rounded-2xl text-left overflow-hidden shadow-2xl transform transition-all sm:my-8 sm:align-middle sm:max-w-md sm:w-full">
              
              <div className="bg-red-600 px-6 py-4 flex items-center justify-between">
                <h3 className="text-lg font-bold text-white flex items-center">
                  <AlertCircle className="w-5 h-5 mr-2" />
                  Rechazar Solicitud
                </h3>
                <button onClick={() => setRejectId(null)} className="text-red-200 hover:text-white transition-colors bg-red-700/50 p-1.5 rounded-lg">
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">Motivo del rechazo <span className="text-red-500">*</span></label>
                  <p className="text-sm text-gray-500 mb-3">Este motivo será visible para el estudiante en su panel (ej. cruce de horarios, anexo inválido).</p>
                  <textarea
                    rows={4}
                    value={rejectReason}
                    onChange={(e) => setRejectReason(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent transition-shadow text-gray-900 resize-none"
                    placeholder="Escribe el motivo aquí..."
                    autoFocus
                  />
                </div>
              </div>
              
              <div className="bg-gray-50 px-6 py-4 flex flex-col sm:flex-row-reverse gap-3 border-t border-gray-200">
                <button type="button" onClick={handleReject} className="w-full sm:w-auto inline-flex justify-center items-center rounded-xl px-6 py-2.5 text-sm font-bold text-white bg-red-600 hover:bg-red-700 shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500">
                  Confirmar Rechazo
                </button>
                <button type="button" onClick={() => {setRejectId(null); setRejectReason('');}} className="w-full sm:w-auto inline-flex justify-center items-center rounded-xl px-6 py-2.5 bg-white border border-gray-300 text-sm font-semibold text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-200">
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* View Document Modal */}
      {viewDocUrl && (
        <div className="fixed z-50 inset-0 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:p-0">
            <div className="fixed inset-0 bg-gray-900/75 backdrop-blur-sm transition-opacity" aria-hidden="true" onClick={() => setViewDocUrl(null)}></div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            <div className="relative inline-block align-bottom bg-white rounded-2xl text-left overflow-hidden shadow-2xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
              
              <div className="bg-gray-900 px-6 py-4 flex items-center justify-between">
                <h3 className="text-lg font-bold text-white flex items-center">
                  <FileText className="w-5 h-5 mr-2 text-blue-400" />
                  Visualizador de Anexo
                </h3>
                <button onClick={() => setViewDocUrl(null)} className="text-gray-400 hover:text-white transition-colors bg-gray-800 p-1.5 rounded-lg">
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="p-6 bg-gray-100 flex flex-col items-center justify-center min-h-[500px]">
                <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200 flex flex-col items-center w-full max-w-md text-center">
                  <div className="w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center mb-6 border-8 border-blue-100/50">
                    <FileText className="w-10 h-10 text-blue-600" />
                  </div>
                  <h4 className="text-xl font-bold text-gray-900 break-all">{viewDocUrl.name}</h4>
                  <p className="text-sm text-gray-500 mt-2 mb-8 px-4 leading-relaxed">
                    Vista previa del documento sustentatorio adjunto por el estudiante para validar su reserva.
                  </p>
                  
                  {viewDocUrl.name.toLowerCase().endsWith('.pdf') ? (
                     <div className="w-full bg-gray-50 border border-gray-200 rounded-xl p-6 mb-6">
                        <p className="text-sm font-medium text-gray-600 flex items-center justify-center">
                          <Eye className="w-4 h-4 mr-2" /> Previsualización de PDF simulada
                        </p>
                     </div>
                  ) : viewDocUrl.name.toLowerCase().match(/\.(jpg|jpeg|png)$/) ? (
                      <div className="w-full h-48 bg-gray-200 rounded-xl overflow-hidden mb-6 flex items-center justify-center bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]">
                         <p className="text-sm font-medium text-gray-500 bg-white/80 px-3 py-1 rounded-full shadow-sm">Previsualización de Imagen</p>
                      </div>
                  ) : null}

                  <button className="flex items-center justify-center w-full py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-colors shadow-sm">
                    <Download className="w-5 h-5 mr-2" />
                    Descargar Archivo Original
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
