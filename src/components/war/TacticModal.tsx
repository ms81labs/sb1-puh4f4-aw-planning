import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { NodeTactic, GlobalTactic, MapDifficulty } from '../../types/warMap';

interface TacticModalProps {
  isOpen: boolean;
  onClose: () => void;
  nodeNumber: number | null;
  difficulty: MapDifficulty;
  onSave: (tactic: string, notes?: string) => Promise<void>;
  initialTactic?: NodeTactic | GlobalTactic | null;
}

export function TacticModal({
  isOpen,
  onClose,
  nodeNumber,
  difficulty,
  onSave,
  initialTactic,
}: TacticModalProps) {
  const [tactic, setTactic] = useState('');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (initialTactic) {
      setTactic(initialTactic.tactic);
      setNotes(initialTactic.notes || '');
    } else {
      setTactic('');
      setNotes('');
    }
  }, [initialTactic]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    try {
      await onSave(tactic, notes || undefined);
      onClose();
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to save tactic');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-md w-full p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">
            {nodeNumber ? `Node ${nodeNumber} Tactic` : 'Global Tactic'} - {difficulty}
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Tactic
            </label>
            <textarea
              value={tactic}
              onChange={(e) => setTactic(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              rows={3}
              required
              placeholder="Enter tactic details..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Additional Notes
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              rows={2}
              placeholder="Optional notes..."
            />
          </div>

          {error && (
            <div className="bg-red-50 border-l-4 border-red-400 p-4">
              <p className="text-red-700">{error}</p>
            </div>
          )}

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Save Tactic
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}