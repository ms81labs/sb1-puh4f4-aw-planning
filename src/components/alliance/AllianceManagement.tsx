import React, { useState, useEffect } from 'react';
import { useAllianceStore } from '../../store/allianceStore';
import { Plus, Users } from 'lucide-react';
import { AddMemberModal } from './AddMemberModal';
import { MembersList } from './MembersList';

export function AllianceManagement() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const { members, loadMembers } = useAllianceStore();

  useEffect(() => {
    loadMembers();
  }, [loadMembers]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <Users className="w-6 h-6 text-blue-600" />
          <h1 className="text-2xl font-bold text-gray-900">Alliance Members</h1>
          <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm">
            {members.length} members
          </span>
        </div>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          <Plus className="w-5 h-5 mr-2" />
          Add Member
        </button>
      </div>

      <div className="bg-white p-4 rounded-lg shadow-sm">
        <MembersList />
      </div>

      <AddMemberModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />
    </div>
  );
}