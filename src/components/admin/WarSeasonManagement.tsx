import React, { useState } from 'react';
import { useWarSeasonStore } from '../../store/warSeasonStore';
import { Calendar, Plus } from 'lucide-react';

export function WarSeasonManagement() {
  const { seasons, createSeason, updateSeason, isLoading } = useWarSeasonStore();
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [newSeasonName, setNewSeasonName] = useState('');
  const [error, setError] = useState('');

  const handleCreateSeason = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      await createSeason({
        name: newSeasonName,
        isActive: true,
        startDate: new Date().toISOString(),
      });
      setIsAddingNew(false);
      setNewSeasonName('');
    } catch (err) {
      setError('Failed to create season');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <Calendar className="w-6 h-6 text-blue-600" />
          <h1 className="text-2xl font-bold text-gray-900">War Season Management</h1>
        </div>
        <button
          onClick={() => setIsAddingNew(true)}
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          <Plus className="w-5 h-5 mr-2" />
          New Season
        </button>
      </div>

      {isAddingNew && (
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <form onSubmit={handleCreateSeason} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Season Name
              </label>
              <input
                type="text"
                value={newSeasonName}
                onChange={(e) => setNewSeasonName(e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                placeholder="Enter season name"
                required
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
                onClick={() => setIsAddingNew(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
              >
                Create Season
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Season Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Start Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {seasons.map((season) => (
              <tr key={season.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {season.name}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(season.startDate).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      season.isActive
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {season.isActive ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={() => updateSeason(season.id, { isActive: !season.isActive })}
                    className={`text-${season.isActive ? 'red' : 'green'}-600 hover:text-${
                      season.isActive ? 'red' : 'green'
                    }-900`}
                  >
                    {season.isActive ? 'End Season' : 'Activate'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}