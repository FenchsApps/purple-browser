'use server';

export type Font = {
  name: string;
  value: string;
  family: string;
};

export const fonts: Font[] = [
  { name: 'Inter', value: 'inter', family: 'Inter, sans-serif' },
  { name: 'Roboto', value: 'roboto', family: 'Roboto, sans-serif' },
  { name: 'Lato', value: 'lato', family: 'Lato, sans-serif' },
  { name: 'Montserrat', value: 'montserrat', family: 'Montserrat, sans-serif' },
  { name: 'Oswald', value: 'oswald', family: 'Oswald, sans-serif' },
];

export const fontLinks: { [key: string]: string } = {
  inter: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap',
  roboto: 'https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap',
  lato: 'https://fonts.googleapis.com/css2?family=Lato:wght@400;700&display=swap',
  montserrat: 'https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600;700&display=swap',
  oswald: 'https://fonts.googleapis.com/css2?family=Oswald:wght@400;600;700&display=swap',
}
