import React, { createContext, useContext, useEffect, useState } from 'react';
import { AppState, Reservation, ReservationStatus, User } from './types';

const INITIAL_USERS: User[] = [
  { id: '1', name: 'Estudiante Prueba', email: 'estudiante@ms.upla.edu.pe', role: 'STUDENT' },
  { id: '2', name: 'Administrador DGA', email: 'admin@upla.edu.pe', role: 'ADMIN' },
  { id: '3', name: 'Vigilancia Puerta', email: 'vigilante@upla.edu.pe', role: 'GUARD' },
];

const INITIAL_STATE: AppState = {
  users: INITIAL_USERS,
  reservations: [],
  currentUser: null,
};

interface StoreContextType extends AppState {
  login: (email: string) => void;
  logout: () => void;
  createReservation: (res: Omit<Reservation, 'id' | 'status' | 'userId' | 'userName'>) => void;
  updateReservationStatus: (id: string, status: ReservationStatus, reason?: string, signedFileName?: string) => void;
  applyPenalty: (userId: string) => void;
  submitAppeal: (reason: string) => void;
  resolveAppeal: (userId: string, approved: boolean) => void;
  resetStore: () => void;
}

const StoreContext = createContext<StoreContextType | null>(null);

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AppState>(() => {
    const saved = localStorage.getItem('sigred_upla_state');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Ensure initial users are always present if missing
        if (!parsed.users || parsed.users.length === 0) {
          parsed.users = INITIAL_USERS;
        }
        return parsed;
      } catch (e) {
        return INITIAL_STATE;
      }
    }
    return INITIAL_STATE;
  });

  useEffect(() => {
    localStorage.setItem('sigred_upla_state', JSON.stringify(state));
  }, [state]);

  const login = (email: string) => {
    const user = state.users.find((u) => u.email === email);
    if (!user) throw new Error('Usuario no encontrado. Asegúrese de usar un correo válido.');
    setState((s) => ({ ...s, currentUser: user }));
  };

  const logout = () => {
    setState((s) => ({ ...s, currentUser: null }));
  };

  const createReservation = (res: Omit<Reservation, 'id' | 'status' | 'userId' | 'userName'>) => {
    if (!state.currentUser) return;
    
    // Check penalty
    if (state.currentUser.penaltyUntil && new Date(state.currentUser.penaltyUntil) > new Date()) {
      throw new Error('No puedes reservar. Tienes una penalidad activa por inasistencia.');
    }

    // Check availability
    const conflict = state.reservations.find(
      (r) => r.date === res.date && r.time === res.time && r.facility === res.facility && r.status === 'APPROVED'
    );
    if (conflict) {
      throw new Error('El espacio ya se encuentra reservado y aprobado para este horario.');
    }

    const newRes: Reservation = {
      ...res,
      id: Math.random().toString(36).substr(2, 9),
      userId: state.currentUser.id,
      userName: state.currentUser.name,
      status: 'PENDING',
    };

    setState((s) => ({
      ...s,
      reservations: [...s.reservations, newRes],
    }));
  };

  const updateReservationStatus = (id: string, status: ReservationStatus, reason?: string, signedFileName?: string) => {
    setState((s) => {
      const newReservations = s.reservations.map((r) => {
        if (r.id === id) {
          return { ...r, status, rejectReason: reason, signedFileName };
        }
        return r;
      });

      // If status is ABSENT, apply penalty
      let newUsers = s.users;
      if (status === 'ABSENT') {
        const res = s.reservations.find(r => r.id === id);
        if (res) {
          newUsers = applyPenaltyLogic(newUsers, res.userId);
        }
      }

      return { ...s, reservations: newReservations, users: newUsers };
    });
  };

  const applyPenaltyLogic = (users: User[], userId: string) => {
    return users.map(u => {
      if (u.id === userId) {
        const penaltyDate = new Date();
        penaltyDate.setDate(penaltyDate.getDate() + 7); // 7 days penalty
        return { ...u, penaltyUntil: penaltyDate.toISOString() };
      }
      return u;
    });
  };

  const applyPenalty = (userId: string) => {
    setState(s => ({ ...s, users: applyPenaltyLogic(s.users, userId) }));
  };

  const submitAppeal = (reason: string) => {
    setState(s => {
      if (!s.currentUser) return s;
      const newUsers = s.users.map(u => u.id === s.currentUser!.id ? { ...u, penaltyAppealReason: reason, penaltyAppealStatus: 'PENDING' as const } : u);
      return { ...s, users: newUsers, currentUser: newUsers.find(u => u.id === s.currentUser!.id) || s.currentUser };
    });
  };

  const resolveAppeal = (userId: string, approved: boolean) => {
    setState(s => {
      const newUsers = s.users.map(u => {
        if (u.id === userId) {
          if (approved) {
            return { ...u, penaltyUntil: null, penaltyAppealReason: undefined, penaltyAppealStatus: null };
          } else {
            return { ...u, penaltyAppealStatus: 'REJECTED' as const };
          }
        }
        return u;
      });
      return { ...s, users: newUsers, currentUser: s.currentUser?.id === userId ? newUsers.find(u => u.id === userId) || s.currentUser : s.currentUser };
    });
  };

  const resetStore = () => {
    localStorage.removeItem('sigred_upla_state');
    window.location.reload();
  };

  return (
    <StoreContext.Provider value={{ ...state, login, logout, createReservation, updateReservationStatus, applyPenalty, submitAppeal, resolveAppeal, resetStore }}>
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const context = useContext(StoreContext);
  if (!context) throw new Error('useStore must be used within a StoreProvider');
  return context;
}
