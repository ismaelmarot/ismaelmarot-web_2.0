# Quickstart: GitHub Projects Showcase

## Prerequisites

- Node.js >= 20.0.0
- npm >= 10.8.0
- GitHub personal access token (optional, for higher API rate limits)

## Setup

```bash
npm install
```

## Fetch Project Data

```bash
# Without token (60 requests/hour limit)
npm run fetch:github

# With token (5000 requests/hour limit)
GITHUB_TOKEN=your_token npm run fetch:github
```

This generates `src/data/projects.json` with the latest project data from GitHub.

## Development

```bash
npm run dev
```

Open http://localhost:5173 and navigate to the Projects section.

## Validation Checklist

### Visual Verification

- [ ] Project cards display in a responsive grid (1/2/3 columns)
- [ ] Each card shows: icon, name, description, buttons
- [ ] "Go Live" / "Go Live App" button appears only when demo URL exists
- [ ] "Github Repo" button always appears
- [ ] Hover effects show subtle elevation change
- [ ] Design follows Apple aesthetics (clean, spacious, rounded)

### Functional Verification

- [ ] Clicking "Go Live" / "Go Live App" opens demo URL in new tab
- [ ] Clicking "Github Repo" opens repo URL in new tab
- [ ] Cards are keyboard-navigable (Tab + Enter)
- [ ] Long descriptions are clamped to 3 lines
- [ ] Missing descriptions show fallback text
- [ ] Missing icons show placeholder

### Responsive Verification

- [ ] Mobile (< 768px): single column layout
- [ ] Tablet (768–1024px): two column layout
- [ ] Desktop (> 1024px): three column layout

### Error Handling Verification

- [ ] If data fetch fails, error state is shown with retry option
- [ ] If no projects exist, empty state message is displayed
- [ ] If icon image fails to load, fallback placeholder appears

## Build & Deploy

```bash
npm run build
npm run preview
```

## Run Tests

```bash
npm run test              # Unit tests
npm run test:component    # Component tests
npm run test:e2e          # E2E tests (requires build)
npm run test:a11y         # Accessibility audit (requires build)
```
