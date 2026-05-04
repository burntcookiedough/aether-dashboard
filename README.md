# Aether Dashboard

![Next.js](https://img.shields.io/badge/Next.js-000000?style=flat-square&logo=nextdotjs&logoColor=white)
![React](https://img.shields.io/badge/React-61DAFB?style=flat-square&logo=react&logoColor=black)
![Three.js](https://img.shields.io/badge/Three.js-000000?style=flat-square&logo=threedotjs&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white)

A high-density Next.js dashboard prototype for operational telemetry, 3D visual context, and analytics-heavy interfaces.

## Stack

- Next.js 16 and React 19
- TypeScript
- Three.js through `@react-three/fiber` and `@react-three/drei`
- Recharts for analytics surfaces
- Lucide React for interface icons

## Run Locally

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Available Scripts

```bash
npm run dev
npm run build
npm run start
npm run lint
```

## Repository Layout

```text
app/         # Next.js app routes
components/  # interface building blocks
context/     # shared client state
hooks/       # reusable hooks
lib/         # utilities
public/      # static assets
```

## Positioning

This repo is a dashboard design and frontend systems prototype. It is meant to show how dense operational data can stay readable while still feeling modern and interactive.
