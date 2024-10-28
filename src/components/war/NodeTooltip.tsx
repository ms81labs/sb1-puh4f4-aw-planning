import React from 'react';
import { GlobalTactic, NodeTactic, MapDifficulty } from '../../types/warMap';

interface NodeTooltipProps {
  nodeTactic?: NodeTactic;
  globalTactic: GlobalTactic | null;
  nodeNumber: number;
  difficulty: MapDifficulty;
}

export function NodeTooltip({ nodeTactic, globalTactic, nodeNumber, difficulty }: NodeTooltipProps) {
  if (!nodeTactic && !globalTactic) return null;

  return (
    <div className="absolute z-50 w-64 p-4 bg-white rounded-lg shadow-lg border border-gray-200 -translate-x-1/2 left-1/2 mt-2">
      <h3 className="font-medium text-gray-900 mb-2">
        Node {nodeNumber} Tactics - {difficulty}
      </h3>
      
      {nodeTactic && (
        <div className="mb-3">
          <p className="text-sm font-medium text-blue-800">Node Specific:</p>
          <p className="text-sm text-gray-600">{nodeTactic.tactic}</p>
          {nodeTactic.notes && (
            <p className="text-xs text-gray-500 mt-1">{nodeTactic.notes}</p>
          )}
        </div>
      )}

      {globalTactic && (
        <div>
          <p className="text-sm font-medium text-purple-800">Global Tactic:</p>
          <p className="text-sm text-gray-600">{globalTactic.tactic}</p>
          {globalTactic.notes && (
            <p className="text-xs text-gray-500 mt-1">{globalTactic.notes}</p>
          )}
        </div>
      )}
    </div>
  );
}