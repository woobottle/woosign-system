# Component Expansion Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add all 26 approved cross-platform components with meaningful behavior.

**Architecture:** Individual platform modules reuse shared state/date utilities and
existing tokens/overlays. Preserve tree-shaking and existing exports.

**Tech Stack:** React, React Native, TypeScript, Jest, Storybook.

1. Create src/components/_shared/state.ts and calendar.ts (reuse existing theme/Input styles); test numeric/date helpers.
2. Create Avatar, AvatarGroup, Skeleton, Spinner, Alert, EmptyState, Label, FormField,
   ListItem, AspectRatio and ScrollArea directories with types, web/native modules,
   facade, index, stories and tests. Test fallback, links, callbacks and theme colors.
3. Add Accordion, Collapsible, Breadcrumb, Pagination, Toggle, ToggleGroup and
   SegmentedControl with state transitions, disabled behavior and keyboard handling.
4. Add Slider and InputOTP with clamping, stepping, accessibility and completion tests.
5. Add Calendar and migrate Input/Calendar.web.tsx to the public calendar adapter.
   Test strict dates, month navigation, bounds, disabled dates, theme and callbacks.
6. Add Popover, Tooltip, DropdownMenu, Combobox and DatePicker. Test escape/outside
   close, focus restoration, navigation, filtering, cancellation and selection.
7. Update README.md, llms.txt and llms-full.txt component inventory and examples.
8. Run pnpm typecheck; pnpm lint; pnpm test --runInBand; pnpm build;
   pnpm build-storybook; pnpm storybook:native:generate; git diff --check.
