# Research: GitHub Projects Showcase

## R-001: Project Icon Strategy

**Decision**: Use the repository's Open Graph image (via `https://opengraph.githubassets.com/1/{username}/{repo}`) as the primary icon, with a fallback to a styled placeholder using the repository's primary language icon.

**Rationale**: GitHub automatically generates Open Graph images for repositories when they have a custom social preview image. For repos without one, the OG endpoint returns a default card. This approach requires no additional API calls and works at runtime.

**Alternatives considered**:
- Using GitHub topic icons — too limited, only works for repos with specific topics
- Using a static icon per language — less visually distinctive per project
- Fetching repo metadata at build time — adds complexity, no runtime benefit for a static site

## R-002: Button Label Differentiation

**Decision**: Use "Go Live" for web applications and "Go Live App" for mobile applications. Determine the label by checking if the `demoUrl` contains known mobile app store patterns or if the repo topics include mobile-related keywords (ios, android, react-native, flutter, swift, kotlin).

**Rationale**: The user explicitly requested both labels. Topic-based detection is the simplest heuristic that doesn't require manual configuration per project.

**Alternatives considered**:
- Always use "Go Live" — doesn't meet the user's requirement for both labels
- Manual configuration per project — requires maintaining a mapping, violates YAGNI
- Separate field in fetch config — over-engineered for a personal portfolio

## R-003: Apple-Style Design Tokens

**Decision**: Leverage the existing design token system in `src/styles/tokens.ts` and `src/styles/tokens.css`. Apply Apple-inspired patterns: SF Pro-like font stack (already using system fonts), generous whitespace (space-6 to space-8), subtle shadows (shadow-sm), large border radii (radius-lg to radius-xl), and smooth spring-like transitions.

**Rationale**: The project already has a comprehensive token system. The constitution mandates using existing design tokens. No new styling infrastructure is needed.

**Alternatives considered**:
- Creating new Apple-specific tokens — unnecessary duplication
- Using a UI library — violates constitution's simplicity principle

## R-004: Data Fetching Approach

**Decision**: Continue using the existing build-time fetch script (`src/data/fetch-github.ts`) to generate a static JSON file with project data. The Projects section reads from this static file at runtime.

**Rationale**: The project is a static site deployed to GitHub Pages. Build-time fetching avoids CORS issues, reduces runtime dependencies, and improves performance. The infrastructure already exists.

**Alternatives considered**:
- Runtime fetching from GitHub API — CORS and rate limit concerns
- Client-side rendering with skeleton — already implemented as fallback

## R-005: Responsive Grid Breakpoints

**Decision**: Mobile (<768px): 1 column; Tablet (768px–1024px): 2 columns; Desktop (>1024px): 3 columns. Featured projects span 2 columns on desktop.

**Rationale**: These breakpoints align with the existing CSS media queries in the project and follow standard responsive design practices. The 3-column desktop grid matches Apple's App Store layout patterns.

**Alternatives considered**:
- 4-column desktop grid — too dense for cards with descriptions
- Masonry layout — adds complexity, inconsistent with Apple's clean grid aesthetic
