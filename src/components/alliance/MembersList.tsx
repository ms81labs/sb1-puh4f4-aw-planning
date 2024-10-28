import React, { useState } from 'react';
import { useAllianceStore } from '../../store/allianceStore';
import { Trash2, ToggleLeft, ToggleRight, AlertTriangle } from 'lucide-react';
import { DeleteConfirmationModal } from '../shared/DeleteConfirmationModal';

export function MembersList() {
  const { members, removeMember, assignToBg, toggleMemberStatus } = useAllianceStore();
  const [memberToDelete, setMemberToDelete] = useState<string | null>(null);

  const handleDeleteConfirm = async () => {
    if (memberToDelete) {
      await removeMember(memberToDelete);
      setMemberToDelete(null);
    }
  };

  return (
    <>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Member
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Line ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                Unassigned
              </th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                BG1
              </th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                BG2
              </th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                BG3
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {members.map((member) => (
              <tr key={member.id} className={!member.isActive ? 'bg-gray-50' : ''}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {member.name}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {member.lineId}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <button
                    onClick={() => toggleMemberStatus(member.id)}
                    className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      member.isActive
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {member.isActive ? (
                      <ToggleRight className="w-4 h-4 mr-1" />
                    ) : (
                      <ToggleLeft className="w-4 h-4 mr-1" />
                    )}
                    {member.isActive ? 'Active' : 'Inactive'}
                  </button>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center">
                  <input
                    type="radio"
                    checked={!member.battleground}
                    onChange={() => assignToBg(member.id, undefined)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 cursor-pointer"
                  />
                </td>
                {[1, 2, 3].map((bg) => (
                  <td key={bg} className="px-6 py-4 whitespace-nowrap text-center">
                    <input
                      type="radio"
                      checked={member.battleground === bg}
                      onChange={() => assignToBg(member.id, bg as 1 | 2 | 3)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 cursor-pointer"
                    />
                  </td>
                ))}
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={() => setMemberToDelete(member.id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <DeleteConfirmationModal
        isOpen={!!memberToDelete}
        onClose={() => setMemberToDelete(null)}
        onConfirm={handleDeleteConfirm}
        title="Delete Member"
        message="Are you sure you want to delete this member? This action cannot be undone."
      />
    </>
  );
}