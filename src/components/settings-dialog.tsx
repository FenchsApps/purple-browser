"use client";

import { useState, useEffect } from 'react';
import { Settings, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetFooter, SheetDescription } from '@/components/ui/sheet';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';

type SettingsProps = {
  currentSettings: {
    lineColor: string;
  };
  onSave: (newSettings: { lineColor: string }) => void;
};

export function SettingsDialog({ currentSettings, onSave }: SettingsProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [lineColor, setLineColor] = useState(currentSettings.lineColor);
  const { toast } = useToast();

  useEffect(() => {
    setLineColor(currentSettings.lineColor);
  }, [currentSettings.lineColor, isOpen]);

  const handleSave = () => {
    onSave({ lineColor });
    toast({
      title: "Settings Saved",
      description: "Your preferences have been updated.",
      action: <Check className="h-4 w-4 text-green-500" />,
    });
    setIsOpen(false);
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon">
          <Settings className="h-5 w-5" />
          <span className="sr-only">Open Settings</span>
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Settings</SheetTitle>
          <SheetDescription>
            Customize your browser experience. Changes are saved to cookies.
          </SheetDescription>
        </SheetHeader>
        <div className="grid gap-6 py-6">
          <div className="grid grid-cols-3 items-center gap-4">
            <Label htmlFor="lineColor">
              Wave Color
            </Label>
            <Input
              id="lineColor"
              type="color"
              value={lineColor}
              onChange={(e) => setLineColor(e.target.value)}
              className="col-span-2 p-1 h-10"
            />
          </div>
          <div className="grid grid-cols-3 items-center gap-4">
            <Label>Language</Label>
            <Button variant="outline" disabled className="col-span-2">English (US)</Button>
          </div>
        </div>
        <SheetFooter>
          <Button onClick={handleSave} className="w-full">
            <Check className="mr-2 h-4 w-4" /> Save Changes
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
