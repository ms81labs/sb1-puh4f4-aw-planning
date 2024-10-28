import React, { useState, useEffect, useRef } from 'react';
import { X, Upload } from 'lucide-react';
import { Champion, ChampionClass, StarRating } from '../../types/champion';
import { useChampionStore } from '../../store/championStore';

const CLASSES: ChampionClass[] = ['Cosmic', 'Tech', 'Science', 'Mystic', 'Mutant', 'Skill'];
const STAR_RATINGS: StarRating[] = [6, 7];

interface EditChampionModalProps {
  isOpen: boolean;
  onClose: () => void;
  champion: Champion | null;
}

export function EditChampionModal({ isOpen, onClose, champion }: EditChampionModalProps) {
  const { updateChampion } = useChampionStore();
  const [name, setName] = useState('');
  const [championClass, setChampionClass] = useState<ChampionClass>('Cosmic');
  const [starRating, setStarRating] = useState<StarRating>(6);
  const [ranks, setRanks] = useState<number[]>([]);
  const [error, setError] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (champion) {
      setName(champion.name);
      setChampionClass(champion.class);
      setStarRating(champion.starRating);
      setRanks(champion.ranks);
      setImageUrl(champion.imageUrl || '');
    }
  }, [champion]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!champion) return;

    try {
      await updateChampion(champion.id, {
        name,
        class: championClass,
        starRating,
        ranks,
        imageUrl
      });
      onClose();
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to update champion');
    }
  };

  const handleRankToggle = (rank: number) => {
    setRanks(prev => 
      prev.includes(rank)
        ? prev.filter(r => r !== rank)
        : [...prev, rank].sort((a, b) => a - b)
    );
  };

  if (!isOpen || !champion) return null;

  const availableRanks = starRating === 6 ? [4, 5, 6] : [1, 2, 3];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-md w-full p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Edit Champion</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex items-center justify-center mb-4">
            <div className="relative">
              <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-200">
                {imageUrl ? (
                  <img
                    src={imageUrl}
                    alt={name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    <Upload className="w-8 h-8" />
                  </div>
                )}
              </div>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="absolute bottom-0 right-0 bg-blue-600 text-white p-1 rounded-full shadow-lg hover:bg-blue-700"
              >
                <Upload className="w-4 h-4" />
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Champion Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              required
            />
          </div>

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

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Ranks
            </label>
            <div className="flex gap-2">
              {availableRanks.map((rank) => (
                <button
                  key={rank}
                  type="button"
                  onClick={() => handleRankToggle(rank)}
                  className={`px-4 py-2 rounded-md ${
                    ranks.includes(rank)
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Rank {rank}
                </button>
              ))}
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
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}