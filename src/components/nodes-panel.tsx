import { MessageSquare } from 'lucide-react';

// This panel displays the types of nodes that can be added to the flow.
// It's designed to be extensible for future node types.
export function NodesPanel() {
  // This function is called when a node is dragged from the panel.
  // It sets the node type in the data transfer object.
  const onDragStart = (event: React.DragEvent, nodeType: string) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <div className="p-4">
      <h3 className="text-lg font-semibold mb-4 text-primary font-headline">Nodes Panel</h3>
      <div
        className="p-4 border rounded-md cursor-grab flex flex-col items-center gap-2 bg-card hover:shadow-lg transition-shadow"
        onDragStart={(event) => onDragStart(event, 'textNode')}
        draggable
      >
        <MessageSquare className="h-8 w-8 text-primary" />
        <span className="text-sm font-medium">Message</span>
      </div>
      <p className="text-xs text-muted-foreground mt-4 text-center">Drag a node to the canvas.</p>
    </div>
  );
}
