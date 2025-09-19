import type {Metadata} from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster"
import { LanguageProvider } from '@/context/language-context';

export const metadata: Metadata = {
  title: 'Purple Navigator',
  description: 'A simple, elegant browser.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
       <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* Font link will be updated by the page component */}
      </head>
      <body className="font-body antialiased" suppressHydrationWarning>
        <script
          dangerouslySetInnerHTML={{
            __html: `
            (function(){
              try {
                var get = function(n){
                  var m = document.cookie.match(new RegExp('(?:^|; )' + n.replace(/([.$?*|{}()\[\]\\\/\+^])/g, '\\$1') + '=([^;]*)'));
                  return m ? decodeURIComponent(m[1]) : undefined;
                };
                var bgType = get('backgroundType');
                var bgColor = get('backgroundColor');
                if (bgType === 'solid' && bgColor) {
                  var test = document.createElement('div');
                  test.style.backgroundColor = '';
                  try { test.style.backgroundColor = bgColor; } catch(e) {}
                  var ok = !!test.style.backgroundColor;
                  if (ok) {
                    document.documentElement.style.backgroundColor = bgColor;
                    if (document.body) document.body.style.backgroundColor = bgColor;
                  }
                } else if (bgType === 'dynamic') {
                  // Dynamic mode: clear any solid background, let CSS handle it
                  document.documentElement.style.backgroundColor = '';
                  if (document.body) document.body.style.backgroundColor = '';
                }
              } catch(e){}
            })();
          `}}
        />
        <LanguageProvider>
          {children}
        </LanguageProvider>
        <Toaster />
      </body>
    </html>
  );
}
