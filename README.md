# Corpora

Corpora is a Raycast extension designed for Raycast Pro users who leverage advanced AI models.

Corpora creates project-specific AI steering documents, enabling more accurate AI conversations.

It addresses the limitations of Raycast’s Finder AI Extension by providing a custom, AI-powered project and context management system. By using file operations, the `get-documents` tool for context retrieval, and the `upsert-documents` tool for context creation and updating, Corpora enhances Raycast AI with deeper awareness of your codebases, journals, and other projects.

Corpora intelligently orchestrates interactions between your AI Presets (defining behavior) and project-specific contexts, allowing for a more personalized and effective AI experience.

---

## Corpora

AI is only as good as its context. Corpora gives your AI durable, project‑specific memory without locking anything into a cloud. It’s a Raycast AI Extension that fits into your existing tools (GitHub, Linear) and stores markdown docs locally, so your workflow stays fast, private, and versionable.

## What it does

- add, view, and manage a directories as Corpora
- traverse a Corpus, gather it's context
- uses `@linear` and `@github` for diffs
- select, summarize, and inject documents into AI Chat
- store local JSON at `extension.supportPath/db.json`

## Why this exists

AI tools will either *forget quickly* or *invent workflows*. Both are costly.

Durable yet malleable context, kept local, enables lean workflows that get smarter as you work.

Corpora is like connective tissue!

### Principles

- [Local First]()
- [Linear Method]
- Lean

## Quick start

> **Requirements:**
> 
> - [Raycast Pro]() subscription (ideally, with Advanced AI)
> - Node installation (ideally, with `nvm`)
> - GitHub account
> - Linear account
> - macOS

This extension is under development and has *not* been published to the [Raycast Store]().

So, clone this repository to your local machine and set a pointer for Raycast using the `Import Extension` command:

- clone this repo
- do `bun install`
- do `bun run dev`
- run `Import Extension`

Create your first Corpus with the `New Corpus` command. Pick a `folder` for the root of your context, and give it a `title`. Corpora initializes context and steering documents for you. Check them out with the `View Corpora` command -> `View Corpus` action.

## Typical workflow

We want to let AI consume stable, versionable context instead of ad‑hoc paste buffers.

- work on Linear Issues and make GitHub PRs
- git branch and commit often
- mention @Corpora in AI chat
- or copy context and paste into AI chat

## Project layout (MVP)
-  Items: local directories tracked as entities
-  Persistence: `supportPath/db.json` (atomic writes)
-  Steering docs: `.corpora/` inside your project root
-  Commands: add/view/manage Items; copy context; open in Finder

## Roadmap
-  M1 (current): Non‑AI commands, persistence, Item management
-  M2: Context engine + AI file I/O helpers
-  M3: Evaluations and richer integrations

## Contributing
-  Keep it small and reversible
-  Favor explicit files over hidden state
-  Use clear conventions in branches/commits (e.g., `DEV-###`)
-  PRs welcome—explain the workflow win first, then the code

## Philosophy (short version)
Software shouldn’t compete with your workflow; it should harmonize it. Durable local context turns tools into collaborators. Build the minimum glue to let your existing stack think with you.


