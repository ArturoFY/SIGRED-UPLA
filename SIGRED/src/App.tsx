/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { StrictMode } from 'react';
import { StoreProvider, useStore } from './store';
import Layout from './components/Layout';
import Login from './components/Login';
import StudentDashboard from './components/StudentDashboard';
import AdminDashboard from './components/AdminDashboard';
import GuardDashboard from './components/GuardDashboard';

function AppContent() {
  const { currentUser } = useStore();

  if (!currentUser) {
    return <Login />;
  }

  return (
    <Layout>
      {currentUser.role === 'STUDENT' && <StudentDashboard />}
      {currentUser.role === 'ADMIN' && <AdminDashboard />}
      {currentUser.role === 'GUARD' && <GuardDashboard />}
    </Layout>
  );
}

export default function App() {
  return (
    <StoreProvider>
      <AppContent />
    </StoreProvider>
  );
}
