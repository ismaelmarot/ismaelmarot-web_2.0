# Contract: ProjectCard Component

## Props Interface

```typescript
interface ProjectCardProps {
  project: Project;
  isFeatured?: boolean;
  index?: number;
  isSkeleton?: boolean;
}
```

## Behavior Contract

### Rendering States

| State | Condition | Output |
|-------|-----------|--------|
| Skeleton | `isSkeleton === true` | Shimmer placeholder card |
| Normal | Default | Full project card with icon, name, description, buttons |

### Button Visibility

| Button | Condition | Label |
|--------|-----------|-------|
| Go Live / Go Live App | `project.demoUrl` is set | "Go Live" (web) or "Go Live App" (mobile) |
| Github Repo | Always visible | "Github Repo" |

### Accessibility

- Card wrapper MUST have `role="article"` and `aria-label`
- Buttons MUST be keyboard-navigable
- Icon images MUST have `alt` text or `aria-hidden="true"`
- Card MUST respect `prefers-reduced-motion`

### Responsive Behavior

| Viewport | Columns | Card Size |
|----------|---------|-----------|
| < 768px | 1 | Full width |
| 768px – 1024px | 2 | Half width |
| > 1024px | 3 | Third width (featured: 2 cols) |
