import React, { useState, useEffect } from 'react';
import { X, Search, Save } from 'lucide-react';
import { useChampionStore } from '../../store/championStore';
import { Champion } from '../../types/champion';
import { MapDifficulty } from '../../types/warMap';

interface ChampionBanSelectorProps {
  onBanChampion: (championId: string) => void;
  onRemoveBan: (banId: string) => void;
  bannedChampions: Array<{ id: string; championId: string }>;
  currentDifficulty: MapDifficulty;
}

export function ChampionBanSelector({
  onBanChampion,
  onRemoveBan,
  bannedChampions,
  currentDifficulty,
}: ChampionBanSelectorProps) {
  const [search, setSearch] = useState('');
  const [selectedChampions, setSelectedChampions] = useState<string[]>([]);
  const { champions, loadChampions } = useChampionStore();
  const [filteredChampions, setFilteredChampions] = useState<Champion[]>([]);

  const maxBans = currentDifficulty === 'Elite' ? 5 : 3;
  const remainingBans = maxBans - bannedChampions.length;

  useEffect(() => {
    loadChampions();
  }, [loadChampions]);

  useEffect(() => {
    const bannedIds = new Set(bannedChampions.map(ban => ban.championId));
    const filtered = champions.filter(champion => {
      const matchesSearch = search.trim() === '' || 
        champion.name.toLowerCase().includes(search.toLowerCase());
      const notBanned = !bannedIds.has(champion.id);
      return matchesSearch && notBanned;
    });
    setFilteredChampions(filtered);
  }, [search, champions, bannedChampions]);

  const handleChampionSelect = (championId: string) => {
    if (selectedChampions.includes(championId)) {
      setSelectedChampions(selectedChampions.filter(id => id !== championId));
    } else if (selectedChampions.length < remainingBans) {
      setSelectedChampions([...selectedChampions, championId]);
    }
  };

  const handleSave = async () => {
    try {
      for (const championId of selectedChampions) {
        await onBanChampion(championId);
      }
      setSelectedChampions([]);
      setSearch('');
    } catch (error) {
      console.error('Failed to save bans:', error);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-600">
          {remainingBans} ban{remainingBans !== 1 ? 's' : ''} remaining 
          ({bannedChampions.length}/{maxBans})
        </div>
        {selectedChampions.length > 0 && (
          <button
            onClick={handleSave}
            className="inline-flex items-center px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            <Save className="w-4 h-4 mr-1" />
            Save Bans ({selectedChampions.length})
          </button>
        )}
      </div>

      <div className="relative">
        <div className="relative">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search champions..."
            className="w-full px-4 py-2 border border-gray-300 rounded-md pl-10"
          />
          <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        {bannedChampions.map((ban) => {
          const champion = champions.find((c) => c.id === ban.championId);
          if (!champion) return null;

          return (
            <div
              key={ban.id}
              className="inline-flex items-center px-3 py-1 rounded-full bg-red-100 text-red-800"
            >
              <span>{champion.name}</span>
              <button
                onClick={() => onRemoveBan(ban.id)}
                className="ml-2 text-red-600 hover:text-red-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
        {filteredChampions.map((champion) => (
          <button
            key={champion.id}
            onClick={() => handleChampionSelect(champion.id)}
            disabled={bannedChampions.some(ban => ban.championId === champion.id)}
            className={`p-2 rounded-md text-left transition-colors ${
              selectedChampions.includes(champion.id)
                ? 'bg-blue-100 text-blue-800 border-2 border-blue-500'
                : 'bg-gray-100 hover:bg-gray-200 text-gray-800'
            } ${
              bannedChampions.some(ban => ban.championId === champion.id)
                ? 'opacity-50 cursor-not-allowed'
                : ''
            }`}
          >
            <div className="font-medium">{champion.name}</div>
            <div className="text-sm opacity-75">{champion.class}</div>
          </button>
        ))}
      </div>
    </div>
  );
}