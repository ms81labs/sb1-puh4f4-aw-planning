import React from 'react';
import { Album } from 'lucide-react';

export function AllianceDeck() {
  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2">
        <Album className="w-6 h-6 text-blue-600" />
        <h1 className="text-2xl font-bold text-gray-900">Alliance Deck</h1>
      </div>

      <div className="bg-white p-8 rounded-lg shadow-md">
        <div className="text-center text-gray-500">
          <Album className="w-16 h-16 mx-auto mb-4 text-gray-400" />
          <h2 className="text-xl font-semibold mb-2">Coming Soon</h2>
          <p>
            The Alliance Deck feature will allow you to view and manage champion decks
            for all alliance members. Stay tuned for updates!
          </p>
        </div>
      </div>
    </div>
  );
}