"use client";

import { useState, FormEvent } from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { searchEngines } from '@/lib/search-engines';

export function SearchForm() {
  const [query, setQuery] = useState('');
  const [engine, setEngine] = useState(searchEngines[0].value);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    let urlToOpen = query;
    const isUrl = query.match(/^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/);
    
    if (isUrl) {
      if (!query.startsWith('http')) {
        urlToOpen = 'https://' + query;
      }
    } else {
      const selectedEngine = searchEngines.find(e => e.value === engine);
      if (selectedEngine) {
        urlToOpen = selectedEngine.url + encodeURIComponent(query);
      }
    }

    window.open(urlToOpen, '_self');
  };

  return (
    <form onSubmit={handleSubmit} className="flex w-full items-center gap-2 rounded-xl border bg-card/50 p-2 shadow-lg backdrop-blur-sm focus-within:ring-2 focus-within:ring-ring">
      <Select value={engine} onValueChange={setEngine}>
        <SelectTrigger className="w-[130px] shrink-0 border-0 bg-transparent focus:ring-0 focus:ring-offset-0">
          <SelectValue placeholder="Engine" />
        </SelectTrigger>
        <SelectContent>
          {searchEngines.map((e) => (
            <SelectItem key={e.value} value={e.value}>{e.name}</SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Input
        type="text"
        placeholder="Search the web or enter a URL..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="flex-grow border-0 bg-transparent text-base focus-visible:ring-0 focus-visible:ring-offset-0"
      />
      <Button type="submit" size="icon" aria-label="Search">
        <Search className="h-5 w-5" />
      </Button>
    </form>
  );
}
