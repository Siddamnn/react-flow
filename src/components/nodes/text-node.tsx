import { Handle, Position, NodeProps } from 'reactflow';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { MessageSquare } from 'lucide-react';

// This is a custom node component for displaying text messages in the flow.
export function TextNode({ data, isConnectable }: NodeProps<{ label: string }>) {
  return (
    <Card className="shadow-md rounded-lg w-64 border-primary/50">
      {/* Target handle on the left for incoming connections. */}
      <Handle
        type="target"
        position={Position.Left}
        isConnectable={isConnectable}
        className="!bg-primary"
      />
      <CardHeader className="flex flex-row items-center space-x-2 space-y-0 p-2 bg-secondary/30 rounded-t-lg border-b">
        <MessageSquare className="h-4 w-4 text-primary" />
        <CardTitle className="text-sm font-medium">Text Message</CardTitle>
      </CardHeader>
      <CardContent className="p-3 text-sm">
        {/* The content of the message. Shows placeholder if empty. */}
        <p className="text-muted-foreground break-words">{data.label || 'Click to edit text...'}</p>
      </CardContent>
      {/* Source handle on the right for outgoing connections. */}
      <Handle
        type="source"
        position={Position.Right}
        isConnectable={isConnectable}
        className="!bg-primary"
      />
    </Card>
  );
}
