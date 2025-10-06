# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**PicBatch (轻图)** is a browser-based image processing tool that enables users to batch convert, resize, compress, and rename images without downloading any software. All processing happens locally in the browser for privacy.

**Target Users**: Non-technical users (real estate agents, small businesses, etc.) who occasionally need to batch process images but don't want complex software.

**Core Value Proposition**: Free, simple, no-download, privacy-first image processing.

## Technology Stack

### Frontend
- **Framework**: React or Vue.js
- **Image Processing**: WASM-based libraries
  - libvips or Squoosh for image manipulation
  - JSZip for batch download packaging
- **Deployment**: Serverless platforms (Vercel or Cloudflare)

### Future Extensions
- WeChat Mini Program (Taro or Uniapp)
- Mobile-responsive design required

## Architecture Principles

### Privacy-First Design
**CRITICAL**: All image processing MUST happen in the browser. Never upload images to a server. This is a core product differentiator and user trust requirement.

### Performance Targets
- Initial page load: ≤3MB
- Single image processing: ≤2 seconds
- Batch capacity: Support 50 medium-resolution images
- Browser support: Chrome, Edge, WeChat built-in browser

## Core Features (Priority Order)

### MVP 1.0 (Current Phase)
1. Format conversion (JPG/PNG/WebP/HEIC)
2. Quality compression (by file size or quality percentage)

### Version 1.1
3. Batch cropping/resizing (1:1, 16:9, custom ratios)
4. Batch renaming (prefix + sequential numbering)

### Version 1.2
5. WeChat Mini Program launch

### Version 2.0
6. Intelligent cropping
7. API service offering

## Development Workflow

Since this is a new project, establish these commands in package.json:

```bash
npm install          # Install dependencies
npm run dev          # Start development server
npm run build        # Production build
npm run preview      # Preview production build
npm test             # Run tests
```

## Key Implementation Notes

### Image Processing
- Use Web Workers for heavy processing to keep UI responsive
- Implement progress indicators for batch operations
- Handle HEIC format (may require additional polyfills)

### File Handling
- Support drag-and-drop upload
- Support multiple file selection
- Validate file types before processing
- Show clear error messages for unsupported formats

### Output
- Package processed images as ZIP using JSZip
- Preserve original filenames (with modifications if renaming enabled)
- Provide one-click download

## Non-Functional Requirements

### Performance
- Target user journey completion: ≤2 minutes
- Optimize for mobile devices (responsive design required)

### Browser Compatibility
- Primary: Chrome, Edge
- Required: WeChat built-in browser support
- Consider Safari/iOS compatibility for broader reach

## Project Structure (To Be Created)

```
/src
  /components     # UI components
  /workers        # Web Workers for image processing
  /utils          # Helper functions
  /lib            # WASM bindings
/public           # Static assets
/docs             # Documentation (MVP PRD already exists)
```

## Monetization Strategy

Ad integration planned for v1.1+ (after core functionality is stable).
