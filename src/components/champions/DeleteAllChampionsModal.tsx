import React, { useState } from 'react';
import { X, AlertTriangle } from 'lucide-react';

interface DeleteAllChampionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  championCount: number;
}

export function DeleteAllChampionsModal({
  isOpen,
  onClose,
  onConfirm,
  championCount,
}: DeleteAllChampionsModalProps) {
  const [confirmText, setConfirmText] = useState('');
  const expectedText = 'DELETE ALL CHAMPIONS';

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-md w-full p-6">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center space-x-2 text-red-600">
            <AlertTriangle className="w-6 h-6" />
            <h2 className="text-xl font-semibold">Delete All Champions</h2>
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4">
          <div className="bg-red-50 p-4 rounded-md">
            <p className="text-red-800">
              Warning: You are about to delete all {championCount} champions. This action cannot be undone.
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Type "DELETE ALL CHAMPIONS" to confirm:
            </label>
            <input
              type="text"
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              className="w-full border border-gray-300 rounded-md p-2"
              placeholder="DELETE ALL CHAMPIONS"
            />
          </div>

          <div className="flex justify-end space-x-3 mt-6">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              disabled={confirmText !== expectedText}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Delete All Champions
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}