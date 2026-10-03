# Data Model: GitHub Projects Showcase

## Entity: Project

Represents a GitHub repository displayed as a card in the Projects section.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | `string` | Yes | Unique identifier (GitHub repo ID as string) |
| `name` | `string` | Yes | Repository name |
| `description` | `string` | Yes | Short description (fallback: "No description available") |
| `longDescription` | `string` | No | Extended description |
| `primaryLanguage` | `string` | No | Main programming language |
| `technologies` | `string[]` | Yes | Tech stack tags (from repo topics) |
| `githubUrl` | `string` | Yes | Link to GitHub repository |
| `demoUrl` | `string` | No | Link to deployed application |
| `screenshotUrls` | `string[]` | Yes | Preview images (may be empty) |
| `stars` | `number` | No | GitHub star count |
| `forks` | `number` | No | GitHub fork count |
| `lastUpdated` | `string` | Yes | ISO date string of last push |
| `isFeatured` | `boolean` | No | Whether to display as featured card |
| `displayOrder` | `number` | No | Manual sort order |
| `iconUrl` | `string` | No | Open Graph image URL for the repo |
| `projectType` | `'web' \| 'mobile' \| 'other'` | No | Determines button label |

## Entity: ProjectCard

The visual container for a single project. Not a data entity — a component-level concern.

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `project` | `Project` | Yes | The project data to display |
| `isFeatured` | `boolean` | No | Renders as a larger featured card |
| `index` | `number` | No | Position for staggered animation |
| `isSkeleton` | `boolean` | No | Renders loading placeholder |

## Validation Rules

- `name` MUST be non-empty
- `githubUrl` MUST be a valid URL
- `demoUrl`, if present, MUST be a valid URL
- `description` MUST fall back to "No description available" when empty
- `iconUrl` MUST fall back to a placeholder when the image fails to load

## State Transitions

The Projects section has three render states:

1. **Loading** → Skeleton cards displayed
2. **Error** → Error message with retry button
3. **Success** → Grid of project cards (or empty state if no projects)
