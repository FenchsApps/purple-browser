# Purple Browser

Purple Browser is a neon-styled, customizable browser shell built with Next.js and Tailwind CSS.

## Features

- **Simple Search**: Quickly search the web with your favorite search engine.
- **URL Navigation**: Enter a URL to navigate directly to any website.
- **Customizable Background**: Choose between dynamic waves and a solid color.
- **Dynamic Background by Default**: Out of the box, the app starts with animated waves over the default theme. You can switch to a solid color in Settings.
- **Settings Panel**: Top-right settings button to customize background, color, language, and more.
- **Shortcuts under Search**: Create quick shortcuts to your favorite sites. Click “Add Shortcut”, enter a URL, and it will be stored in cookies.
- **Responsive UI**: Optimized for all screen sizes.

## Security

We take security seriously and harden the app with the following measures:

- **Strict HTTP Security Headers** (set via Next.js headers):
  - Content-Security-Policy restricting sources to `self`, with explicit allowances for Google Fonts.
  - Strict-Transport-Security (HSTS), X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy.
- **Safe Cookies**: Client cookies are encoded and use `SameSite=Strict`; the `Secure` flag is automatically applied over HTTPS.
- **URL Validation for Shortcuts**: Only `http`/`https` URLs are accepted. Data/JS schemes are rejected client-side.
- **Safer External Links**: External links use `rel="noopener noreferrer"` to prevent tab-nabbing.

Dev note: In development, CSP relaxes to allow Next.js HMR (`ws://localhost`) and `unsafe-eval` needed by the dev toolchain. Production remains strict.

Note: HttpOnly cookies are not applicable for client-managed preferences.

## Styling

- **Typography**: The headline now uses the same body font for consistency and performance. No special headline font is loaded by default.
- **Neon Aesthetic**: Purple accents on a dark base, with smooth animations.

## Configuration

- Default settings are in `src/app/page.tsx` under `DEFAULT_SETTINGS`.
- Security headers are configured in `next.config.ts` using `headers()`.

## Development

1. Install dependencies:
```bash
npm install
```
2. Run the dev server:
```bash
npm run dev
```
3. Build for production:
```bash
npm run build && npm run start
```

## License

GPL-3.0
