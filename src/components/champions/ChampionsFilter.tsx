import React from 'react';
import { Filter } from 'lucide-react';
import { ChampionClass, StarRating } from '../../types/champion';

const CLASSES: ChampionClass[] = ['Cosmic', 'Tech', 'Science', 'Mystic', 'Mutant', 'Skill'];

const CLASS_COLORS = {
  Cosmic: 'bg-purple-100 text-purple-800',
  Tech: 'bg-blue-100 text-blue-800',
  Science: 'bg-green-100 text-green-800',
  Mystic: 'bg-indigo-100 text-indigo-800',
  Mutant: 'bg-red-100 text-red-800',
  Skill: 'bg-gray-100 text-gray-800',
};

interface ChampionsFilterProps {
  selectedClass: ChampionClass | 'all';
  selectedStar: StarRating | 'all';
  onClassChange: (value: ChampionClass | 'all') => void;
  onStarChange: (value: StarRating | 'all') => void;
}

export function ChampionsFilter({
  selectedClass,
  selectedStar,
  onClassChange,
  onStarChange,
}: ChampionsFilterProps) {
  return (
    <div className="space-y-4 mb-6">
      <div className="flex items-center space-x-2 text-gray-700">
        <Filter className="w-5 h-5" />
        <span className="font-medium">Filters</span>
      </div>
      
      <div className="space-y-4">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => onClassChange('all')}
            className={`px-4 py-2 rounded-md transition-colors ${
              selectedClass === 'all'
                ? 'bg-gray-900 text-white'
                : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
            }`}
          >
            All Classes
          </button>
          {CLASSES.map((classType) => (
            <button
              key={classType}
              onClick={() => onClassChange(classType)}
              className={`px-4 py-2 rounded-md transition-colors ${
                selectedClass === classType
                  ? 'bg-gray-900 text-white'
                  : CLASS_COLORS[classType]
              }`}
            >
              {classType}
            </button>
          ))}
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => onStarChange('all')}
            className={`px-4 py-2 rounded-md transition-colors ${
              selectedStar === 'all'
                ? 'bg-gray-900 text-white'
                : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
            }`}
          >
            All Stars
          </button>
          <button
            onClick={() => onStarChange(6)}
            className={`px-4 py-2 rounded-md transition-colors ${
              selectedStar === 6
                ? 'bg-gray-900 text-white'
                : 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
            }`}
          >
            6-Star
          </button>
          <button
            onClick={() => onStarChange(7)}
            className={`px-4 py-2 rounded-md transition-colors ${
              selectedStar === 7
                ? 'bg-gray-900 text-white'
                : 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
            }`}
          >
            7-Star
          </button>
        </div>
      </div>
    </div>
  );
}