import { Button } from "@/components/ui/button";
import { Save } from "lucide-react";

type HeaderProps = {
  // Callback function to be executed when the save button is clicked.
  onSave: () => void;
};

// The Header component displays the application title and a save button.
export function Header({ onSave }: HeaderProps) {
  return (
    <header className="flex justify-between items-center p-3 border-b bg-card shadow-sm shrink-0">
      <h1 className="text-2xl font-bold text-primary font-headline">FlowCraft</h1>
      <Button onClick={onSave} className="bg-accent hover:bg-accent/90">
        <Save className="mr-2 h-4 w-4" />
        Save Flow
      </Button>
    </header>
  );
}
