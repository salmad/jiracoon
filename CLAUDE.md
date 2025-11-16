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
│       ├── card.jsx
│       └── badge.jsx
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

**Animation & Transitions:**
- Use `useRef` to access SVG DOM elements
- Leverage D3 transitions for smooth animations
- Use `d3.easeLinear` for timeline-based animations
- Chain transitions with `.transition().delay()` for sequential effects
- Report progress using transition tweens

**Recharts-like Chart Styling:**

The D3 charts should follow shadcn/recharts visual design patterns for consistency:

1. **Grid Lines:**
   - Use subtle, dashed horizontal grid lines
   - Color: `hsl(240, 6%, 90%)` with 50% opacity
   - Pattern: `stroke-dasharray: "3,3"`
   - Only show horizontal lines, not vertical

2. **Axes:**
   - Remove tick marks with `tickSize(0)`
   - Use `tickPadding(12)` for breathing room
   - Font size: `12px`, weight: `400`
   - Color: `hsl(240, 4%, 46%)` (muted text)
   - Domain line: `hsl(240, 6%, 90%)` (subtle border)
   - Font: `inherit` to use system font stack

3. **Chart Lines:**
   - Stroke width: `2.5px` (thinner than default)
   - Use `stroke-linecap: "round"` and `stroke-linejoin: "round"` for smooth corners
   - Color: `hsl(262, 83%, 58%)` (primary)

4. **Data Points:**
   - Radius: `4px` (smaller, more refined)
   - White fill with colored stroke
   - Stroke width: `2.5px`
   - Stroke color: `hsl(262, 83%, 58%)` (primary)

5. **Typography:**
   - Title: 14px, weight 600, color `hsl(240, 10%, 3.9%)`
   - Axis labels: 12px, weight 500, color `hsl(240, 4%, 46%)`
   - All text uses `font-family: inherit`

6. **Annotations:**
   - Use `foreignObject` for text with HTML/CSS to ensure proper wrapping and styling
   - Arrow markers: Define reusable SVG markers
   - Colors: Match primary theme colors

**Chart Dimensions:**
- Account for margins (top: 100, bottom: 120) to accommodate annotations
- Use `.nice()` on scales for cleaner axis values

### Design System

**Premium Design Philosophy**

The UI follows a premium design system inspired by Linear, Intercom, Revolut, and Framer. The key principles are:

1. **Clean Minimalism**: Focused layouts with ample whitespace
2. **Premium Color Palette**: Purple/violet primary (Linear-inspired), vibrant blue accents (Intercom-inspired)
3. **Smooth Animations**: Timeline-driven transitions that feel polished
4. **Excellent Typography**: Proper font sizing, weights, and line heights
5. **Subtle Depth**: Premium shadows and borders, not heavy drop shadows

**Color Variables** (defined in `src/index.css`):

- `--primary: 262 83% 58%` - Purple/violet for primary actions and branding
- `--accent: 213 94% 68%` - Vibrant blue for accents and highlights
- `--muted: 240 5% 96%` - Subtle gray for backgrounds
- `--border: 240 6% 90%` - Soft borders
- Chart colors: `--chart-1` through `--chart-4` for data visualization

**Premium Utility Classes**:

- `.gradient-primary` - Purple to blue gradient
- `.gradient-subtle` - Subtle background gradient
- `.shadow-premium` - Soft, layered shadow
- `.shadow-premium-lg` - Larger premium shadow for cards
- `.glass` / `.glass-dark` - Glassmorphism effects

**Component Styling Guidelines**:

- Cards: Use `shadow-premium-lg` and `border-2` for elevated look
- Buttons: Primary actions use gradient backgrounds
- Inputs: Larger touch targets (h-12) for better UX
- Icons: Use Lucide React icons with consistent sizing (w-4 h-4 for inline, w-6 h-6 for headers)
- Badges: Use for status indicators with semantic colors

### Styling Conventions

- Use Tailwind utility classes for styling
- Leverage CSS variables defined in `index.css` for theming
- Use `cn()` utility to merge conditional classes
- Follow dark mode support pattern with `dark:` prefix
- Apply premium utilities (`.shadow-premium`, `.gradient-primary`) consistently

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
