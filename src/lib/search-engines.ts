export type SearchEngine = {
  name: string;
  value: string;
  url: string;
};

export const searchEngines: SearchEngine[] = [
  {
    name: 'Google',
    value: 'google',
    url: 'https://www.google.com/search?q=',
  },
  {
    name: 'DuckDuckGo',
    value: 'duckduckgo',
    url: 'https://duckduckgo.com/?q=',
  },
  {
    name: 'Yandex',
    value: 'yandex',
    url: 'https://yandex.com/search/?text=',
  },
  {
    name: 'Bing',
    value: 'bing',
    url: 'https://www.bing.com/search?q=',
  },
];
