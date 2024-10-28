import React, { useState, useEffect } from 'react';
import { useChampionStore } from '../../store/championStore';
import { ChampionClass, StarRating, Champion } from '../../types/champion';
import { Plus, Upload, Users, Trash2, Edit, AlertTriangle } from 'lucide-react';
import { AddChampionModal } from './AddChampionModal';
import { ImportChampionsModal } from './ImportChampionsModal';
import { EditChampionModal } from './EditChampionModal';
import { DeleteAllChampionsModal } from './DeleteAllChampionsModal';
import { ChampionsFilter } from './ChampionsFilter';

const CLASS_COLORS = {
  Cosmic: 'bg-purple-100 text-purple-800',
  Tech: 'bg-blue-100 text-blue-800',
  Science: 'bg-green-100 text-green-800',
  Mystic: 'bg-indigo-100 text-indigo-800',
  Mutant: 'bg-red-100 text-red-800',
  Skill: 'bg-gray-100 text-gray-800',
};

export function ChampionsList() {
  const { champions, loadChampions, isLoading, deleteChampion, deleteAllChampions } = useChampionStore();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [isDeleteAllModalOpen, setIsDeleteAllModalOpen] = useState(false);
  const [selectedChampion, setSelectedChampion] = useState<Champion | null>(null);
  const [selectedClass, setSelectedClass] = useState<ChampionClass | 'all'>('all');
  const [selectedStar, setSelectedStar] = useState<StarRating | 'all'>('all');

  useEffect(() => {
    loadChampions();
  }, [loadChampions]);

  const filteredChampions = champions.filter(champion => {
    if (selectedClass !== 'all' && champion.class !== selectedClass) return false;
    if (selectedStar !== 'all' && champion.starRating !== selectedStar) return false;
    return true;
  });

  const handleDeleteChampion = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this champion?')) {
      await deleteChampion(id);
    }
  };

  const handleDeleteAllChampions = async () => {
    await deleteAllChampions();
    setIsDeleteAllModalOpen(false);
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <h1 className="text-2xl font-bold text-gray-900">Champions</h1>
          <div className="flex items-center bg-white px-3 py-1 rounded-full shadow-sm">
            <Users className="w-4 h-4 text-blue-600 mr-2" />
            <span className="text-sm font-medium">
              {filteredChampions.length} / {champions.length}
            </span>
          </div>
        </div>
        <div className="flex space-x-3">
          {champions.length > 0 && (
            <button
              onClick={() => setIsDeleteAllModalOpen(true)}
              className="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
            >
              <AlertTriangle className="w-5 h-5 mr-2" />
              Delete All
            </button>
          )}
          <button
            onClick={() => setIsImportModalOpen(true)}
            className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
          >
            <Upload className="w-5 h-5 mr-2" />
            Import from Text
          </button>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            <Plus className="w-5 h-5 mr-2" />
            Add Champion
          </button>
        </div>
      </div>

      <ChampionsFilter
        selectedClass={selectedClass}
        selectedStar={selectedStar}
        onClassChange={setSelectedClass}
        onStarChange={setSelectedStar}
      />

      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-500">Loading champions...</div>
        </div>
      ) : champions.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">No champions added yet.</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="divide-y divide-gray-200">
            {filteredChampions.map((champion) => (
              <div
                key={champion.id}
                className="flex items-center justify-between p-4 hover:bg-gray-50"
              >
                <div className="flex items-center space-x-4">
                  {champion.imageUrl ? (
                    <img
                      src={champion.imageUrl}
                      alt={champion.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-gray-200" />
                  )}
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">{champion.name}</h3>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className={`px-2 py-1 rounded-md text-xs font-medium ${CLASS_COLORS[champion.class]}`}>
                        {champion.class}
                      </span>
                      <span className="px-2 py-1 rounded-md text-xs font-medium bg-yellow-100 text-yellow-800">
                        {champion.starRating}-Star
                      </span>
                      {champion.ranks.map((rank) => (
                        <span
                          key={rank}
                          className="px-2 py-1 rounded-md text-xs font-medium bg-blue-100 text-blue-800"
                        >
                          R{rank}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setSelectedChampion(champion)}
                    className="p-2 text-gray-400 hover:text-blue-600"
                  >
                    <Edit className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleDeleteChampion(champion.id)}
                    className="p-2 text-gray-400 hover:text-red-600"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <AddChampionModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />

      <ImportChampionsModal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
      />

      <EditChampionModal
        isOpen={!!selectedChampion}
        onClose={() => setSelectedChampion(null)}
        champion={selectedChampion}
      />

      <DeleteAllChampionsModal
        isOpen={isDeleteAllModalOpen}
        onClose={() => setIsDeleteAllModalOpen(false)}
        onConfirm={handleDeleteAllChampions}
        championCount={champions.length}
      />
    </div>
  );
}