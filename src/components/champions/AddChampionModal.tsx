import React, { useState } from 'react';
import { X } from 'lucide-react';
import { ChampionClass, StarRating } from '../../types/champion';
import { useChampionStore } from '../../store/championStore';

const CLASSES: ChampionClass[] = ['Cosmic', 'Tech', 'Science', 'Mystic', 'Mutant', 'Skill'];
const STAR_RATINGS: StarRating[] = [6, 7];

interface AddChampionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AddChampionModal({ isOpen, onClose }: AddChampionModalProps) {
  const { addChampion, addChampionsBulk } = useChampionStore();
  const [name, setName] = useState('');
  const [championClass, setChampionClass] = useState<ChampionClass>('Cosmic');
  const [starRating, setStarRating] = useState<StarRating>(6);
  const [bulkNames, setBulkNames] = useState('');
  const [isBulkMode, setIsBulkMode] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    try {
      if (isBulkMode) {
        const names = bulkNames
          .split(/[,.]/)
          .map(n => n.trim())
          .filter(Boolean);
        
        if (names.length === 0) {
          setError('Please enter at least one champion name');
          return;
        }

        await addChampionsBulk(names, championClass, starRating);
      } else {
        await addChampion({
          name,
          class: championClass,
          starRating,
          ranks: starRating === 6 ? [4, 5, 6] : [1, 2, 3],
        });
      }
      setError('');
      onClose();
      setName('');
      setBulkNames('');
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to add champion(s)');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-md w-full p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Add Champion</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex items-center space-x-4">
            <button
              type="button"
              onClick={() => setIsBulkMode(false)}
              className={`px-3 py-1 rounded ${
                !isBulkMode ? 'bg-blue-100 text-blue-800' : 'bg-gray-100'
              }`}
            >
              Single
            </button>
            <button
              type="button"
              onClick={() => setIsBulkMode(true)}
              className={`px-3 py-1 rounded ${
                isBulkMode ? 'bg-blue-100 text-blue-800' : 'bg-gray-100'
              }`}
            >
              Bulk
            </button>
          </div>

          {isBulkMode ? (
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Champion Names (separated by commas or periods)
              </label>
              <textarea
                value={bulkNames}
                onChange={(e) => setBulkNames(e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                placeholder="Thor, Hulk, Iron Man"
                rows={3}
              />
            </div>
          ) : (
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Champion Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                placeholder="Enter champion name"
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700">Class</label>
            <select
              value={championClass}
              onChange={(e) => setChampionClass(e.target.value as ChampionClass)}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            >
              {CLASSES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Star Rating
            </label>
            <select
              value={starRating}
              onChange={(e) => setStarRating(Number(e.target.value) as StarRating)}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            >
              {STAR_RATINGS.map((star) => (
                <option key={star} value={star}>
                  {star}-Star
                </option>
              ))}
            </select>
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
              Add Champion{isBulkMode ? 's' : ''}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}