import type { Node } from 'reactflow';
import { NodesPanel } from './nodes-panel';
import { SettingsPanel } from './settings-panel';

type SidebarProps = {
  // The currently selected node, or null if no node is selected.
  selectedNode: Node | null | undefined;
  // Callback to update the selected node's label.
  updateNodeLabel: (label: string) => void;
  // Callback to deselect the current node.
  deselectNode: () => void;
};

// The Sidebar component acts as a container that switches between the
// NodesPanel and the SettingsPanel based on whether a node is selected.
export function Sidebar({ selectedNode, updateNodeLabel, deselectNode }: SidebarProps) {
  return (
    <aside className="w-80 bg-card border-l shadow-lg shrink-0">
      {selectedNode ? (
        // If a node is selected, show the settings panel for it.
        <SettingsPanel
          nodeLabel={selectedNode.data.label}
          setNodeLabel={updateNodeLabel}
          onBack={deselectNode}
        />
      ) : (
        // Otherwise, show the panel with available nodes.
        <NodesPanel />
      )}
    </aside>
  );
}
