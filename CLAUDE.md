# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**PicBatch (轻图)** is a browser-based image processing tool that enables users to batch convert, resize, compress, and rename images without downloading any software. All processing happens locally in the browser for privacy.

**Target Users**: Non-technical users (real estate agents, small businesses, etc.) who occasionally need to batch process images but don't want complex software.

**Core Value Proposition**: Free, simple, no-download, privacy-first image processing.

## Technology Stack

### Core Technologies
- **Framework**: Vite 7 + React 19 + TypeScript 5.6+
- **UI Components**: shadcn/ui v3.2+ (Radix UI + Tailwind CSS)
- **Image Processing**: Canvas API + browser-image-compression v2.0+
- **File Handling**: JSZip v3.10+ + file-saver v2.0+
- **Upload UI**: react-dropzone v14.2+
- **State Management**: zustand v4.5+
- **Deployment**: Vercel (serverless, free CDN)

### React 19 Features Used
- Actions + useTransition for async operations
- use API for Promise handling
- Simplified Context API (no `.Provider`)
- Resource preloading API

### Future Extensions
- WeChat Mini Program (Taro or Uniapp)
- PWA support for offline usage
- Internationalization (i18n)

## Development Commands

```bash
npm install                # Install dependencies
npm run dev                # Start Vite dev server (http://localhost:5173)
npm run build              # Build for production (TypeScript + Vite)
npm run preview            # Preview production build
npm run lint               # Run ESLint
npm run lint:fix           # Fix ESLint issues
npm run format             # Format code with Prettier
npm run format:check       # Check code formatting
```

### Handling Port Conflicts for Development Server

If port 5173 (Vite dev server) is already in use, automatically terminate the process using that port before starting:

```bash
# Windows
netstat -ano | findstr :5173
taskkill /PID <PID> /F
npm run dev

# macOS/Linux
lsof -ti:5173 | xargs kill -9
npm run dev
```

**Important**: When starting the development server, always check if port 5173 is occupied. If so, terminate the existing process first, then restart `npm run dev`.

### Testing the Production Build

**Recommended Approach (Vite Built-in):**
```bash
npm run build              # Build for production
npm run preview            # Preview production build with Vite (http://localhost:4173)
```

**Alternative: Using Node-based Static Servers**

If you need a simple static file server on port 8000:

```bash
# Build first
npm run build

# Option 1: Using serve (recommended)
npx serve dist -p 8000

# Option 2: Using http-server
npx http-server dist -p 8000

# Then visit http://localhost:8000 in your browser
```

**Handling Port Conflicts:**

If port 8000 is already in use when starting an HTTP server, automatically terminate the process using that port before restarting:

```bash
# Windows
netstat -ano | findstr :8000
taskkill /PID <PID> /F

# macOS/Linux
lsof -ti:8000 | xargs kill -9

# Then restart the server
npx serve dist -p 8000
```

**Note**: This is a static website project. Always use Vite's preview or Node-based tools for testing, not Python HTTP servers.

## Architecture

### Layered Architecture

```
UI Layer (React Components)
    ↓
State Layer (Zustand)
    ↓
Business Logic Layer (lib/)
    ↓
Browser API Layer (Canvas, Web Workers)
```

### Project Structure

```
/src
  /components         # React UI components
    /ui               # shadcn/ui components (button, slider, progress, etc.)
  /lib                # Business logic
    imageUtils.ts     # Format conversion, HEIC handling
    compression.ts    # Image compression (quality/size-based)
    zipUtils.ts       # ZIP packaging for batch download
    fileUtils.ts      # File validation, size formatting
  /store              # Zustand state management
    useStore.ts       # Global app state
  /types              # TypeScript type definitions
  /hooks              # Custom React hooks
  /workers            # Web Workers for image processing
/docs                 # Technical documentation
  technical-design.md # Full implementation spec (READ THIS FIRST)
  mvp-prd.md          # Product requirements
/public               # Static assets
```

## Key Implementation Principles

### Privacy-First Design
**CRITICAL**: All image processing MUST happen in the browser. Never upload images to a server. This is a core product differentiator and user trust requirement.

### Image Processing Pipeline

1. **Format Conversion**: File → createImageBitmap() → Canvas → toBlob(format) → Blob
2. **HEIC Support**: Use heic2any polyfill for HEIC → JPEG conversion
3. **Compression**: browser-image-compression with Web Worker support
4. **Batch Processing**: Queue-based with concurrency control (3-5 concurrent tasks)

### Performance Targets

- Initial page load: ≤3MB
- Single image processing: ≤2 seconds
- Batch capacity: 50 medium-resolution images in ≤2 minutes
- Browser support: Chrome, Edge, WeChat built-in browser, Safari/iOS

### Code Patterns

#### Path Aliases
Use `@/` for src imports:
```typescript
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
```

#### State Management
Use Zustand for global state:
```typescript
import useStore from '@/store/useStore'

const { files, addFiles, outputFormat, setOutputFormat } = useStore()
```

#### Async Operations
Use React 19's useTransition for better UX:
```typescript
const [isPending, startTransition] = useTransition()

const handleProcess = () => {
  startTransition(async () => {
    await processImages()
  })
}
```

## Core Features (Priority Order)

### MVP 1.0 (Current Phase)
1. Format conversion (JPG/PNG/WebP/HEIC)
2. Quality compression (by file size or quality percentage)
3. Drag-and-drop + multi-file upload
4. Batch ZIP download
5. Progress tracking with real-time UI updates

### Version 1.1
- Batch cropping/resizing (1:1, 16:9, custom ratios)
- Batch renaming (prefix + sequential numbering)
- Ad integration

### Version 1.2
- WeChat Mini Program launch

### Version 2.0
- AI-powered smart cropping
- API service offering

## Important Technical Details

### File Size Limits
- Single file: <50MB
- Maximum files: 50 per batch

### Concurrency Control
- Batch processing: 3-5 concurrent tasks (avoid memory overflow)
- Web Workers for non-blocking UI during heavy processing

### Memory Management
- Release ObjectURLs after use: `URL.revokeObjectURL(preview)`
- Clean up canvas after processing: `canvas.width = 0; canvas.height = 0;`

### Browser Compatibility Notes
- HEIC format requires heic2any polyfill (not natively supported)
- WeChat browser requires specific testing (target user group)
- Canvas API has excellent cross-browser support

## Data Models

### ProcessedFile (Main State Type)
```typescript
interface ProcessedFile {
  id: string                      // UUID
  file: File                      // Original file object
  name: string                    // Filename
  size: number                    // File size (bytes)
  type: string                    // MIME type
  preview: string                 // ObjectURL for thumbnail
  status: FileStatus              // pending | processing | success | error
  progress: number                // 0-100
  processedBlob?: Blob            // Result after processing
  error?: string                  // Error message if failed
  originalSize: number            // Original file size
  compressedSize?: number         // Size after compression
  compressionRatio?: number       // Compression percentage
}
```

### ConversionOptions
```typescript
interface ConversionOptions {
  outputFormat: 'jpeg' | 'png' | 'webp'
  quality: number                         // 0-100
  compressionMode: 'quality' | 'size'
  targetSize?: number                     // KB (size mode only)
}
```

## Common Pitfalls

1. **Don't block the main thread**: Always use Web Workers for image processing
2. **Handle HEIC carefully**: Pre-convert HEIC to JPEG before other operations
3. **Validate files**: Check file type and size before processing
4. **Clean up memory**: Revoke ObjectURLs and reset canvas when done
5. **Test on WeChat browser**: This is a primary target platform

## References

- Full technical design: [docs/technical-design.md](docs/technical-design.md)
- React 19 documentation: https://react.dev/blog/2024/12/05/react-19
- Vite 7 documentation: https://vite.dev
- shadcn/ui: https://ui.shadcn.com
