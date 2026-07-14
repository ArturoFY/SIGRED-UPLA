import React, { useState, useRef } from 'react';
import { useStore } from '../store';
import { Facility, ReservationStatus } from '../types';
import { formatTimeSlot, FACILITY_NAMES, cn } from '../lib/utils';
import { Calendar, Clock, X, Upload, CheckCircle2, ChevronRight, Activity, MapPin, FileCheck, AlertCircle, Eye, Download, FileText } from 'lucide-react';
import { format, addDays, startOfToday } from 'date-fns';

export default function StudentDashboard() {
  const { currentUser, reservations, createReservation, submitAppeal } = useStore();
  const [activeTab, setActiveTab] = useState<'RESERVAR' | 'MIS_RESERVAS'>('RESERVAR');
  
  const [selectedFacility, setSelectedFacility] = useState<Facility>('FUTSAL_1');
  const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [showModal, setShowModal] = useState<string | false>(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [notification, setNotification] = useState<{type: 'success' | 'error', message: string, title?: string} | null>(null);
  const [viewDocUrl, setViewDocUrl] = useState<{name: string, isSigned?: boolean} | null>(null);
  const [appealReason, setAppealReason] = useState('');

  // Generate next 14 days
  const today = startOfToday();
  const days = Array.from({ length: 14 }).map((_, i) => addDays(today, i));

  // Generate slots from 8 AM to 8 PM
  const timeSlots = Array.from({ length: 13 }).map((_, i) => {
    const hour = i + 8;
    return `${hour.toString().padStart(2, '0')}:00`;
  });

  const isPenalized = currentUser?.penaltyUntil && new Date(currentUser.penaltyUntil) > new Date();

  const handleAppeal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!appealReason.trim()) {
      setNotification({ type: 'error', title: 'Error', message: 'Debe ingresar un motivo para la apelación.' });
      return;
    }
    submitAppeal(appealReason);
    setNotification({ type: 'success', title: 'Apelación Enviada', message: 'Su solicitud de apelación ha sido enviada a la DGA.' });
    setAppealReason('');
  };

  const getSlotStatus = (time: string): { status: 'AVAILABLE' | 'MINE' | 'OCCUPIED'; label: string } => {
    const res = reservations.find(
      (r) => r.date === selectedDate && r.facility === selectedFacility && r.time === time
    );
    if (!res) return { status: 'AVAILABLE', label: 'Disponible' };
    if (res.status === 'APPROVED' || res.status === 'PENDING') {
      if (res.userId === currentUser?.id) return { status: 'MINE', label: res.status === 'PENDING' ? 'Tu solicitud (Pdte)' : 'Tu reserva' };
      return { status: 'OCCUPIED', label: res.isFixed ? 'Clase/Taller Fijo' : 'Ocupado' };
    }
    return { status: 'AVAILABLE', label: 'Disponible' };
  };

  const handleOpenModal = (time: string) => {
    setShowModal(time);
    setSelectedFile(null);
  };

  const handleBook = (time: string) => {
    if (currentUser?.penaltyUntil && new Date(currentUser.penaltyUntil) > new Date()) {
      setNotification({ type: 'error', title: 'Acceso Denegado', message: 'Tienes una penalidad activa. No puedes reservar.' });
      return;
    }
    
    try {
      createReservation({
        facility: selectedFacility,
        date: selectedDate,
        time: time,
        fileName: selectedFile?.name || 'documento_adjunto.pdf',
      });
      setNotification({ type: 'success', title: 'Solicitud Enviada', message: '¡Solicitud enviada exitosamente! Se revisará a la brevedad.' });
      setActiveTab('MIS_RESERVAS');
    } catch (e: any) {
      setNotification({ type: 'error', title: 'Error al reservar', message: e.message });
    }
  };

  const myReservations = reservations
    .filter(r => r.userId === currentUser?.id)
    .sort((a,b) => new Date(`${b.date}T${b.time}`).getTime() - new Date(`${a.date}T${a.time}`).getTime());

  const esDays = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
  const esMonths = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Portal del Solicitante</h1>
          <p className="text-gray-500 mt-1">Gestiona y reserva los espacios deportivos de la universidad.</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => setActiveTab('RESERVAR')}
            className={cn(
              "flex-1 py-4 text-sm font-medium border-b-2 transition-colors flex items-center justify-center",
              activeTab === 'RESERVAR' ? "border-blue-600 text-blue-600 bg-blue-50/50" : "border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50"
            )}
          >
            <Calendar className="w-4 h-4 mr-2" />
            Nueva Reserva
          </button>
          <button
            onClick={() => setActiveTab('MIS_RESERVAS')}
            className={cn(
              "flex-1 py-4 text-sm font-medium border-b-2 transition-colors flex items-center justify-center",
              activeTab === 'MIS_RESERVAS' ? "border-blue-600 text-blue-600 bg-blue-50/50" : "border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50"
            )}
          >
            <Clock className="w-4 h-4 mr-2" />
            Mis Reservas
          </button>
        </div>

        <div className="p-6 sm:p-8">
          {activeTab === 'RESERVAR' && isPenalized && (
            <div className="bg-red-50 p-8 rounded-2xl border-2 border-red-200 flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mb-4">
                <AlertCircle className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-red-900 mb-2">Cuenta Penalizada</h3>
              <p className="text-red-700 max-w-md mx-auto mb-6">
                Tienes una penalidad activa por inasistencia y no puedes realizar nuevas reservas hasta el {format(new Date(currentUser!.penaltyUntil!), 'dd/MM/yyyy')}.
              </p>
              
              {!currentUser?.penaltyAppealStatus ? (
                <form onSubmit={handleAppeal} className="w-full max-w-md bg-white p-6 rounded-xl shadow-sm border border-red-100 text-left">
                  <h4 className="text-sm font-bold text-gray-900 mb-2">Solicitar Apelación a DGA</h4>
                  <p className="text-xs text-gray-500 mb-4">Si crees que esto es un error o tienes una justificación válida, puedes enviar una apelación.</p>
                  <textarea
                    required
                    value={appealReason}
                    onChange={e => setAppealReason(e.target.value)}
                    rows={3}
                    placeholder="Escribe aquí tu justificación..."
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent transition-shadow text-gray-900 resize-none text-sm mb-4"
                  />
                  <button type="submit" className="w-full py-2.5 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700 transition-colors shadow-sm">
                    Enviar Apelación
                  </button>
                </form>
              ) : currentUser.penaltyAppealStatus === 'PENDING' ? (
                <div className="w-full max-w-md bg-yellow-50 p-6 rounded-xl border border-yellow-200">
                  <h4 className="text-yellow-800 font-bold flex items-center justify-center mb-2">
                    <Activity className="w-5 h-5 mr-2" />
                    Apelación en Revisión
                  </h4>
                  <p className="text-sm text-yellow-700">Tu apelación ha sido enviada y está pendiente de revisión por parte de la DGA.</p>
                </div>
              ) : (
                <div className="w-full max-w-md bg-gray-100 p-6 rounded-xl border border-gray-200">
                  <h4 className="text-gray-800 font-bold flex items-center justify-center mb-2">
                    <X className="w-5 h-5 mr-2" />
                    Apelación Rechazada
                  </h4>
                  <p className="text-sm text-gray-600">La DGA ha rechazado tu apelación. Deberás esperar a que termine tu penalidad.</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'RESERVAR' && !isPenalized && (
            <div className="space-y-10">
              {/* Facility Selection */}
              <div>
                <h3 className="text-base font-semibold text-gray-900 mb-4 flex items-center">
                  <MapPin className="w-5 h-5 mr-2 text-blue-600" />
                  1. Selecciona el espacio deportivo
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  {(Object.keys(FACILITY_NAMES) as Facility[]).map((key) => {
                    const imageUrl = 
                      key === 'FUTSAL_1' ? 'https://images.unsplash.com/photo-1574629810360-7efbb6b6973f?auto=format&fit=crop&q=80&w=600' :
                      key === 'FUTSAL_2' ? 'https://images.unsplash.com/photo-1529900748604-07564a03e7a6?auto=format&fit=crop&q=80&w=600' :
                      'https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?auto=format&fit=crop&q=80&w=600';
                    return (
                      <button
                        key={key}
                        onClick={() => setSelectedFacility(key)}
                        className={cn(
                          "relative rounded-2xl border-2 text-left transition-all duration-300 overflow-hidden group outline-none",
                          selectedFacility === key 
                            ? "border-blue-600 ring-4 ring-blue-600/20 shadow-lg" 
                            : "border-gray-200 hover:border-blue-400 hover:shadow-md"
                        )}
                      >
                        <div className="h-32 w-full relative overflow-hidden">
                          <img src={imageUrl} alt={FACILITY_NAMES[key]} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                          <div className={cn("absolute inset-0 transition-colors", selectedFacility === key ? "bg-blue-900/20" : "bg-gray-900/10 group-hover:bg-transparent")}></div>
                          {selectedFacility === key && (
                            <div className="absolute top-3 right-3 bg-blue-600 rounded-full p-1 shadow-sm">
                              <CheckCircle2 className="w-5 h-5 text-white" />
                            </div>
                          )}
                        </div>
                        <div className={cn("p-4", selectedFacility === key ? "bg-blue-50/50" : "bg-white")}>
                          <span className={cn(
                            "font-bold text-lg block mb-1",
                            selectedFacility === key ? "text-blue-900" : "text-gray-900"
                          )}>
                            {FACILITY_NAMES[key].split(' (')[0]}
                          </span>
                          <span className="text-sm font-medium text-gray-500 block">
                            {FACILITY_NAMES[key].includes('(') ? FACILITY_NAMES[key].split(' (')[1].replace(')', '') : 'Multideportivo'}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Date Selection */}
              <div>
                <h3 className="text-base font-semibold text-gray-900 mb-4 flex items-center">
                  <Calendar className="w-5 h-5 mr-2 text-blue-600" />
                  2. Elige la fecha
                </h3>
                <div className="flex overflow-x-auto space-x-3 pb-2 scrollbar-hide -mx-2 px-2">
                  {days.map(d => {
                    const dateStr = format(d, 'yyyy-MM-dd');
                    const isSelected = selectedDate === dateStr;
                    return (
                      <button
                        key={dateStr}
                        onClick={() => setSelectedDate(dateStr)}
                        className={cn(
                          "flex flex-col items-center min-w-[72px] p-3 rounded-xl border-2 transition-all duration-200 snap-center",
                          isSelected 
                            ? "border-blue-600 bg-blue-600 text-white shadow-md" 
                            : "border-gray-200 bg-white text-gray-600 hover:border-blue-300 hover:bg-blue-50"
                        )}
                      >
                        <span className="text-xs font-medium uppercase tracking-wider opacity-80">{esDays[d.getDay()]}</span>
                        <span className="text-xl font-bold my-0.5">{d.getDate()}</span>
                        <span className="text-[10px] uppercase opacity-80">{esMonths[d.getMonth()]}</span>
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Time Selection */}
              <div>
                <h3 className="text-base font-semibold text-gray-900 mb-4 flex items-center">
                  <Clock className="w-5 h-5 mr-2 text-blue-600" />
                  3. Elige un horario disponible
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {timeSlots.map(time => {
                    const { status, label } = getSlotStatus(time);
                    const isAvailable = status === 'AVAILABLE';
                    const isMine = status === 'MINE';
                    
                    return (
                      <button
                        key={time}
                        onClick={() => isAvailable && handleOpenModal(time)}
                        disabled={!isAvailable}
                        className={cn(
                          "relative p-4 rounded-xl border-2 text-left transition-all duration-200 overflow-hidden",
                          isAvailable ? "border-gray-200 bg-white hover:border-green-400 hover:shadow-md cursor-pointer group" :
                          isMine ? "border-blue-200 bg-blue-50/50 cursor-default" :
                          "border-gray-100 bg-gray-50/80 opacity-60 cursor-not-allowed"
                        )}
                      >
                        {isAvailable && (
                          <div className="absolute top-0 right-0 w-2 h-full bg-green-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                        )}
                        <span className={cn(
                          "text-base font-bold block mb-1",
                          isAvailable ? "text-gray-900" : isMine ? "text-blue-800" : "text-gray-400"
                        )}>
                          {formatTimeSlot(time)}
                        </span>
                        <span className={cn(
                          "text-xs font-medium flex items-center",
                          isAvailable ? "text-green-600" : isMine ? "text-blue-600" : "text-gray-500"
                        )}>
                          {isMine && <CheckCircle2 className="w-3 h-3 mr-1" />}
                          {label}
                        </span>
                      </button>
                    )
                  })}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'MIS_RESERVAS' && (
            <div className="space-y-6">
              {myReservations.length === 0 ? (
                <div className="text-center py-16 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
                  <div className="mx-auto w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm mb-4">
                    <Activity className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-1">Sin reservas activas</h3>
                  <p className="text-sm text-gray-500 max-w-sm mx-auto">
                    Aún no has solicitado ningún espacio deportivo. Ve a la pestaña "Nueva Reserva" para empezar.
                  </p>
                  <button 
                    onClick={() => setActiveTab('RESERVAR')}
                    className="mt-6 px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
                  >
                    Hacer una reserva
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {myReservations.map(res => (
                    <div key={res.id} className="relative p-5 rounded-xl border border-gray-200 bg-white shadow-sm hover:shadow-md transition-shadow">
                      <div className="absolute top-5 right-5">
                        <StatusBadge status={res.status} />
                      </div>
                      <div className="pr-20 space-y-3">
                        <div>
                          <p className="text-sm text-gray-500 font-medium uppercase tracking-wider">Espacio</p>
                          <p className="font-bold text-gray-900">{FACILITY_NAMES[res.facility]}</p>
                        </div>
                        <div className="flex gap-6">
                          <div>
                            <p className="text-sm text-gray-500 font-medium">Fecha</p>
                            <p className="font-semibold text-gray-800">{res.date}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500 font-medium">Horario</p>
                            <p className="font-semibold text-gray-800">{formatTimeSlot(res.time)}</p>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2 mt-4 pt-4 border-t border-gray-100">
                        {res.fileName && (
                          <button onClick={() => setViewDocUrl({ name: res.fileName! })} className="flex items-center px-3 py-1.5 bg-gray-50 text-gray-700 text-xs font-medium rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors">
                            <Eye className="w-3.5 h-3.5 mr-1.5" />
                            Ver Original
                          </button>
                        )}
                        {res.status === 'APPROVED' && (
                          <button onClick={() => setViewDocUrl({ name: res.signedFileName || `Resolucion_Aprobada_${res.userName.replace(/\s+/g, '_')}.pdf`, isSigned: true })} className="flex items-center px-3 py-1.5 bg-blue-50 text-blue-700 text-xs font-medium rounded-lg border border-blue-200 hover:bg-blue-100 transition-colors">
                            <FileText className="w-3.5 h-3.5 mr-1.5" />
                            Descargar Firma
                          </button>
                        )}
                      </div>
                      {res.status === 'REJECTED' && res.rejectReason && (
                        <div className="mt-4 text-sm text-red-700 bg-red-50 p-3 rounded-lg border border-red-100 flex items-start">
                          <Activity className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
                          <span><strong>Motivo:</strong> {res.rejectReason}</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Booking Modal Redesign */}
      {showModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:p-0">
            <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm transition-opacity" onClick={() => setShowModal(false)} />
            
            <div className="relative inline-block align-bottom bg-white rounded-2xl text-left overflow-hidden shadow-2xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg w-full">
              
              <div className="bg-blue-600 px-6 py-4 flex items-center justify-between">
                <h3 className="text-xl font-bold text-white flex items-center">
                  <FileCheck className="w-6 h-6 mr-2" />
                  Confirmar Solicitud
                </h3>
                <button onClick={() => setShowModal(false)} className="text-blue-100 hover:text-white transition-colors bg-blue-700/50 p-1.5 rounded-lg">
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="px-6 py-6 space-y-6">
                
                <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <span className="block text-xs font-medium text-gray-500 uppercase">Espacio</span>
                    <span className="font-semibold text-gray-900">{FACILITY_NAMES[selectedFacility]}</span>
                  </div>
                  <div>
                    <span className="block text-xs font-medium text-gray-500 uppercase">Fecha</span>
                    <span className="font-semibold text-gray-900">{selectedDate}</span>
                  </div>
                  <div>
                    <span className="block text-xs font-medium text-gray-500 uppercase">Horario</span>
                    <span className="font-semibold text-blue-600">{formatTimeSlot(showModal as string)}</span>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <label className="block text-base font-semibold text-gray-900">
                    Anexo Sustentatorio <span className="text-red-500">*</span>
                  </label>
                  <p className="text-sm text-gray-500 leading-relaxed">
                    Para aprobar tu solicitud, adjunta el formato de reserva firmado o documento que sustente el uso de la cancha.
                  </p>
                  
                  <div className={cn(
                    "mt-2 flex justify-center px-6 pt-8 pb-8 border-2 border-dashed rounded-xl transition-all duration-200 relative overflow-hidden",
                    selectedFile ? "border-blue-400 bg-blue-50/50" : "border-gray-300 hover:border-blue-400 bg-gray-50/50 hover:bg-blue-50/30"
                  )}>
                    <input 
                      id="file-upload" 
                      type="file" 
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" 
                      accept=".pdf,.jpg,.png" 
                      onChange={(e) => setSelectedFile(e.target.files ? e.target.files[0] : null)}
                      required 
                    />
                    
                    <div className="space-y-2 text-center pointer-events-none relative z-0">
                      {selectedFile ? (
                        <div className="flex flex-col items-center animate-in zoom-in-95 duration-200">
                          <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-3 shadow-sm">
                            <CheckCircle2 className="w-6 h-6" />
                          </div>
                          <span className="text-sm font-bold text-gray-900 px-4 break-all">{selectedFile.name}</span>
                          <span className="text-xs text-blue-600 font-medium mt-1 bg-blue-100 px-2 py-0.5 rounded-full">
                            Listo para enviar
                          </span>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center">
                          <Upload className="mx-auto h-10 w-10 text-gray-400 mb-3" />
                          <div className="flex text-sm text-gray-600 justify-center">
                            <span className="font-semibold text-blue-600">Haz clic o arrastra un archivo aquí</span>
                          </div>
                          <p className="text-xs text-gray-500 mt-2">PDF, PNG, JPG hasta 5MB</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-50 px-6 py-4 flex flex-col sm:flex-row-reverse gap-3 border-t border-gray-200">
                <button
                  type="button"
                  disabled={!selectedFile}
                  onClick={() => {
                    if (selectedFile) {
                      handleBook(showModal as string);
                      setShowModal(false);
                    }
                  }}
                  className={cn(
                    "w-full sm:w-auto inline-flex justify-center items-center rounded-xl px-6 py-2.5 text-sm font-bold text-white shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-600",
                    selectedFile 
                      ? "bg-blue-600 hover:bg-blue-700 hover:shadow-md" 
                      : "bg-gray-300 text-gray-500 cursor-not-allowed"
                  )}
                >
                  Confirmar y Enviar
                  {selectedFile && <ChevronRight className="w-4 h-4 ml-1" />}
                </button>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="w-full sm:w-auto inline-flex justify-center items-center rounded-xl px-6 py-2.5 bg-white border border-gray-300 text-sm font-semibold text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-200"
                >
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
        <div className="fixed z-[60] inset-0 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
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
                    {viewDocUrl.isSigned ? 'Este documento contiene la aprobación y firma digital por parte de la DGA.' : 'Vista previa del documento sustentatorio adjunto.'}
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
                    {viewDocUrl.isSigned ? 'Descargar Resolución' : 'Descargar Archivo'}
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

function StatusBadge({ status }: { status: ReservationStatus }) {
  const styles = {
    PENDING: 'bg-yellow-100 text-yellow-800 border border-yellow-200',
    APPROVED: 'bg-green-100 text-green-800 border border-green-200',
    REJECTED: 'bg-red-100 text-red-800 border border-red-200',
    ATTENDED: 'bg-blue-100 text-blue-800 border border-blue-200',
    ABSENT: 'bg-gray-100 text-gray-800 border border-gray-200',
  };
  
  const labels = {
    PENDING: 'Pendiente',
    APPROVED: 'Aprobada',
    REJECTED: 'Rechazada',
    ATTENDED: 'Asistió',
    ABSENT: 'Faltó',
  };

  return (
    <span className={cn("inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold shadow-sm", styles[status])}>
      {labels[status]}
    </span>
  );
}

