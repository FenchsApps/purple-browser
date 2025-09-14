"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Github } from 'lucide-react';
import { WavesBackground } from '@/components/waves-background';
import { SearchForm } from '@/components/search-form';
import { SettingsDialog } from '@/components/settings-dialog';
import { getCookie, setCookie } from '@/lib/cookies';

const DEFAULT_LINE_COLOR = '#9400D3';

export default function Home() {
  const [lineColor, setLineColor] = useState(DEFAULT_LINE_COLOR);

  useEffect(() => {
    const savedLineColor = getCookie('lineColor');
    if (savedLineColor) {
      setLineColor(savedLineColor);
    }
  }, []);

  const handleSaveSettings = (newSettings: { lineColor: string }) => {
    setLineColor(newSettings.lineColor);
    setCookie('lineColor', newSettings.lineColor);
  };
  
  return (
    <div className="relative flex min-h-screen w-full flex-col items-center bg-background text-foreground">
      <WavesBackground lineColor={lineColor} />
      <header className="absolute top-0 z-20 flex w-full items-center justify-between p-4 md:p-6">
        <div className="flex items-center gap-4 text-sm font-medium">
          <Link href="https://fenchsapps.github.io" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-primary transition-colors">
            <Github className="h-5 w-5" />
            <span className="hidden md:inline">FenchsApps</span>
          </Link>
          <span className="text-foreground/60">|</span>
          <Link href="https://www.gnu.org/licenses/gpl-3.0.html" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">License</Link>
        </div>
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-xl font-semibold font-headline hidden md:block">
          Purple Browser
        </div>
        <div>
          <SettingsDialog 
            currentSettings={{ lineColor }}
            onSave={handleSaveSettings}
          />
        </div>
      </header>
      
      <main className="z-10 flex flex-1 flex-col items-center justify-center space-y-4 px-4 text-center">
        <h1 className="text-4xl font-bold text-primary font-headline sm:text-5xl md:hidden">Purple Browser</h1>
        <div className="w-full max-w-2xl">
          <p className="mb-4 text-lg text-foreground/90">
            What are you looking for today?
          </p>
          <SearchForm />
        </div>
      </main>
    </div>
  );
}
