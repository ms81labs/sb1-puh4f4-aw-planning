import React from 'react';
import { Shield } from 'lucide-react';
import { MapDifficulty } from '../../types/warMap';

interface MapDifficultySelectorProps {
  currentDifficulty: MapDifficulty;
  onDifficultyChange: (difficulty: MapDifficulty) => void;
}

const DIFFICULTIES: MapDifficulty[] = ['Challenger', 'Expert', 'Elite'];

const DIFFICULTY_COLORS = {
  Challenger: 'bg-purple-100 text-purple-800 border-purple-200',
  Expert: 'bg-blue-100 text-blue-800 border-blue-200',
  Elite: 'bg-red-100 text-red-800 border-red-200',
};

export function MapDifficultySelector({
  currentDifficulty,
  onDifficultyChange,
}: MapDifficultySelectorProps) {
  return (
    <div className="flex items-center space-x-4">
      <div className="flex items-center text-gray-700">
        <Shield className="w-5 h-5 mr-2" />
        <span className="font-medium">Map Difficulty:</span>
      </div>
      <div className="flex space-x-2">
        {DIFFICULTIES.map((difficulty) => (
          <button
            key={difficulty}
            onClick={() => onDifficultyChange(difficulty)}
            className={`px-4 py-2 rounded-md border transition-colors ${
              currentDifficulty === difficulty
                ? DIFFICULTY_COLORS[difficulty]
                : 'bg-gray-100 text-gray-600 border-gray-200 hover:bg-gray-200'
            }`}
          >
            {difficulty}
          </button>
        ))}
      </div>
    </div>
  );
}