import React, { useState } from 'react';
import { X } from 'lucide-react';
import { useChampionStore } from '../../store/championStore';
import { ChampionClass, StarRating } from '../../types/champion';

interface ImportChampionsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ImportChampionsModal({ isOpen, onClose }: ImportChampionsModalProps) {
  const [championText, setChampionText] = useState('');
  const [championClass, setChampionClass] = useState<ChampionClass>('Cosmic');
  const [starRating, setStarRating] = useState<StarRating>(6);
  const [error, setError] = useState('');
  
  const { addChampionsBulk, isLoading } = useChampionStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    try {
      const names = championText
        .split(',')
        .map(name => name.trim())
        .filter(Boolean);

      if (names.length === 0) {
        setError('Please enter at least one champion name');
        return;
      }

      await addChampionsBulk(names, championClass, starRating);
      setChampionText('');
      onClose();
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to import champions');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Import Champions</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Champion Names (comma-separated)
            </label>
            <textarea
              value={championText}
              onChange={(e) => setChampionText(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              rows={10}
              placeholder="Enter champion names separated by commas..."
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Class</label>
              <select
                value={championClass}
                onChange={(e) => setChampionClass(e.target.value as ChampionClass)}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              >
                {['Cosmic', 'Tech', 'Mutant', 'Skill', 'Science', 'Mystic'].map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Star Rating</label>
              <select
                value={starRating}
                onChange={(e) => setStarRating(Number(e.target.value) as StarRating)}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              >
                <option value={6}>6-Star</option>
                <option value={7}>7-Star</option>
              </select>
            </div>
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
              disabled={isLoading}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {isLoading ? 'Importing...' : 'Import Champions'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}