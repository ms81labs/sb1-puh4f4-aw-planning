import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Users, Crown, Settings, Map, LogOut, Album, Edit2, Shield } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { useAllianceStore } from '../../store/allianceStore';

const getNavItems = (isAdmin: boolean) => {
  const adminItems = [
    { to: '/dashboard', icon: Crown, label: 'Champions' },
    { to: '/dashboard/users', icon: Users, label: 'Users' },
    { to: '/dashboard/war-map', icon: Map, label: 'War Map' },
    { to: '/dashboard/champion-bans', icon: Shield, label: 'Champion Bans' },
    { to: '/dashboard/settings', icon: Settings, label: 'Settings' }
  ];

  const userItems = [
    { to: '/dashboard/alliance-members', icon: Users, label: 'Alliance Members' },
    { to: '/dashboard/alliance-deck', icon: Album, label: 'Alliance Deck' },
    { to: '/dashboard/war-map', icon: Map, label: 'War Map' },
    { to: '/dashboard/champion-bans', icon: Shield, label: 'Champion Bans' }
  ];

  return isAdmin ? adminItems : userItems;
};

export function Sidebar() {
  const navigate = useNavigate();
  const { logout, user } = useAuthStore();
  const { allianceName, updateAllianceName } = useAllianceStore();
  const [isEditingName, setIsEditingName] = useState(false);
  const [editedName, setEditedName] = useState(allianceName);
  const isAdmin = user?.role === 'admin';

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleNameSubmit = async () => {
    if (editedName.trim()) {
      await updateAllianceName(editedName.trim());
      setIsEditingName(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleNameSubmit();
    }
  };

  return (
    <div className="bg-gray-800 text-white w-64 min-h-screen p-4 flex flex-col">
      <div className="mb-8">
        {isAdmin && <h1 className="text-2xl font-bold">Champions Manager</h1>}
      </div>
      
      <nav className="space-y-2 flex-1">
        {getNavItems(isAdmin).map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center space-x-3 px-4 py-2 rounded-lg transition-colors ${
                isActive
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-300 hover:bg-gray-700'
              }`
            }
          >
            <Icon className="w-5 h-5" />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="border-t border-gray-700 pt-4 mt-4">
        <div className="flex items-center justify-between px-4 py-2 mb-4">
          {isEditingName ? (
            <input
              type="text"
              value={editedName}
              onChange={(e) => setEditedName(e.target.value)}
              onBlur={handleNameSubmit}
              onKeyPress={handleKeyPress}
              className="bg-gray-700 text-white px-2 py-1 rounded w-full"
              placeholder="Enter alliance name"
              autoFocus
            />
          ) : (
            <div className="flex items-center justify-between w-full">
              <span className="text-gray-300">{allianceName || 'Alliance Name'}</span>
              <button
                onClick={() => setIsEditingName(true)}
                className="text-gray-400 hover:text-white"
              >
                <Edit2 className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        <button
          onClick={handleLogout}
          className="flex items-center space-x-3 px-4 py-2 rounded-lg text-red-300 hover:bg-red-900/20 hover:text-red-200 transition-colors w-full"
        >
          <LogOut className="w-5 h-5" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
}