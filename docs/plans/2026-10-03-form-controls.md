# Form Controls Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Improve existing quality and provide cross-platform Select and Textarea.

**Architecture:** Textarea wraps Input. Select uses DOM select on web and existing BottomSheet on native. Shared props and theme styles preserve platform parity.

**Tech Stack:** React, React Native, TypeScript, Jest, Storybook.

### Task 1: Quality
Modify src/components/Input/Input.web.tsx and Input.native.tsx for row-based multiline height and top alignment. Add regression tests to Input.web.test.tsx and Input.native.test.tsx. Settle timers in src/components/Switch/Switch.native.test.tsx. Run pnpm exec eslint 'src/**/*.{ts,tsx}' --fix and pnpm test --runInBand.

### Task 2: Textarea
Create src/components/Textarea/{types.ts,Textarea.tsx,Textarea.web.tsx,Textarea.native.tsx,index.ts}. Force multiline, default three rows, preserve forwarded refs and platform pass-through props. Add web/native tests for typing, disabled and refs and stories for sizes/error/disabled. Export from src/components/index.ts.

### Task 3: Select
Create src/components/Select/{types.ts,Select.tsx,Select.web.tsx,Select.native.tsx,index.ts}. Reuse Input style factories. Implement controlled/uncontrolled values, disabled options, labels, form props and native BottomSheet scrollable options. Add web/native behavior tests and stories. Export from src/components/index.ts.

### Task 4: Documentation and verification
Update README.md for controls and existing Drawer/prompt. Run pnpm typecheck, pnpm lint, pnpm test --runInBand, pnpm build and pnpm build-storybook. Review final diff.
