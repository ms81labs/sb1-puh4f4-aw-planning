import React, { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { useAllianceStore } from '../../store/allianceStore';

export function DashboardLayout() {
  const { loadAllianceData } = useAllianceStore();

  useEffect(() => {
    loadAllianceData().catch(console.error);
  }, [loadAllianceData]);

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 bg-gray-100">
        <div className="p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}