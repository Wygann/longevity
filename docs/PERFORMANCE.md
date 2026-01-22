# Performance Guide

This document outlines performance best practices and optimizations for the Longevity project.

## Performance Principles

1. **Mobile-First**: Optimize for mobile devices first
2. **Fast Initial Load**: Minimize bundle size and load time
3. **Smooth Interactions**: Maintain 60fps for animations
4. **Efficient Rendering**: Minimize unnecessary re-renders
5. **Lazy Loading**: Load code and assets only when needed

## Bundle Optimization

### Code Splitting

Use dynamic imports for route-based code splitting:

```jsx
import { lazy, Suspense } from 'react'

const LazyComponent = lazy(() => import('./LazyComponent'))

function App() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LazyComponent />
    </Suspense>
  )
}
```

### Tree Shaking

- Use named imports instead of default imports when possible
- Avoid importing entire libraries when you only need specific functions

```jsx
// ✅ Good: Tree-shakeable
import { debounce } from 'lodash-es'

// ❌ Bad: Imports entire library
import _ from 'lodash'
```

## React Performance

### Memoization

Use `React.memo()` for expensive components:

```jsx
const ExpensiveComponent = React.memo(function ExpensiveComponent({ data }) {
  // Expensive rendering logic
})
```

### useMemo and useCallback

Use for expensive computations and stable function references:

```jsx
const expensiveValue = useMemo(() => {
  return computeExpensiveValue(data)
}, [data])

const handleClick = useCallback(() => {
  doSomething(id)
}, [id])
```

### Avoid Unnecessary Re-renders

- Keep state as local as possible
- Use context sparingly (split contexts by concern)
- Avoid creating objects/arrays in render

## Image Optimization

### Use Modern Formats

- Prefer WebP format for better compression
- Provide fallbacks for older browsers

```jsx
<picture>
  <source srcSet="image.webp" type="image/webp" />
  <img src="image.jpg" alt="Description" />
</picture>
```

### Lazy Loading

```jsx
<img src="image.jpg" alt="Description" loading="lazy" />
```

### Responsive Images

```jsx
<img
  srcSet="image-320w.jpg 320w, image-640w.jpg 640w"
  sizes="(max-width: 640px) 320px, 640px"
  src="image-640w.jpg"
  alt="Description"
/>
```

## CSS Performance

### Tailwind CSS Optimization

- Use Tailwind's purge/content configuration (already configured)
- Avoid arbitrary values when possible
- Use utility classes instead of custom CSS

### Critical CSS

- Inline critical CSS for above-the-fold content
- Defer non-critical CSS

## Network Optimization

### API Calls

- Batch API requests when possible
- Use request debouncing/throttling
- Implement proper caching strategies
- Use React Query or SWR for server state management

### Asset Loading

- Preload critical resources
- Prefetch likely next resources
- Use CDN for static assets in production

## Monitoring Performance

### Core Web Vitals

Monitor these metrics:
- **LCP (Largest Contentful Paint)**: < 2.5s
- **FID (First Input Delay)**: < 100ms
- **CLS (Cumulative Layout Shift)**: < 0.1

### Performance Tools

- Chrome DevTools Performance tab
- Lighthouse
- React DevTools Profiler
- WebPageTest

## Mobile Performance

### Touch Interactions

- Use `touch-action` CSS property for better touch handling
- Implement proper touch event handlers
- Avoid 300ms click delay

### Viewport Optimization

```html
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
```

### Reduce Motion

Respect user preferences:

```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

## Best Practices Checklist

- [ ] Code splitting implemented for routes
- [ ] Images optimized and lazy loaded
- [ ] Bundle size monitored and optimized
- [ ] Unnecessary re-renders prevented
- [ ] API calls optimized (batching, caching)
- [ ] Critical CSS inlined
- [ ] Performance metrics monitored
- [ ] Mobile performance tested
- [ ] Accessibility maintained while optimizing

## Resources

- [Web.dev Performance](https://web.dev/performance/)
- [React Performance](https://react.dev/learn/render-and-commit)
- [Vite Performance](https://vitejs.dev/guide/performance.html)
