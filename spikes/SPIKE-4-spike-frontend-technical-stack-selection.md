# SPIKE: Frontend Technical Stack Selection

> This document is mirrored from the [wiki page](https://github.com/KissPeter/auction-map/wiki/SPIKE-4-spike-frontend-technical-stack-selection).
> Discussion happens on this PR. The wiki is the source of truth.



FE Agent: SPIKE proposal ready at wiki page SPIKE-FE-tech-stack

```markdown
# SPIKE-4: Frontend Technical Stack Selection

## Problem Statement
We need to finalize the frontend technology stack beyond React + TypeScript + Leaflet. The team needs alignment on libraries for state management, routing, styling, HTTP client, and other core concerns before implementation begins. We must ensure all choices are open-source (MIT/Apache-2.0/BSD), integrate well with Leaflet maps, support TypeScript strict mode, and align with backend API design.

## Options Considered

### Styling: Tailwind CSS vs CSS Modules vs plain CSS
**Option 1: Tailwind CSS**
- **License:** MIT
- **Pros:** 
  - High development speed via utility-first classes.
  - Excellent TypeScript support (integrated with `@types/react`).
  - Small bundle size when purged (tree-shaking).
  - Consistent design system enforcement.
- **Cons:** 
  - Requires learning curve for utility classes.
  - Build step required (PostCSS/PurgeCSS).

**Option 2: CSS Modules**
- **License:** Standard (MIT)
- **Pros:** 
  - Scoped styles prevent global conflicts.
  - Familiar to traditional CSS developers.
- **Cons:** 
  - Larger bundle size if not carefully managed.
  - Less atomic design enforcement.

**Option 3: Plain CSS**
- **License:** Standard (MIT)
- **Pros:** 
  - No build step overhead.
- **Cons:** 
  - Global scope issues lead to naming conflicts.
  - Harder to maintain at scale.

### HTTP Client: Axios vs native fetch
**Option 1: Axios**
- **License:** MIT
- **Pros:** 
  - Robust error handling (interceptors for auth/token refresh).
  - Automatic JSON transformation.
  - Mature ecosystem with TypeScript definitions.
- **Cons:** 
  - Slightly larger bundle than native fetch (negligible with tree-shaking).

**Option 2: Native Fetch API**
- **License:** Standard (MIT)
- **Pros:** 
  - No external dependency.
  - Modern browser support.
- **Cons:** 
  - Requires manual error wrapping (`try/catch`).
  - Less flexible for interceptors without extra libraries.

### State Management: Zustand vs Redux Toolkit vs Context API
**Option 1: Zustand**
- **License:** MIT
- **Pros:** 
  - Minimal boilerplate, highly TypeScript-friendly.
  - Lightweight and performant.
  - Easy to integrate with Leaflet map state (e.g., center/zoom).
- **Cons:** 
  - Smaller ecosystem than Redux.

**Option 2: Redux Toolkit**
- **License:** MIT
- **Pros:** 
  - Industry standard, extensive documentation.
  - Strict type safety via `createSlice`.
- **Cons:** 
  - Verbose boilerplate for simple state needs.

**Option 3: React Context API**
- **License:** Standard (MIT)
- **Pros:** 
  - No external dependencies.
- **Cons:** 
  - Performance issues with frequent updates (re-renders).

### Routing: React Router vs Wouter
**Option 1: React Router DOM v6+**
- **License:** MIT
- **Pros:** 
  - Industry standard, robust ecosystem.
  - Excellent TypeScript support.
- **Cons:** 
  - Slightly larger bundle than lightweight alternatives.

**Option 2: Wouter**
- **License:** MIT
- **Pros:** 
  - Very lightweight.
- **Cons:** 
  - Smaller community, less feature parity with React Router.

## Recommendation

### Styling: Tailwind CSS
We recommend **Tailwind CSS**. It offers the best balance of development speed and maintainability for a modern React application. Its utility-first approach reduces CSS specificity issues common in plain CSS or Modules, and it integrates seamlessly with Leaflet via custom utility classes (e.g., `leaflet-container`, `absolute`).

### HTTP Client: Axios
We recommend **Axios** for direct HTTP requests due to its robust interceptor system, which is crucial for handling authentication tokens and global error states. For complex data fetching with caching, we will use **TanStack Query** (React Query) alongside Axios, as it handles server state efficiently without bloating the core client.

### State Management: Zustand
We recommend **Zustand**. It provides a superior TypeScript experience compared to Redux Toolkit for this project's scale, minimizing boilerplate while maintaining strict type safety. It is lightweight enough not to impact Leaflet map performance.

### Routing: React Router DOM v6+
We recommend **React Router DOM v6+** as the standard solution for client-side routing, ensuring compatibility with existing ecosystem tools and libraries.

## Decision
Awaiting human approval (label: spike-approved)

---

## Example Code Patterns

### State Management (Zustand + Leaflet Integration)
```typescript
// store/mapStore.ts
import { create } from 'zustand';
import type { MapInstance } from 'leaflet';

interface MapState {
  center: [number, number];
  zoom: number;
  mapRef: React.RefObject<MapInstance | null>;
  setCenter: (center: [number, number]) => void;
  setZoom: (zoom: number) => void;
}

export const useMapStore = create<MapState>((set) => ({
  center: [0, 0],
  zoom: 2,
  mapRef: null,
  setCenter: (center) => set({ center }),
  setZoom: (zoom) => set({ zoom }),
}));
```

### HTTP Client (Axios + Error Handling)
```typescript
// lib/api.ts
import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  timeout: 5000,
});

// Interceptor for auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle token refresh or redirect to login
    }
    return Promise.reject(error);
  }
);

export default api;
```

### Styling (Tailwind + Leaflet)
```html
<!-- Map Container -->
<div id="map" class="relative h-full w-full z-0">
  <!-- Overlay Content -->
  <div class="absolute top-4 left-4 z-[1000] bg-white p-2 rounded shadow">
    <h3>Map Info</h3>
  </div>
</div>

<!-- Leaflet CSS/JS loaded separately -->
<link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
<script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
```

## Migration Notes (licit.info Reference)
If migrating from existing `licit.info` projects:
1.  **CSS:** Replace legacy global CSS files with Tailwind utility classes in HTML/JSX. Keep critical Leaflet styles in a dedicated `leaflet.css` file to avoid purge issues.
2.  **HTTP:** Refactor `fetch` calls to use the new `api.ts` instance created above. Ensure all API contracts match backend JSON structures.
3.  **State:** Replace global Redux stores with Zustand slices where applicable. For complex forms, consider using React Context only for UI state (e.g., modal open/close).
```