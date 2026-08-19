# ADR-001: React replaces the planned Angular presentation layer

## Status

Accepted — 2026-08-20

## Decision

SkyVault's presentation layer is implemented with React 18, Vite, and TypeScript strict. The existing ASP.NET Core Web API and its HTTP contracts remain unchanged and are read-only to frontend work.

## Consequences

The frontend uses React Router, TanStack Query, Zustand, Axios, Tailwind, shadcn/ui primitives, and the other tools fixed in the frontend master prompt. Controller endpoint wrappers and DTO mirrors are introduced only in their corresponding feature phases.
