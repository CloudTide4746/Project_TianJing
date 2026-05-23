# Home Hero Poster UI Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Turn the home screen into a poster-led landing view with a reserved blank hero artwork area for a future AI-generated poster.

**Architecture:** Keep the existing route and data model, but move the primary storytelling into `HeroBanner` so the first screen reads like a curated exhibition poster. Reorder the home screen so the hero dominates first, while creation controls and recent works become secondary layers.

**Tech Stack:** Expo Router, React Native, TypeScript, existing theme tokens and UI primitives

---

## File Structure

- Modify: `src/components/home/hero-banner.tsx`
  Replace the split image card with a vertical poster composition and blank poster slot.
- Modify: `src/app/(tabs)/index.tsx`
  Reorder homepage sections to support the poster-led hierarchy and soften the CTA.

## Task 1: Rebuild The Poster Hero

**Files:**
- Modify: `src/components/home/hero-banner.tsx`

- [ ] Create a vertically stacked hero with:
  - curator-style label row
  - large serif poster title
  - shortened poetic subtitle
  - blank reserved poster canvas
  - site metadata strip
  - weak secondary CTA for entering creation

## Task 2: Recompose The Home Screen

**Files:**
- Modify: `src/app/(tabs)/index.tsx`

- [ ] Remove the top page header so the hero becomes the first visual block.
- [ ] Move the type selector below the hero as the second reading layer.
- [ ] Keep recent works after the selector and remove the heavy three-step card from the first viewport.

## Task 3: Verify

**Files:**
- Modify: `src/components/home/hero-banner.tsx`
- Modify: `src/app/(tabs)/index.tsx`

- [ ] Run `npm run lint`
- [ ] Run diagnostics on edited files and fix introduced issues if any.
