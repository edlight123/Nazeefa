# Nazeefa Ahmed - Modern Portfolio

A polished, modern portfolio website for multimedia reporter, researcher, and photographer Nazeefa Ahmed.

## Features

- ✨ Modern, clean design with Tailwind CSS
- 📱 Fully responsive (mobile-first design)
- 🎨 Smooth animations and transitions
- ⚡ Fast loading with Vite
- 🖼️ Photography gallery with hover effects
- 📰 Bylines and work samples
- 🎯 Optimized for accessibility

## Tech Stack

- **Vite** - Lightning-fast development server and build tool
- **Tailwind CSS** - Utility-first CSS framework
- **Vanilla JavaScript** - Lightweight interactivity
- **Modern CSS** - Custom properties, Grid, Flexbox

## Getting Started

### Prerequisites

- Node.js 18+ and npm

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

The site will be available at `http://localhost:3000`

## Design Features

- **Split-panel layout** - Content on left, hero image on right (desktop)
- **Smooth scroll** - Elegant navigation experience
- **Hover effects** - Interactive elements with subtle animations
- **Typography** - Inter & Manrope fonts for readability
- **Color palette** - Professional blues with cream background
- **Photo grid** - Masonry-style photography showcase

## Project Structure

```
modern-portfolio/
├── index.html          # Main HTML file
├── src/
│   ├── style.css       # Tailwind + custom styles
│   └── main.js         # JavaScript interactions
├── package.json
├── vite.config.js
├── tailwind.config.js
└── postcss.config.js
```

## Customization

### Colors

Edit `tailwind.config.js` to change the color scheme:

```js
colors: {
  primary: '#002673',
  secondary: '#141516',
  accent: '#0040ff',
  background: '#fefdf8',
}
```

### Fonts

Update the Google Fonts import in `src/style.css` to use different fonts.

## Deployment

Build the site for production:

```bash
npm run build
```

The optimized files will be in the `dist/` folder, ready to deploy to:
- Netlify
- Vercel
- GitHub Pages
- Any static hosting service

## License

© 2025 Nazeefa Ahmed. All rights reserved.
