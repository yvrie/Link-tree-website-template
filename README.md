<div align="center">

# Link tree

> A modern personal links page with smooth animations and interactive effects

![Status](https://img.shields.io/badge/status-archived-orange)
![License](https://img.shields.io/badge/license-MIT-blue)

**[Live Demo](https://yvrie.github.io/Link-tree-website-template/)**

---

</div>

> **Note**: This project is archived and no longer actively maintained.

## Features

- **Modern Dark Design** - Glassmorphic cards with gradient backgrounds
- **Interactive Particles** - 80+ particles that react to mouse movement with trail effects
- **Smooth Animations** - Hover effects, parallax, click ripples, and transitions
- **Fully Responsive** - Works on all devices
- **Zero Dependencies** - Pure HTML/CSS/JS, no build process needed
- **GitHub Auto-Fetch** - Automatically pulls profile picture from GitHub

## Included Links

- Spotify
- AniList
- Discord
- Steam
- GitHub
- Last.fm

## Quick Start

1. Clone or download this repository
2. Update your links in `script.js` (update the `config.links` object)
3. Customize your profile info in `index.html`
4. Open `index.html` in a browser or deploy to your host

## Customization

### Update Links & Profile

Edit the `config` object in `script.js`:

```javascript
const config = {
    githubUsername: 'YourUsername',
    profileName: '@YourName',
    profileBio: "Your bio here",
    links: {
        spotify: 'your-spotify-url',
        // ...
    }
};
```

### Change Colors

Modify CSS variables in `styles.css`:

```css
:root {
    --bg-gradient: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
}
```
<div align="center">

</div>
