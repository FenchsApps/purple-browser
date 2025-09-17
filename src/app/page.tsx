"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link'
import { Github, X } from 'lucide-react';
import { WavesBackground } from '@/components/waves-background';
import { SearchForm } from '@/components/search-form';
import { SettingsDialog, Settings } from '@/components/settings-dialog';
import { getCookie, setCookie } from '@/lib/cookies';
import { Button } from '@/components/ui/button';
import { fonts, fontLinks } from '@/lib/fonts';
import { useToast } from "@/hooks/use-toast"
import { useLanguage } from '@/hooks/use-language';
import { getColorName } from '@/lib/color-names';

const DEFAULT_SETTINGS: Settings = {
  lineColor: '#9400D3',
  backgroundType: 'dynamic',
  backgroundColor: '#000000',
  font: 'inter',
  cursorReaction: true,
};

export default function Home() {
  const [settings, setSettings] = useState<Settings | null>(null);
  const [year, setYear] = useState(new Date().getFullYear());
  const [isFooterVisible, setIsFooterVisible] = useState(true);
  const [browserName, setBrowserName] = useState('Purple Browser');
  const { toast } = useToast();
  const { t } = useLanguage();

  useEffect(() => {
    const savedSettings: Settings = {
      lineColor: getCookie('lineColor') || DEFAULT_SETTINGS.lineColor,
      backgroundType: (getCookie('backgroundType') as 'dynamic' | 'solid') || DEFAULT_SETTINGS.backgroundType,
      backgroundColor: getCookie('backgroundColor') || DEFAULT_SETTINGS.backgroundColor,
      font: getCookie('font') || DEFAULT_SETTINGS.font,
      cursorReaction: getCookie('cursorReaction') === 'false' ? false : true,
    };
    setSettings(savedSettings);
    setYear(new Date().getFullYear());
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined' || !settings) return;

    const font = fonts.find(f => f.value === settings.font) || fonts[0];
    document.body.style.fontFamily = font.family;
    document.body.style.setProperty('--font-family-headline', 'Konfuciuz'); // Always use Konfuciuz for headline

    const fontLink = fontLinks[settings.font as keyof typeof fontLinks];
    let linkElement = document.querySelector<HTMLLinkElement>('link[data-font-link]');
    if (!linkElement) {
        linkElement = document.createElement('link');
        linkElement.rel = 'stylesheet';
        linkElement.setAttribute('data-font-link', 'true');
        document.head.appendChild(linkElement);
    }
    if (linkElement.href !== fontLink) {
        linkElement.href = fontLink;
    }
    
    // Add Konfuciuz font link
    let konfuciuzLink = document.querySelector<HTMLLinkElement>('link[href="https://fonts.cdnfonts.com/css/konfuciuz"]');
    if (!konfuciuzLink) {
        konfuciuzLink = document.createElement('link');
        konfuciuzLink.rel = 'stylesheet';
        konfuciuzLink.href = 'https://fonts.cdnfonts.com/css/konfuciuz';
        document.head.appendChild(konfuciuzLink);
    }


    if (settings.backgroundType === 'solid') {
      document.body.style.backgroundColor = settings.backgroundColor;
      setBrowserName(`${getColorName(settings.backgroundColor)} Browser`);
    } else {
      document.body.style.backgroundColor = ''; // Revert to CSS variable
      setBrowserName(`${getColorName(settings.lineColor)} Browser`);
    }

  }, [settings]);

  const handleSaveSettings = (newSettings: Settings) => {
    setSettings(newSettings);
    setCookie('lineColor', newSettings.lineColor);
    setCookie('backgroundType', newSettings.backgroundType);
    setCookie('backgroundColor', newSettings.backgroundColor);
    setCookie('font', newSettings.font);
    setCookie('cursorReaction', String(newSettings.cursorReaction));
    toast({
      title: t('settingsSavedTitle'),
      description: t('settingsSavedDesc'),
    });
  };
  
  if (!settings) {
    return null; // or a loading spinner
  }

  return (
    <div className="relative flex min-h-screen w-full flex-col items-center text-foreground">
      {settings.backgroundType === 'dynamic' && <WavesBackground lineColor={settings.lineColor} isVisible={true} cursorReaction={settings.cursorReaction} />}
      <header className="absolute top-0 z-20 flex w-full items-center justify-between p-4 md:p-6">
        <div className="flex items-center gap-4 text-sm font-medium">
          <Link href="https://fenchsapps.github.io" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-primary transition-colors">
            <Github className="h-5 w-5" />
            <span className="hidden md:inline">FenchsApps</span>
          </Link>
          <span className="text-foreground/60">|</span>
          <Link href="https://www.gnu.org/licenses/gpl-3.0.html" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">{t('license')}</Link>
        </div>
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-xl font-semibold font-headline hidden md:block" style={{ fontFamily: 'var(--font-family-headline)' }}>
          {browserName}
        </div>
        <div>
          <SettingsDialog 
            currentSettings={settings}
            onSave={handleSaveSettings}
          />
        </div>
      </header>
      
      <main className="z-10 flex flex-1 flex-col items-center justify-center space-y-4 px-4 text-center">
        <h1 className="text-4xl font-bold text-primary sm:text-5xl md:hidden" style={{ fontFamily: 'var(--font-family-headline)' }}>{browserName}</h1>
        <div className="w-full max-w-2xl">
          <p className="mb-4 text-lg text-foreground/90">
            {t('searchPrompt')}
          </p>
          <SearchForm />
        </div>
      </main>

      {isFooterVisible && (
        <footer className="absolute bottom-0 z-20 w-[calc(100%-2rem)] max-w-4xl mb-4 p-3 border bg-card/50 backdrop-blur-sm rounded-xl shadow-lg flex items-center justify-between text-sm text-foreground/80">
          <span>{year} {browserName}.</span>
          <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => setIsFooterVisible(false)}>
            <X className="h-4 w-4" />
            <span className="sr-only">{t('hide')}</span>
          </Button>
        </footer>
      )}
    </div>
  );
}
