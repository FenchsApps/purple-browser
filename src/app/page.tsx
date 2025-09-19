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
// import { getColorName } from '@/lib/color-names'; // Removed dynamic naming

type UserShortcut = {
  url: string;
};

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
  const [browserName] = useState('Purple Browser');
  const [shortcuts, setShortcuts] = useState<UserShortcut[]>([]);
  const [isAddingShortcut, setIsAddingShortcut] = useState(false);
  const [shortcutInput, setShortcutInput] = useState('');
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

    // Load shortcuts from cookie
    const rawShortcuts = getCookie('shortcuts');
    if (rawShortcuts) {
      try {
        const parsed = JSON.parse(decodeURIComponent(rawShortcuts));
        if (Array.isArray(parsed)) {
          const valid = parsed.filter((s: any) => s && typeof s.url === 'string');
          setShortcuts(valid);
        }
      } catch {
        // ignore invalid cookie
      }
    }
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined' || !settings) return;

    const font = fonts.find(f => f.value === settings.font) || fonts[0];
    document.body.style.fontFamily = font.family;
    // Use the same body font for headlines (remove special headline font)
    document.body.style.setProperty('--font-family-headline', font.family);

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


    if (settings.backgroundType === 'solid') {
      document.body.style.backgroundColor = settings.backgroundColor;
    } else {
      // Dynamic mode: use CSS background
      document.body.style.backgroundColor = '';
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

  const normalizeUrl = (input: string): string | null => {
    try {
      const trimmed = input.trim();
      if (!trimmed) return null;
      const withProtocol = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
      const url = new URL(withProtocol);
      if (url.protocol !== 'http:' && url.protocol !== 'https:') return null;
      return url.toString();
    } catch {
      return null;
    }
  };

  const saveShortcutsCookie = (items: UserShortcut[]) => {
    try {
      const json = JSON.stringify(items.slice(0, 20));
      setCookie('shortcuts', json);
    } catch {
      // ignore
    }
  };

  const handleAddShortcut = () => {
    const normalized = normalizeUrl(shortcutInput);
    if (!normalized) {
      toast({ title: t('invalidUrlTitle'), description: t('invalidUrlDesc') });
      return;
    }
    const next = [...shortcuts.filter(s => s.url !== normalized), { url: normalized }];
    setShortcuts(next);
    saveShortcutsCookie(next);
    setShortcutInput('');
    setIsAddingShortcut(false);
    toast({ title: t('shortcutAddedTitle'), description: t('shortcutAddedDesc') });
  };

  const handleRemoveShortcut = (url: string) => {
    const next = shortcuts.filter(s => s.url !== url);
    setShortcuts(next);
    saveShortcutsCookie(next);
  };

  const getFaviconCandidates = (targetUrl: string): string[] => {
    try {
      const u = new URL(targetUrl);
      const origin = u.origin;
      const host = u.hostname;
      const primary = `${origin}/favicon.ico`;
      const fallbackGoogle = `https://www.google.com/s2/favicons?sz=64&domain=${encodeURIComponent(host)}`;
      return [primary, fallbackGoogle];
    } catch {
      return [];
    }
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
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 hidden md:block font-headline font-semibold text-2xl md:text-3xl lg:text-4xl" style={{ fontFamily: 'var(--font-family-headline)' }}>
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
        <h1 className="text-5xl font-bold text-primary sm:text-6xl md:hidden font-headline" style={{ fontFamily: 'var(--font-family-headline)' }}>{browserName}</h1>
        <div className="w-full max-w-2xl">
          <p className="mb-4 text-lg text-foreground/90">
            {t('searchPrompt')}
          </p>
          <SearchForm />
          <div className="mt-4 flex flex-col items-center gap-3">
            {!isAddingShortcut && (
              <Button variant="secondary" onClick={() => setIsAddingShortcut(true)}>{t('addShortcut')}</Button>
            )}
            {isAddingShortcut && (
              <div className="w-full flex flex-col items-center gap-2 sm:flex-row sm:gap-3">
                <input
                  type="text"
                  inputMode="url"
                  className="w-full rounded-md border bg-background px-3 py-2 outline-none focus:ring-2 focus:ring-primary"
                  placeholder={t('enterSiteUrl')}
                  value={shortcutInput}
                  onChange={(e) => setShortcutInput(e.target.value)}
                />
                <div className="flex gap-2">
                  <Button onClick={handleAddShortcut}>{t('ok')}</Button>
                  <Button variant="ghost" onClick={() => { setIsAddingShortcut(false); setShortcutInput(''); }}>{t('cancel')}</Button>
                </div>
              </div>
            )}
            {shortcuts.length > 0 && (
              <div className="mt-2 flex flex-wrap justify-center gap-2">
                {shortcuts.map(s => {
                  let label = s.url;
                  let favicons: string[] = [];
                  try {
                    const u = new URL(s.url);
                    label = u.hostname.replace(/^www\./, '');
                    favicons = getFaviconCandidates(s.url);
                  } catch {}
                  return (
                    <div key={s.url} className="flex items-center">
                      <Link href={s.url} target="_blank" rel="noopener noreferrer" className="px-3 py-2 rounded-md border bg-card/60 hover:bg-card transition-colors flex items-center gap-2">
                        {favicons.length > 0 && (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={favicons[0]}
                            alt=""
                            width={18}
                            height={18}
                            loading="lazy"
                            referrerPolicy="no-referrer"
                            onError={(e) => {
                              const el = e.currentTarget as HTMLImageElement;
                              if (favicons[1] && el.src !== favicons[1]) {
                                el.src = favicons[1];
                              } else {
                                el.style.display = 'none';
                              }
                            }}
                            style={{ borderRadius: 4 }}
                          />
                        )}
                        <span>{label}</span>
                      </Link>
                      <button aria-label="remove" className="ml-1 text-foreground/50 hover:text-destructive transition-colors" onClick={() => handleRemoveShortcut(s.url)}>
                        ×
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
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
