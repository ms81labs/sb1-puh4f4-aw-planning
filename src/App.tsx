import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { LoginForm } from './components/auth/LoginForm';
import { RegisterForm } from './components/auth/RegisterForm';
import { DashboardLayout } from './components/dashboard/Layout';
import { ChampionsList } from './components/champions/ChampionsList';
import { UserManagement } from './components/users/UserManagement';
import { AllianceManagement } from './components/alliance/AllianceManagement';
import { AllianceOverview } from './components/alliance/AllianceOverview';
import { AllianceDeck } from './components/alliance/AllianceDeck';
import { WarMap } from './components/war/WarMap';
import { ChampionBans } from './components/war/ChampionBans';
import { useAuthStore } from './store/authStore';

function PrivateRoute({ children, adminOnly = false }: { children: React.ReactNode; adminOnly?: boolean }) {
  const { isAuthenticated, user } = useAuthStore();
  
  if (!isAuthenticated) return <Navigate to="/login" />;
  if (adminOnly && user?.role !== 'admin') return <Navigate to="/dashboard" />;
  
  return <>{children}</>;
}

export default function App() {
  const { user } = useAuthStore();
  const isAdmin = user?.role === 'admin';

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginForm />} />
        <Route path="/register" element={<RegisterForm />} />
        <Route path="/" element={<Navigate to="/dashboard" />} />
        
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <DashboardLayout />
            </PrivateRoute>
          }
        >
          {/* Admin Routes */}
          {isAdmin ? (
            <Route index element={<ChampionsList />} />
          ) : (
            <Route index element={<Navigate to="/dashboard/alliance-deck" />} />
          )}
          
          <Route path="alliance-members" element={<AllianceManagement />} />
          <Route path="alliance-overview" element={<AllianceOverview />} />
          <Route path="war-map" element={<WarMap />} />
          <Route path="champion-bans" element={<ChampionBans />} />
          
          {/* Admin Only Routes */}
          <Route
            path="users"
            element={
              <PrivateRoute adminOnly>
                <UserManagement />
              </PrivateRoute>
            }
          />
          <Route
            path="settings"
            element={
              <PrivateRoute adminOnly>
                <div>Settings (Coming soon)</div>
              </PrivateRoute>
            }
          />
          
          {/* User Only Routes */}
          {!isAdmin && (
            <>
              <Route path="alliance-deck" element={<AllianceDeck />} />
              <Route path="background" element={<div>Background Settings (Coming soon)</div>} />
            </>
          )}
        </Route>
      </Routes>
    </Router>
  );
}