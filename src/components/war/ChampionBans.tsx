import React from 'react';
import { Shield } from 'lucide-react';
import { useWarMapStore } from '../../store/warMapStore';
import { MapDifficultySelector } from './MapDifficultySelector';
import { ChampionBanSelector } from './ChampionBanSelector';

export function ChampionBans() {
  const {
    currentDifficulty,
    championBans,
    setMapDifficulty,
    addChampionBan,
    removeChampionBan,
  } = useWarMapStore();

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      <div className="flex items-center space-x-2">
        <Shield className="w-6 h-6 text-blue-600" />
        <h1 className="text-2xl font-bold text-gray-900">Champion Bans</h1>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm space-y-6">
        <MapDifficultySelector
          currentDifficulty={currentDifficulty}
          onDifficultyChange={setMapDifficulty}
        />
        
        <ChampionBanSelector
          onBanChampion={addChampionBan}
          onRemoveBan={removeChampionBan}
          bannedChampions={championBans}
          currentDifficulty={currentDifficulty}
        />
      </div>
    </div>
  );
}