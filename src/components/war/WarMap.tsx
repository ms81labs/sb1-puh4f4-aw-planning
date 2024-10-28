import React, { useState, useEffect } from 'react';
import { Target } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { useWarMapStore } from '../../store/warMapStore';
import { MapDifficultySelector } from './MapDifficultySelector';
import { TacticModal } from './TacticModal';
import { NodeTooltip } from './NodeTooltip';

// Define node groups for the map layout (reversed)
const nodeGroups = {
  bossSection: {
    left: [[48, 46]],
    boss: ['boss'],
    right: [[49, 47]]
  },
  section3: {
    left: [[40, 41, 42]],
    middle: [[43, 44, 45]],
    right: [[37, 38, 39]]
  },
  section2: {
    left: [[28, 29, 30], [19, 20, 21]],
    middle: [[31, 32, 33], [22, 23, 24]],
    right: [[34, 35, 36], [25, 26, 27]]
  },
  section1: {
    left: [[10, 11, 12], [1, 2, 3]],
    middle: [[13, 14, 15], [4, 5, 6]],
    right: [[16, 17, 18], [7, 8, 9]]
  }
};

export function WarMap() {
  const { user } = useAuthStore();
  const {
    globalTactics,
    nodeTactics,
    currentDifficulty,
    setGlobalTactic,
    setNodeTactic,
    getNodeTactic,
    getGlobalTactic,
    loadTactics,
    setMapDifficulty,
  } = useWarMapStore();

  const [isGlobalModalOpen, setIsGlobalModalOpen] = useState(false);
  const [selectedNode, setSelectedNode] = useState<number | null>(null);
  const [hoveredNode, setHoveredNode] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const isAdmin = user?.role === 'admin';

  useEffect(() => {
    loadTactics().catch(err => {
      setError(err instanceof Error ? err.message : 'Failed to load tactics');
    });
  }, [loadTactics]);

  const handleGlobalTacticSave = async (tactic: string, notes?: string) => {
    try {
      await setGlobalTactic(currentDifficulty, { tactic, notes });
      setIsGlobalModalOpen(false);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save global tactic');
    }
  };

  const handleNodeTacticSave = async (tactic: string, notes?: string) => {
    if (selectedNode !== null) {
      try {
        await setNodeTactic(currentDifficulty, selectedNode, { tactic, notes });
        setSelectedNode(null);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to save node tactic');
      }
    }
  };

  const renderNode = (nodeNumber: number | string) => {
    const isNodeActive = typeof nodeNumber === 'number' && 
      nodeTactics.some(t => t.nodeNumber === nodeNumber && t.difficulty === currentDifficulty);
    const isBoss = nodeNumber === 'boss';

    return (
      <div
        key={nodeNumber}
        className={`relative ${
          isBoss ? 'w-16 h-16' : 'w-12 h-12'
        } border-2 border-gray-200 rounded-full hover:border-blue-500 transition-colors ${
          isAdmin ? 'cursor-pointer' : ''
        } ${isBoss ? 'bg-red-50' : 'bg-white'}`}
        onMouseEnter={() => typeof nodeNumber === 'number' && setHoveredNode(nodeNumber)}
        onMouseLeave={() => setHoveredNode(null)}
        onClick={() => isAdmin && typeof nodeNumber === 'number' && setSelectedNode(nodeNumber)}
      >
        <div className="absolute inset-0 flex items-center justify-center">
          <span className={`text-lg font-bold ${
            isBoss ? 'text-red-500' : 'text-gray-400'
          }`}>
            {isBoss ? 'B' : nodeNumber}
          </span>
        </div>
        {typeof nodeNumber === 'number' && hoveredNode === nodeNumber && (
          <NodeTooltip
            nodeTactic={getNodeTactic(currentDifficulty, nodeNumber)}
            globalTactic={getGlobalTactic(currentDifficulty)}
            nodeNumber={nodeNumber}
            difficulty={currentDifficulty}
          />
        )}
        {isNodeActive && (
          <div className="absolute top-1 right-1 w-2 h-2 bg-blue-500 rounded-full" />
        )}
      </div>
    );
  };

  const renderSection = (nodes: (number | string)[][]) => {
    return nodes.map((group, groupIndex) => (
      <div key={groupIndex} className="flex gap-4">
        {group.map(node => renderNode(node))}
      </div>
    ));
  };

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Alliance War Map</h1>
        {isAdmin && (
          <button
            onClick={() => setIsGlobalModalOpen(true)}
            className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
          >
            <Target className="w-5 h-5 mr-2" />
            Set Global Tactic
          </button>
        )}
      </div>

      {error && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4">
          <p className="text-red-700">{error}</p>
        </div>
      )}

      {isAdmin && (
        <MapDifficultySelector
          currentDifficulty={currentDifficulty}
          onDifficultyChange={setMapDifficulty}
        />
      )}

      <div className="bg-white p-6 rounded-lg shadow-sm relative">
        {/* Boss Section */}
        <div className="flex justify-center mb-16">
          {renderSection([nodeGroups.bossSection.boss])}
        </div>

        <div className="flex justify-between mb-16">
          <div className="flex flex-col items-center gap-8">
            {renderSection(nodeGroups.bossSection.left)}
          </div>
          <div className="flex flex-col items-center gap-8">
            {renderSection(nodeGroups.bossSection.right)}
          </div>
        </div>

        {/* Diamond Separator */}
        <div className="flex justify-center my-8">
          <div className="w-8 h-8 rotate-45 bg-gray-200"></div>
        </div>

        {/* Section 3 */}
        <div className="grid grid-cols-3 gap-16 mb-16">
          <div className="flex flex-col items-center gap-8">
            {renderSection(nodeGroups.section3.left)}
          </div>
          <div className="flex flex-col items-center gap-8">
            {renderSection(nodeGroups.section3.middle)}
          </div>
          <div className="flex flex-col items-center gap-8">
            {renderSection(nodeGroups.section3.right)}
          </div>
        </div>

        {/* Diamond Separator */}
        <div className="flex justify-center my-8">
          <div className="w-8 h-8 rotate-45 bg-gray-200"></div>
        </div>

        {/* Section 2 */}
        <div className="grid grid-cols-3 gap-16 mb-16">
          <div className="flex flex-col items-center gap-8">
            {renderSection(nodeGroups.section2.left)}
          </div>
          <div className="flex flex-col items-center gap-8">
            {renderSection(nodeGroups.section2.middle)}
          </div>
          <div className="flex flex-col items-center gap-8">
            {renderSection(nodeGroups.section2.right)}
          </div>
        </div>

        {/* Diamond Separator */}
        <div className="flex justify-center my-8">
          <div className="w-8 h-8 rotate-45 bg-gray-200"></div>
        </div>

        {/* Section 1 */}
        <div className="grid grid-cols-3 gap-16">
          <div className="flex flex-col items-center gap-8">
            {renderSection(nodeGroups.section1.left)}
          </div>
          <div className="flex flex-col items-center gap-8">
            {renderSection(nodeGroups.section1.middle)}
          </div>
          <div className="flex flex-col items-center gap-8">
            {renderSection(nodeGroups.section1.right)}
          </div>
        </div>
      </div>

      <TacticModal
        isOpen={isGlobalModalOpen}
        onClose={() => setIsGlobalModalOpen(false)}
        nodeNumber={null}
        onSave={handleGlobalTacticSave}
        initialTactic={getGlobalTactic(currentDifficulty)}
        difficulty={currentDifficulty}
      />

      <TacticModal
        isOpen={selectedNode !== null}
        onClose={() => setSelectedNode(null)}
        nodeNumber={selectedNode}
        onSave={handleNodeTacticSave}
        initialTactic={selectedNode ? getNodeTactic(currentDifficulty, selectedNode) : null}
        difficulty={currentDifficulty}
      />
    </div>
  );
}