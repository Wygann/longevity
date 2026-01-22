# Assets Directory

This directory contains all static assets for the application.

## Structure

```
assets/
  ├── images/     # Image files (jpg, png, svg, webp)
  ├── icons/      # Icon files (svg, png)
  ├── fonts/      # Font files (woff, woff2, ttf)
  └── README.md   # This file
```

## Guidelines

1. **Image Optimization**: Always optimize images before adding them
   - Use WebP format when possible for better compression
   - Compress images to reduce file size
   - Use appropriate image sizes for mobile-first approach

2. **Naming Convention**: Use kebab-case for file names
   - Good: `hero-image.webp`, `user-avatar.png`
   - Bad: `HeroImage.webp`, `user_avatar.png`

3. **Organization**: Group related assets in subdirectories
   - Example: `images/hero/`, `images/products/`

4. **Performance**: 
   - Lazy load images when appropriate
   - Use responsive images with `srcset`
   - Consider using image CDNs for production

5. **Accessibility**: 
   - Always provide alt text for images
   - Use semantic HTML for icons

## Usage in Code

```jsx
// Import images
import heroImage from '@assets/images/hero-image.webp'

// Use in component
<img src={heroImage} alt="Hero image description" />
```
