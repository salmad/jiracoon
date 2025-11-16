# claude.md — Product-demo-as-executable-UI

> This README is written to live inside the repository and to be machine-readable by AI assistants (e.g. Claude, ChatGPT, other automation). It scopes the project, explains goals, defines the scenario format and playback API, and gives example tasks and prompts an AI can execute to build features and tests.

---

## Project overview

**Name:** Product Demo as Executable UI

**Purpose:** Create deterministic, scriptable, pixel-perfect product demos by driving a real React (or plain DOM) UI via a timeline of actions, DOM is manipualted by JS which creates an animation effect. But it is pixel perfect, no video.

**Key value propositions:**

* Pixel-perfect fidelity to the real product (not a mock video)
* Small, editable source artifacts (code) instead of large videos and llm tokens
* Reproducible demo runs (mocked network / deterministic timing)

## Goals & non-goals

**Primary goals**

* Build an MVP
* user enters one prompt: show me a line chart of GDP of US where line runs from left to right, x-axis is time

**Non-goals (for initial MVP)**

* Full GUI scenario editor (we'll provide examples and an authoring helper).
* Complex video transcoding pipelines (recording can be added later).
* Heavyweight visual designs — focus on engineering and UX fidelity.



## stack:
- react
- vite
- shadcn components for better ui
- tailwind css


## Files & folder structure (suggested)

```
repo-root/
├─ README.md                # short human README
├─ claude.md                # this file (machine-friendly spec + prompts)
├─ package.json
├─ public/
│  └─ index.html
├─ src/                    # follow react best practices for folder structure
│  ├─ App.jsx
│  ├─ index.jsx
│  ├─ pages/

```



Common step types and fields:
* `click` on buttons
* `type` or fill out a form
* `scroll` scroll through a page
* `zoom` in or out
* `move` an element




## How an AI assistant (Claude) should behave with this repo

When you are asked to perform a change, follow this workflow strictly:

1. **Make minimal, well-scoped changes** — prefer adding a small function/file and tests.
2. **Keep commits atomic and descriptive** — one feature/bug fix per commit. Use PR title `feat(player): add type action handler`.
3. **Keep documentation** in docs/ folder, only keep in claude.md where to find stuff if/when it needs to not overload context
   3.1. docs/temp for temporary documentation after implementing a feature
   3.2. docs/ for longer term architecture, folder strcuture, things that will rarely change

Always avoid changing unrelated files or upgrading unrelated dependencies unless the task requires it.
