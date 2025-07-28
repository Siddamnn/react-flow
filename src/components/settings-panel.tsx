import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

type SettingsPanelProps = {
  // The current text/label of the selected node.
  nodeLabel: string;
  // Callback to update the node's label.
  setNodeLabel: (label: string) => void;
  // Callback to go back to the nodes panel (deselects the node).
  onBack: () => void;
};

// This panel appears when a node is selected, allowing its properties to be edited.
export function SettingsPanel({ nodeLabel, setNodeLabel, onBack }: SettingsPanelProps) {
  return (
    <div className="p-4 space-y-4 h-full flex flex-col">
      <div className="flex items-center gap-2 border-b pb-2">
        <Button variant="ghost" size="icon" onClick={onBack} aria-label="Go back to nodes panel">
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h3 className="text-lg font-semibold text-primary font-headline">Edit Message</h3>
      </div>
      <div className="space-y-2 flex-grow">
        <Label htmlFor="message-text">Text</Label>
        <Textarea
          id="message-text"
          value={nodeLabel}
          onChange={(e) => setNodeLabel(e.target.value)}
          className="h-40"
          placeholder="Enter your message..."
        />
      </div>
    </div>
  );
}
