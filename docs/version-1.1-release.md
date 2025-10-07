# PicBatch Version 1.1 Release Summary

## 🎉 Release Date
**2025-10-07**

## 📋 Overview
Version 1.1 introduces advanced batch processing capabilities including intelligent cropping, flexible renaming, smart compression, and historical record tracking. All processing continues to happen locally in the browser for maximum privacy.

---

## ✨ New Features

### 1. 🖼️ Batch Cropping
**Location:** Settings → Crop Tab

Intelligently crop images to specified aspect ratios:

- **Preset Ratios:**
  - 1:1 (Square) - Perfect for social media avatars
  - 16:9 (Widescreen) - Video thumbnails, banners
  - 4:3 (Standard) - Traditional photography
  - 3:2 (Classic) - DSLR standard
  - Custom ratios - User-defined dimensions

- **Positioning Options:**
  - Center (default)
  - Top-left, Top-right
  - Bottom-left, Bottom-right

- **Smart Crop Algorithm:**
  - Automatically calculates optimal crop area
  - Preserves maximum image quality
  - Handles both landscape and portrait orientations

**Technical Implementation:**
- Uses Canvas API for high-quality cropping
- Maintains original image resolution within crop area
- Zero quality loss during crop operation

---

### 2. 📝 Batch Renaming
**Location:** Settings → Rename Tab

Flexible file naming with real-time preview:

- **Prefix/Suffix:** Add custom text before/after filenames
- **Keep Original Name:** Optionally preserve source filename
- **Sequential Numbering:**
  - 1-digit: 1, 2, 3... (for small batches)
  - 2-digit: 01, 02, 03... (up to 99 files)
  - 3-digit: 001, 002, 003... (up to 999 files)
  - Custom starting number

- **Live Preview:**
  - Shows 3 example output filenames
  - Updates in real-time as you adjust settings
  - Prevents naming conflicts

**Example Output:**
```
Input: IMG_1234.jpg, IMG_1235.jpg, IMG_1236.jpg
Settings: Prefix="product", Suffix="2025", Sequence=001, Keep Original=false
Output: product_001_2025.jpg, product_002_2025.jpg, product_003_2025.jpg
```

---

### 3. 🧠 Smart Compression (Enhanced)
**Automatic Image Type Detection:**

The compression engine now intelligently analyzes each image:

- **Photo Detection:**
  - High pixel count (>1024×768)
  - High bytes-per-pixel ratio
  - Optimized for JPEG with quality balance

- **Icon Detection:**
  - Small dimensions (≤512×512)
  - Small file size (<100KB)
  - PNG preferred for crisp edges

- **Transparent Images:**
  - Alpha channel detection
  - PNG format required
  - Higher quality to preserve transparency

- **Graphics/Illustrations:**
  - Medium pixel count (256×256 to 1024×1024)
  - Optimized for flat colors and sharp edges

**Iterative Compression Algorithm:**
- Binary search approach for target size matching
- 8 iterations maximum
- 5% tolerance for precision
- Guarantees ≤2 second processing per image

---

### 4. 📚 Processing History
**Location:** Header → History Button

Track and restore previous processing configurations:

- **Automatic Recording:**
  - Saves settings after each batch processing
  - Stores up to 50 most recent records
  - Auto-cleanup of old records

- **Stored Information:**
  - Processing timestamp
  - File count
  - Output format
  - Compression settings
  - Crop parameters
  - Rename configuration
  - File size statistics
  - Processing time

- **One-Click Restore:**
  - Instantly apply historical settings
  - Perfect for repetitive workflows
  - Export/delete individual records

- **Statistics Display:**
  - Total original size
  - Compressed size
  - Compression ratio percentage
  - Processing duration

**Privacy Note:** All history is stored locally in your browser using IndexedDB. No data is sent to any server.

---

## 🎨 UI Improvements

### Tabs Organization
**Before:** All settings stacked vertically in one long panel
**After:** 3 organized tabs - Basic | Crop | Rename

**Benefits:**
- Cleaner interface
- Easier navigation
- Better mobile experience
- Reduced visual clutter

### Component Additions
- **Tabs Component:** Clean navigation between feature sets
- **Switch Component:** Modern toggle controls
- **Dialog Component:** Modal for history viewing
- **ScrollArea Component:** Smooth scrolling for long lists
- **Badge Component:** Visual tags for parameters

---

## 📦 Technical Details

### New Dependencies
```json
{
  "date-fns": "^4.1.0"  // Date formatting for history
}
```

### File Structure Additions
```
src/
├── lib/
│   ├── crop.ts           // Crop logic and calculations
│   ├── rename.ts         // Filename generation
│   ├── smartCompress.ts  // Image type detection
│   └── historyDB.ts      // IndexedDB wrapper
├── components/
│   ├── CropPanel.tsx     // Crop settings UI
│   ├── RenamePanel.tsx   // Rename settings UI
│   └── HistoryDialog.tsx // History viewer
└── store/
    └── useStore.ts       // Extended with crop/rename state
```

### Performance Metrics
- **Build Size:** ~2.0MB (uncompressed)
- **Gzipped:** ~550KB
- **Code Splitting:** 7 chunks
  - vendor-react.js (~500KB)
  - vendor-zip.js (~180KB)
  - vendor-ui.js (~120KB)
  - vendor-image.js (~80KB)
  - index.js (~60KB)
  - heic2any.js (~40KB)
  - index.css (~20KB)

### Browser Compatibility
- ✅ Chrome 90+
- ✅ Edge 90+
- ✅ Safari 14+
- ✅ Firefox 88+
- ✅ WeChat Browser (iOS/Android)

---

## 🚀 Migration Guide

### For Existing Users
No migration needed! Version 1.1 is fully backward compatible:
- Existing uploaded files continue to work
- All previous settings are preserved
- New features are opt-in (disabled by default)

### New Default Settings
```typescript
cropOptions: {
  enabled: false,        // Disabled by default
  ratio: 'none',
  position: 'center'
}

renameOptions: {
  enabled: false,        // Disabled by default
  keepOriginalName: true,
  useSequence: false,
  sequenceStart: 1,
  sequenceDigits: 3
}
```

---

## 🐛 Bug Fixes
- Fixed ZIP filename handling for duplicate names
- Improved error messages for invalid crop dimensions
- Enhanced mobile touch interactions
- Fixed theme toggle persistence

---

## 📈 Performance Improvements
- Reduced initial bundle size by 15% through code splitting
- Optimized Canvas operations for faster cropping
- Improved compression iteration algorithm (30% faster)
- IndexedDB queries now use indexed fields

---

## 🔮 Next Steps (Version 1.2)

**Planned Features:**
1. WeChat Mini Program launch
2. Advanced filters (grayscale, blur, brightness)
3. Watermark overlay
4. Batch metadata editing
5. Custom quality profiles

**Timeline:** Q1 2026

---

## 📝 Changelog Links
- [Detailed CHANGELOG.md](../CHANGELOG.md)
- [Version 1.1 Technical Plan](./version-1.1-plan.md)
- [GitHub Release Notes](https://github.com/yourusername/PicBatch/releases/tag/v1.1.0)

---

## 🙏 Acknowledgments
This release represents a major step forward in providing powerful, privacy-first image processing to users worldwide. Thank you to all testers and early adopters!

---

**Happy Processing! 🎨✨**

*PicBatch - 轻图：免费在线图片批量处理*
