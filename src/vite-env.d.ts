/// <reference types="vite/client" />
/// <reference types="@testing-library/jest-dom" />
/// <reference types="vitest/globals" />

interface ImportMetaEnv {
  readonly VITE_GITHUB_USERNAME: string;
  readonly VITE_SITE_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

// Module declarations for assets
declare module '*.svg' {
  import type React from 'react';
  export const ReactComponent: React.FC<React.SVGProps<SVGSVGElement>>;
  const src: string;
  export default src;
}

declare module '*.png' {
  const src: string;
  export default src;
}

declare module '*.jpg' {
  const src: string;
  export default src;
}

declare module '*.webp' {
  const src: string;
  export default src;
}

declare module '*.avif' {
  const src: string;
  export default src;
}

// CSS files (design tokens)
declare module '*.css' {
  const tokens: {
    colors: Record<string, string>;
    space: Record<string, string>;
    fonts: Record<string, string>;
    fontSizes: Record<string, string>;
    fontWeights: Record<string, string>;
    radii: Record<string, string>;
    shadows: Record<string, string>;
    zIndices: Record<string, number>;
    containers: Record<string, string>;
    transitions: Record<string, string>;
    durations: Record<string, string>;
    easings: Record<string, string>;
  };
  export const tokens: typeof tokens;
  const classes: Record<string, string>;
  export default classes;
}