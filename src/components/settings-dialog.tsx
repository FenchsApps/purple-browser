"use client";

import { useState } from 'react';
import { Settings, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetFooter, SheetDescription } from '@/components/ui/sheet';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Separator } from '@/components/ui/separator';
import { fonts } from '@/lib/fonts';

const languages = [
  { name: 'English (US)', value: 'en-US' },
  { name: 'Русский', value: 'ru' },
  { name: 'Deutsch', value: 'de' },
  { name: 'Français', value: 'fr' },
];

export type Settings = {
  lineColor: string;
  backgroundType: 'dynamic' | 'solid';
  backgroundColor: string;
  font: string;
};

type SettingsProps = {
  currentSettings: Settings;
  onSave: (newSettings: Settings) => void;
};

export function SettingsDialog({ currentSettings, onSave }: SettingsProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [settings, setSettings] = useState(currentSettings);

  const handleSave = () => {
    onSave(settings);
    setIsOpen(false);
  };

  const handleSettingChange = <K extends keyof Settings>(key: K, value: Settings[K]) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };
  
  // Update local state when currentSettings prop changes
  // This is important if the settings can be changed from outside this component
  // and we want the dialog to reflect those changes when it's re-opened.
  useState(() => {
    setSettings(currentSettings);
  });


  return (
    <Sheet open={isOpen} onOpenChange={(open) => {
        setIsOpen(open);
        if (open) {
            setSettings(currentSettings);
        }
    }}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon">
          <Settings className="h-5 w-5" />
          <span className="sr-only">Open Settings</span>
        </Button>
      </SheetTrigger>
      <SheetContent className="w-[320px] sm:w-[400px]">
        <SheetHeader>
          <SheetTitle>Settings</SheetTitle>
          <SheetDescription>
            Customize your browser experience. Changes are saved to cookies.
          </SheetDescription>
        </SheetHeader>
        <div className="grid gap-6 py-6">
          <div className="space-y-4">
            <Label>Language</Label>
            <Select defaultValue="en-US" disabled>
              <SelectTrigger>
                <SelectValue placeholder="Select a language" />
              </SelectTrigger>
              <SelectContent>
                {languages.map(lang => (
                  <SelectItem key={lang.value} value={lang.value}>
                    {lang.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              Language switching is not yet implemented.
            </p>
          </div>
          
          <Separator />

          <div className="space-y-4">
            <Label>Background Type</Label>
            <RadioGroup
              value={settings.backgroundType}
              onValueChange={(value: 'dynamic' | 'solid') => handleSettingChange('backgroundType', value)}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="dynamic" id="bg-dynamic" />
                <Label htmlFor="bg-dynamic">Dynamic</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="solid" id="bg-solid" />
                <Label htmlFor="bg-solid">Solid Color</Label>
              </div>
            </RadioGroup>
          </div>
          
          {settings.backgroundType === 'dynamic' && (
            <div className="grid grid-cols-3 items-center gap-4">
              <Label htmlFor="lineColor">Wave Color</Label>
              <Input
                id="lineColor"
                type="color"
                value={settings.lineColor}
                onChange={(e) => handleSettingChange('lineColor', e.target.value)}
                className="col-span-2 p-1 h-10"
              />
            </div>
          )}

          {settings.backgroundType === 'solid' && (
            <div className="grid grid-cols-3 items-center gap-4">
              <Label htmlFor="backgroundColor">Background Color</Label>
              <Input
                id="backgroundColor"
                type="color"
                value={settings.backgroundColor}
                onChange={(e) => handleSettingChange('backgroundColor', e.target.value)}
                className="col-span-2 p-1 h-10"
              />
            </div>
          )}
          
          <Separator />
          
          <div className="space-y-4">
            <Label>Font</Label>
            <Select
              value={settings.font}
              onValueChange={(value) => handleSettingChange('font', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a font" />
              </SelectTrigger>
              <SelectContent>
                {fonts.map(font => (
                  <SelectItem key={font.value} value={font.value}>
                    {font.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
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
