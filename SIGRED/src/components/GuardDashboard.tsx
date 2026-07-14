import React, { useState } from 'react';
import { useStore } from '../store';
import { formatTimeSlot, FACILITY_NAMES, cn } from '../lib/utils';
import { format } from 'date-fns';
import { CheckCircle, XCircle, MapPin, User, Clock, FileText, Eye, X, Download, AlertCircle, CheckCircle2 } from 'lucide-react';

export default function GuardDashboard() {
  const { reservations, updateReservationStatus } = useStore();
  const todayDateStr = format(new Date(), 'yyyy-MM-dd');
  const [viewDocUrl, setViewDocUrl] = useState<{name: string, url?: string, isSigned?: boolean} | null>(null);
  const [confirmAction, setConfirmAction] = useState<{id: string, status: 'ATTENDED' | 'ABSENT'} | null>(null);
  const [notification, setNotification] = useState<{type: 'success' | 'error', message: string, title?: string} | null>(null);

  // Guard only sees today's APPROVED reservations (and potentially those already marked as ATTENDED/ABSENT to avoid double marking, though we'll keep them visible with their status)
  const todayReservations = reservations
    .filter(r => r.date === todayDateStr && ['APPROVED', 'ATTENDED', 'ABSENT'].includes(r.status))
    .sort((a,b) => new Date(`${a.date}T${a.time}`).getTime() - new Date(`${b.date}T${b.time}`).getTime());

  const stats = {
    total: todayReservations.length,
    attended: todayReservations.filter(r => r.status === 'ATTENDED').length,
    absent: todayReservations.filter(r => r.status === 'ABSENT').length,
    pending: todayReservations.filter(r => r.status === 'APPROVED').length,
  };

  const handleAttendanceConfirm = () => {
    if (confirmAction) {
      updateReservationStatus(confirmAction.id, confirmAction.status);
      setNotification({ 
        type: 'success', 
        title: 'Registro Exitoso', 
        message: confirmAction.status === 'ATTENDED' ? 'Asistencia registrada correctamente.' : 'Inasistencia registrada. Se aplicará la penalidad correspondiente.' 
      });
      setConfirmAction(null);
    }
  };

  return (
    <div className="max-w-xl mx-auto space-y-6 pb-20">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sticky top-0 z-10">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Control de Accesos</h1>
        <p className="text-gray-500 text-sm mb-6">Reservas de hoy: {todayDateStr}</p>
        
        <div className="grid grid-cols-4 gap-3">
          <div className="bg-blue-50 rounded-xl p-3 text-center border border-blue-100">
            <p className="text-xs text-blue-600 font-bold uppercase tracking-wider mb-1">Total</p>
            <p className="text-2xl font-black text-blue-900">{stats.total}</p>
          </div>
          <div className="bg-green-50 rounded-xl p-3 text-center border border-green-100">
            <p className="text-xs text-green-600 font-bold uppercase tracking-wider mb-1">Asistió</p>
            <p className="text-2xl font-black text-green-900">{stats.attended}</p>
          </div>
          <div className="bg-red-50 rounded-xl p-3 text-center border border-red-100">
            <p className="text-xs text-red-600 font-bold uppercase tracking-wider mb-1">Faltó</p>
            <p className="text-2xl font-black text-red-900">{stats.absent}</p>
          </div>
          <div className="bg-gray-50 rounded-xl p-3 text-center border border-gray-200">
            <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-1">Pendiente</p>
            <p className="text-2xl font-black text-gray-900">{stats.pending}</p>
          </div>
        </div>
      </div>

      <div className="space-y-4 px-2">
        {todayReservations.length === 0 ? (
          <div className="text-center py-10 bg-gray-50 rounded-xl border border-dashed border-gray-300">
            <p className="text-gray-500 font-medium">No hay reservas aprobadas para hoy.</p>
          </div>
        ) : (
          todayReservations.map(res => (
            <div key={res.id} className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-4 bg-gray-50 border-b border-gray-100 flex justify-between items-center">
                <div className="flex items-center text-blue-700 font-bold text-lg">
                  <Clock className="w-5 h-5 mr-2" />
                  {formatTimeSlot(res.time)}
                </div>
                {res.status !== 'APPROVED' && (
                  <span className={cn(
                    "text-sm font-bold px-3 py-1.5 rounded-full uppercase tracking-wide",
                    res.status === 'ATTENDED' ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                  )}>
                    {res.status === 'ATTENDED' ? 'Asistió' : 'Faltó'}
                  </span>
                )}
                {res.status === 'APPROVED' && (
                  <span className="text-sm font-bold px-3 py-1.5 rounded-full uppercase tracking-wide bg-gray-200 text-gray-700">
                    Pendiente
                  </span>
                )}
              </div>
              
              <div className="p-5 space-y-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-start">
                    <User className="w-5 h-5 text-gray-400 mr-3 mt-0.5" />
                    <div>
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-0.5">Solicitante</p>
                      <p className="font-bold text-gray-900 text-lg">{res.userName}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => setViewDocUrl({ name: res.fileName || 'documento_adjunto.pdf' })} 
                      className="p-2 text-gray-500 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors flex flex-col items-center justify-center"
                      title="Ver Anexo Original"
                    >
                      <Eye className="w-5 h-5" />
                    </button>
                    {res.signedFileName && (
                      <button 
                        onClick={() => setViewDocUrl({ name: res.signedFileName!, isSigned: true })} 
                        className="p-2 text-green-600 bg-green-50 hover:bg-green-100 rounded-full transition-colors flex flex-col items-center justify-center"
                        title="Ver Resolución de Aprobación"
                      >
                        <FileText className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                </div>
                
                <div className="flex items-start">
                  <MapPin className="w-5 h-5 text-gray-400 mr-3 mt-0.5" />
                  <div>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-0.5">Espacio Deportivo</p>
                    <p className="font-medium text-gray-800">{FACILITY_NAMES[res.facility]}</p>
                  </div>
                </div>
              </div>

              {res.status === 'APPROVED' && (
                <div className="p-4 bg-gray-50 border-t border-gray-100 grid grid-cols-2 gap-4">
                  <button
                    onClick={() => setConfirmAction({id: res.id, status: 'ABSENT'})}
                    className="flex flex-col items-center justify-center py-4 bg-white border border-gray-200 shadow-sm text-red-600 rounded-xl hover:bg-red-50 hover:border-red-200 active:bg-red-100 transition-all"
                  >
                    <XCircle className="w-8 h-8 mb-2" />
                    <span className="font-bold">Marcar Inasistencia</span>
                  </button>
                  <button
                    onClick={() => setConfirmAction({id: res.id, status: 'ATTENDED'})}
                    className="flex flex-col items-center justify-center py-4 bg-white border border-gray-200 shadow-sm text-green-600 rounded-xl hover:bg-green-50 hover:border-green-200 active:bg-green-100 transition-all"
                  >
                    <CheckCircle className="w-8 h-8 mb-2" />
                    <span className="font-bold">Marcar Asistencia</span>
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Confirm Action Modal */}
      {confirmAction && (
        <div className="fixed z-50 inset-0 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:p-0">
            <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm transition-opacity" aria-hidden="true" onClick={() => setConfirmAction(null)}></div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            <div className="relative inline-block align-bottom bg-white rounded-2xl text-left overflow-hidden shadow-2xl transform transition-all sm:my-8 sm:align-middle sm:max-w-md sm:w-full">
              
              <div className={cn("px-6 py-4 flex items-center justify-between", confirmAction.status === 'ATTENDED' ? "bg-green-600" : "bg-red-600")}>
                <h3 className="text-lg font-bold text-white flex items-center">
                  {confirmAction.status === 'ATTENDED' ? <CheckCircle2 className="w-5 h-5 mr-2" /> : <AlertCircle className="w-5 h-5 mr-2" />}
                  Confirmar {confirmAction.status === 'ATTENDED' ? 'Asistencia' : 'Inasistencia'}
                </h3>
                <button onClick={() => setConfirmAction(null)} className={cn("hover:text-white transition-colors p-1.5 rounded-lg", confirmAction.status === 'ATTENDED' ? "text-green-200 bg-green-700/50" : "text-red-200 bg-red-700/50")}>
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="p-6 space-y-4 text-center">
                <div className={cn("mx-auto w-16 h-16 rounded-full flex items-center justify-center mb-2 shadow-sm", confirmAction.status === 'ATTENDED' ? "bg-green-50 text-green-600" : "bg-red-50 text-red-600")}>
                  {confirmAction.status === 'ATTENDED' ? <CheckCircle2 className="w-8 h-8" /> : <XCircle className="w-8 h-8" />}
                </div>
                <h4 className="text-lg font-bold text-gray-900">
                  ¿Registrar {confirmAction.status === 'ATTENDED' ? 'Asistencia' : 'Inasistencia'}?
                </h4>
                <p className="text-sm text-gray-500">
                  {confirmAction.status === 'ABSENT' ? 'Esto aplicará una penalidad automática de 7 días al estudiante impidiendo futuras reservas.' : 'Se marcará que el estudiante usó correctamente el espacio deportivo.'}
                </p>
              </div>
              
              <div className="bg-gray-50 px-6 py-4 flex flex-col sm:flex-row-reverse gap-3 border-t border-gray-200">
                <button type="button" onClick={handleAttendanceConfirm} className={cn("w-full sm:w-auto inline-flex justify-center items-center rounded-xl px-6 py-2.5 text-sm font-bold text-white shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2", confirmAction.status === 'ATTENDED' ? "bg-green-600 hover:bg-green-700 focus:ring-green-500" : "bg-red-600 hover:bg-red-700 focus:ring-red-500")}>
                  Confirmar Registro
                </button>
                <button type="button" onClick={() => setConfirmAction(null)} className="w-full sm:w-auto inline-flex justify-center items-center rounded-xl px-6 py-2.5 bg-white border border-gray-300 text-sm font-semibold text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-200">
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

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

      {/* View Document Modal */}
      {viewDocUrl && (
        <div className="fixed z-50 inset-0 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:p-0">
            <div className="fixed inset-0 bg-gray-900/75 backdrop-blur-sm transition-opacity" aria-hidden="true" onClick={() => setViewDocUrl(null)}></div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            <div className="relative inline-block align-bottom bg-white rounded-2xl text-left overflow-hidden shadow-2xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
              
              <div className="bg-gray-900 px-6 py-4 flex items-center justify-between">
                <h3 className="text-lg font-bold text-white flex items-center">
                  <FileText className={cn("w-5 h-5 mr-2", viewDocUrl.isSigned ? "text-green-400" : "text-blue-400")} />
                  {viewDocUrl.isSigned ? 'Resolución Firmada' : 'Visualizador de Anexo'}
                </h3>
                <button onClick={() => setViewDocUrl(null)} className="text-gray-400 hover:text-white transition-colors bg-gray-800 p-1.5 rounded-lg">
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="p-6 bg-gray-100 flex flex-col items-center justify-center min-h-[500px]">
                <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200 flex flex-col items-center w-full max-w-md text-center">
                  <div className={cn("w-24 h-24 rounded-full flex items-center justify-center mb-6 border-8", viewDocUrl.isSigned ? "bg-green-50 border-green-100/50" : "bg-blue-50 border-blue-100/50")}>
                    <FileText className={cn("w-10 h-10", viewDocUrl.isSigned ? "text-green-600" : "text-blue-600")} />
                  </div>
                  <h4 className="text-xl font-bold text-gray-900 break-all">{viewDocUrl.name}</h4>
                  <p className="text-sm text-gray-500 mt-2 mb-8 px-4 leading-relaxed">
                    {viewDocUrl.isSigned ? 'Este documento contiene la aprobación y firma digital por parte de la DGA.' : 'Vista previa del documento sustentatorio adjunto por el estudiante para validar su reserva.'}
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

                  <button className={cn("flex items-center justify-center w-full py-3 text-white font-bold rounded-xl transition-colors shadow-sm", viewDocUrl.isSigned ? "bg-green-600 hover:bg-green-700" : "bg-blue-600 hover:bg-blue-700")}>
                    <Download className="w-5 h-5 mr-2" />
                    {viewDocUrl.isSigned ? 'Descargar Resolución' : 'Descargar Archivo Original'}
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
