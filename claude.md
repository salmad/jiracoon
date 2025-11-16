# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Jiracoon is a product demo framework that creates deterministic, scriptable, pixel-perfect demos by driving a real React UI via timeline-based DOM manipulation (not video generation). The goal is to enable users to input a prompt and see an HTML page manipulated with JavaScript that presents a meaningful product demo.

## Development Commands

### Start development server
```bash
npm run dev
```
Starts Vite dev server at http://localhost:5173 with hot module replacement.

### Build for production
```bash
npm run build
```
Creates optimized production build in `dist/` directory.

### Preview production build
```bash
npm run preview
```
Locally preview the production build.

### Lint code
```bash
npm run lint
```
Run ESLint on all `.js` and `.jsx` files.

## Technology Stack

- **React 18.3**: UI library
- **Vite 5.4**: Build tool and dev server
- **Tailwind CSS 3.4**: Utility-first styling
- **shadcn/ui**: Pre-built accessible UI components
- **D3.js 7.9**: Data visualization and timeline animations
- **Lucide React**: Icon library

## Architecture

### Core Concept

The application operates on a timeline-driven animation model where:
1. User enters a prompt describing the desired demo
2. The system interprets the prompt and generates a timeline of actions
3. Actions manipulate the DOM in sequence to create the demo effect
4. All animations are deterministic and reproducible

### Key Components

**App.jsx** (`src/App.jsx`)
- Main application entry point
- Manages prompt input and demo playback state
- Controls the overall demo lifecycle

**ChartDemo.jsx** (`src/components/ChartDemo.jsx`)
- Demonstration component using D3 for animated visualizations
- Shows the timeline-based animation concept
- Currently implements: GDP line chart with animated drawing from left to right
- Uses D3 transitions to control animation timing and easing

### Timeline Actions (Planned)

The system should support these action types:
- `click`: Trigger clicks on buttons/elements
- `type`: Fill out forms with typed text
- `scroll`: Scroll through page content
- `zoom`: Zoom in/out on elements
- `move`: Reposition elements

### File Structure

```
src/
├── App.jsx                      # Main app component
├── main.jsx                     # React entry point
├── index.css                    # Global styles + Tailwind
├── components/
│   ├── ChartDemo.jsx           # D3 chart demo component
│   └── ui/                     # shadcn UI components
│       ├── button.jsx
│       ├── input.jsx
│       └── card.jsx
└── lib/
    └── utils.js                # Utility functions (cn for class merging)
```

## Development Guidelines

### Path Aliases

The project uses `@/` as an alias for `src/`:
```javascript
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
```

### Adding shadcn Components

When adding new shadcn components:
1. Create component file in `src/components/ui/`
2. Follow the shadcn component patterns (forwardRef, className merging with `cn`)
3. Import and use in your components

### Working with D3 Animations

- Use `useRef` to access SVG DOM elements
- Leverage D3 transitions for smooth animations
- Use `d3.easeLinear` for timeline-based animations
- Chain transitions with `.transition().delay()` for sequential effects
- Report progress using transition tweens

### Styling Conventions

- Use Tailwind utility classes for styling
- Leverage CSS variables defined in `index.css` for theming
- Use `cn()` utility to merge conditional classes
- Follow dark mode support pattern with `dark:` prefix

## Important Notes from claude.md

### Workflow for Changes

1. **Make minimal, well-scoped changes** - prefer adding a small function/file
2. **Keep commits atomic and descriptive** - one feature/bug fix per commit
3. **Documentation in docs/ folder**:
   - `docs/temp/` for temporary documentation after implementing a feature
   - `docs/` for longer-term architecture and structure documentation
4. **Avoid changing unrelated files** or upgrading dependencies unless required

### MVP Goals

- Build prompt input interface ✓
- Generate line chart demos based on prompts ✓
- Implement timeline-based animation system (in progress)

### Non-Goals (for MVP)

- Full GUI scenario editor
- Video transcoding pipelines
- Heavyweight visual designs

## Next Steps for Development

When extending this project:

1. **Timeline Engine**: Create a formal timeline system that can parse prompts and generate action sequences
2. **Action Handlers**: Implement handlers for each action type (click, type, scroll, zoom, move)
3. **Prompt Parser**: Build logic to interpret natural language prompts into timeline actions
4. **More Demos**: Add support for different chart types and UI demos beyond line charts
5. **Playback Controls**: Add play/pause/restart controls for demo playback
