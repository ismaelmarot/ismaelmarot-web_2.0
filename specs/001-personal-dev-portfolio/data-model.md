# Data Model: Personal Developer Portfolio

## Entities

### Project
Represents a software project/repository displayed in the portfolio.

**Attributes**:
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| id | string | Yes | Unique identifier (GitHub repo ID or `owner/name`) |
| name | string | Yes | Repository name |
| description | string | Yes | Short description (fallback: generated from name/topics) |
| longDescription | string | No | Extended markdown description (from README) |
| primaryLanguage | string | No | Primary programming language (from GitHub) |
| technologies | string[] | Yes | Array of technology/topics tags |
| githubUrl | string | Yes | Link to GitHub repository |
| demoUrl | string | No | Live demo URL (from homepage or custom field) |
| screenshotUrls | string[] | No | Array of screenshot image paths (local `public/images/projects/`) |
| stars | number | No | GitHub star count |
| forks | number | No | GitHub fork count |
| lastUpdated | string | Yes | ISO 8601 date of last push/update |
| isFeatured | boolean | No | Whether to highlight in hero/featured section |
| displayOrder | number | No | Manual ordering for display |

**Validation Rules**:
- `name`: Non-empty, max 100 chars
- `description`: Non-empty, max 500 chars (truncate with ellipsis in cards)
- `githubUrl`: Valid GitHub URL pattern (`github.com/owner/repo`)
- `demoUrl`: Valid HTTP(S) URL if provided
- `screenshotUrls`: Valid local paths under `/images/projects/`
- `lastUpdated`: Valid ISO 8601 date string
- `technologies`: Non-empty array, each item non-empty string

**Relationships**:
- Many-to-Many with Technology (via `technologies` array)
- Belongs to one GitHub repository (source of truth)

**State Transitions**:
```
[GitHub Fetch] → [Raw Data] → [Transform/Enrich] → [Validated Project] → [Cached JSON] → [Build-time Props]
```

---

### Technology
Represents a tool, language, framework, or skill displayed in the Technologies section.

**Attributes**:
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| id | string | Yes | Unique identifier (slugified name) |
| name | string | Yes | Display name (e.g., "TypeScript", "React", "PostgreSQL") |
| category | TechnologyCategory | Yes | Grouping category |
| proficiency | ProficiencyLevel | No | Self-assessed level |
| yearsExperience | number | No | Approximate years of experience |
| iconName | string | No | Identifier for icon component (e.g., "typescript", "react") |
| color | string | No | Brand color hex for visual grouping |
| displayOrder | number | No | Ordering within category |

**TechnologyCategory Enum**:
```typescript
type TechnologyCategory = 
  | 'language'       // Programming languages (TypeScript, Python, Rust)
  | 'framework'      // Frontend/Backend frameworks (React, Next.js, Express)
  | 'tool'           // Development tools (Git, Docker, Vite, ESLint)
  | 'database'       // Databases (PostgreSQL, MongoDB, Redis)
  | 'cloud'          // Cloud/DevOps (AWS, Vercel, GitHub Actions)
  | 'testing'        // Testing libraries (Vitest, Playwright, Cypress)
  | 'other';         // Miscellaneous
```

**ProficiencyLevel Enum**:
```typescript
type ProficiencyLevel = 'expert' | 'advanced' | 'intermediate' | 'learning';
```

**Validation Rules**:
- `name`: Non-empty, unique, max 50 chars
- `category`: Must be valid enum value
- `proficiency`: Must be valid enum value if provided
- `yearsExperience`: Non-negative integer if provided
- `iconName`: Matches available icon set if provided
- `color`: Valid hex color if provided

**Relationships**:
- Many-to-Many with Project (projects reference technology names)
- Grouped by `category` for display

---

### ContactMethod
Represents a way for visitors to contact or find Ismael online.

**Attributes**:
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| id | string | Yes | Unique identifier |
| type | ContactType | Yes | Type of contact method |
| label | string | Yes | Display label (e.g., "Email", "GitHub", "LinkedIn") |
| value | string | Yes | URL, email address, or handle |
| iconName | string | Yes | Icon identifier |
| displayOrder | number | No | Ordering in contact section |
| isPrimary | boolean | No | Highlight as primary contact method |

**ContactType Enum**:
```typescript
type ContactType = 
  | 'email'      // mailto: link
  | 'github'     // github.com/username
  | 'linkedin'   // linkedin.com/in/username
  | 'twitter'    // twitter.com/username or x.com/username
  | 'website'    // Personal website URL
  | 'other';     // Custom link
```

**Validation Rules**:
- `type`: Must be valid enum value
- `label`: Non-empty, max 30 chars
- `value`: 
  - `email`: Valid email format (`mailto:` prefix added automatically)
  - `github`/`linkedin`/`twitter`/`website`: Valid HTTP(S) URL
  - `other`: Valid HTTP(S) URL
- `iconName`: Matches available icon set

**Relationships**:
- Independent entity, displayed in Contact section
- No direct relationships with Project or Technology

---

### SiteConfig
Global configuration for the portfolio site (single instance).

**Attributes**:
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| name | string | Yes | Developer full name |
| title | string | Yes | Professional title (e.g., "Web Developer") |
| tagline | string | Yes | Brief value proposition for hero |
| aboutText | string | Yes | About section content (markdown supported) |
| email | string | Yes | Contact email address |
| githubUsername | string | Yes | GitHub username for API fetching |
| socialLinks | ContactMethod[] | Yes | Array of contact methods |
| featuredProjectIds | string[] | No | Project IDs to feature prominently |
| seo | SEOConfig | Yes | SEO metadata |

**SEOConfig**:
```typescript
interface SEOConfig {
  title: string;
  description: string;
  ogImage: string;        // Open Graph image path
  twitterHandle: string;  // Twitter/X handle for cards
  siteUrl: string;        // Canonical URL (e.g., https://ismaelmarot.com)
}
```

**Validation Rules**:
- All required fields non-empty
- `email`: Valid email format
- `githubUsername`: Valid GitHub username pattern
- `siteUrl`: Valid HTTPS URL
- `ogImage`: Valid local image path

---

## Data Flow Summary

```
┌─────────────────┐
│  GitHub API     │  (build-time: REST /repos/:owner/:repo)
│  - repos        │
│  - languages    │
│  - releases     │
└────────┬────────┘
         │ fetch + transform
         ▼
┌─────────────────┐
│  scripts/       │  (Node/TypeScript)
│  fetch-github.ts│
└────────┬────────┘
         │ write typed JSON
         ▼
┌─────────────────┐
│  src/data/      │  (committed to repo)
│  projects.json  │
└────────┬────────┘
         │ import at build
         ▼
┌─────────────────┐
│  Vite Build     │  (static props injection)
│  + TypeScript   │
└────────┬────────┘
         ▼
┌─────────────────┐
│  dist/          │  (static HTML/CSS/JS)
│  index.html     │
└─────────────────┘
```

---

## TypeScript Interfaces (src/types/)

```typescript
// src/types/project.ts
export interface Project {
  id: string;
  name: string;
  description: string;
  longDescription?: string;
  primaryLanguage?: string;
  technologies: string[];
  githubUrl: string;
  demoUrl?: string;
  screenshotUrls: string[];
  stars?: number;
  forks?: number;
  lastUpdated: string; // ISO 8601
  isFeatured?: boolean;
  displayOrder?: number;
}

export interface Technology {
  id: string;
  name: string;
  category: TechnologyCategory;
  proficiency?: ProficiencyLevel;
  yearsExperience?: number;
  iconName?: string;
  color?: string;
  displayOrder?: number;
}

export type TechnologyCategory = 
  | 'language' | 'framework' | 'tool' 
  | 'database' | 'cloud' | 'testing' | 'other';

export type ProficiencyLevel = 'expert' | 'advanced' | 'intermediate' | 'learning';

// src/types/contact.ts
export interface ContactMethod {
  id: string;
  type: ContactType;
  label: string;
  value: string;
  iconName: string;
  displayOrder?: number;
  isPrimary?: boolean;
}

export type ContactType = 
  | 'email' | 'github' | 'linkedin' | 'twitter' | 'website' | 'other';

// src/types/site.ts
export interface SiteConfig {
  name: string;
  title: string;
  tagline: string;
  aboutText: string;
  email: string;
  githubUsername: string;
  socialLinks: ContactMethod[];
  featuredProjectIds?: string[];
  seo: SEOConfig;
}

export interface SEOConfig {
  title: string;
  description: string;
  ogImage: string;
  twitterHandle: string;
  siteUrl: string;
}
```

---

## GitHub API Mapping

| GitHub Field | Project Field | Transform |
|--------------|---------------|-----------|
| `id` | `id` | Stringify |
| `name` | `name` | Direct |
| `description` | `description` | Fallback: "No description provided" |
| `language` | `primaryLanguage` | Direct |
| `topics` | `technologies` | Direct (lowercase, filtered) |
| `html_url` | `githubUrl` | Direct |
| `homepage` | `demoUrl` | Direct (if valid URL) |
| `stargazers_count` | `stars` | Direct |
| `forks_count` | `forks` | Direct |
| `pushed_at` | `lastUpdated` | Direct (ISO 8601) |

**Enrichment** (post-fetch):
- `screenshotUrls`: Matched from `public/images/projects/{repo-name}/`
- `longDescription`: Fetched from README (optional, separate API call)
- `isFeatured`: Manual curation via config
- `displayOrder`: Manual curation via config