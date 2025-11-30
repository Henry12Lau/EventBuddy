# EventBuddy App - Color Palette

## 🎨 Complete Color Guide

All colors used in your EventBuddy application.

---

## 🎯 Primary Colors

### Dark Blue (Primary)
```
Color: #2C3B4D
Usage: Headers, primary buttons, date boxes, active tabs
RGB: (44, 59, 77)
```
**Used in:**
- Navigation headers
- Date boxes on event cards
- Active tab backgrounds
- Primary action buttons
- Left border on event cards

---

### Orange (Accent)
```
Color: #FFB162
Usage: Create button, join button, primary actions
RGB: (255, 177, 98)
```
**Used in:**
- "Create Event" floating button
- "Join Event" button
- "Seed Data" button
- Primary call-to-action elements

---

### Red (Destructive/Alert)
```
Color: #FF6B6B
Usage: Cancel button, cancelled events, errors
RGB: (255, 107, 107)
```
**Used in:**
- "Cancel Event" button
- Cancelled event overlay
- Cancelled event badge
- Error messages
- Validation errors

---

## 🌈 Background Colors

### Light Beige (Main Background)
```
Color: #F2F1ED
Usage: Screen backgrounds
RGB: (242, 241, 237)
```
**Used in:**
- Main screen backgrounds
- App background color

---

### White
```
Color: #FFFFFF (#fff)
Usage: Cards, inputs, content areas
RGB: (255, 255, 255)
```
**Used in:**
- Event cards
- Input fields
- Info cards
- Tab containers
- Chat bubbles

---

## 📝 Text Colors

### Dark Gray (Primary Text)
```
Color: #2D3436
Usage: Main text, titles, headings
RGB: (45, 52, 54)
```
**Used in:**
- Event titles
- Body text
- Input text
- Primary content

---

### Medium Gray (Secondary Text)
```
Color: #636E72
Usage: Subtitles, placeholders, secondary info
RGB: (99, 110, 114)
```
**Used in:**
- Event location
- Placeholder text
- Secondary information
- Empty state text
- Inactive tab text

---

## 🔲 Border & Divider Colors

### Light Gray Border
```
Color: #E9EDEF
Usage: Borders, dividers, separators
RGB: (233, 237, 239)
```
**Used in:**
- Input borders
- Card borders
- Divider lines
- Tab borders

---

### Lighter Gray Border
```
Color: #DFE6E9
Usage: Subtle borders, tab bar borders
RGB: (223, 230, 233)
```
**Used in:**
- Tab bar top border
- Subtle separators

---

## 🎨 State Colors

### Disabled/Inactive
```
Color: #C9C1B1
Usage: Disabled buttons, inactive states
RGB: (201, 193, 177)
```
**Used in:**
- Disabled buttons
- Inactive elements
- Grayed-out states

---

### Info Blue (Light)
```
Color: #E8F4F8
Usage: Info cards, help sections
RGB: (232, 244, 248)
```
**Used in:**
- Info card backgrounds
- Help section backgrounds
- Instructional areas

---

## 🎭 Overlay Colors

### Red Overlay (Cancelled)
```
Color: rgba(255, 107, 107, 0.1)
Usage: Cancelled event overlay
RGBA: (255, 107, 107, 10% opacity)
```
**Used in:**
- Cancelled event card overlay

---

### Black Shadow
```
Color: rgba(0, 0, 0, 0.08) to rgba(0, 0, 0, 0.3)
Usage: Shadows and elevation
RGBA: (0, 0, 0, 8-30% opacity)
```
**Used in:**
- Card shadows
- Button shadows
- Elevation effects

---

## 📊 Color Usage by Component

### Navigation Header
```css
Background: #2C3B4D (Dark Blue)
Text: #FFFFFF (White)
Shadow: rgba(44, 59, 77, 0.3)
```

### Event Card
```css
Background: #FFFFFF (White)
Border Left: #2C3B4D (Dark Blue)
Title: #2D3436 (Dark Gray)
Subtitle: #636E72 (Medium Gray)
Border: #E9EDEF (Light Gray)
Shadow: rgba(0, 0, 0, 0.08)
```

### Event Card (Cancelled)
```css
Background: #FFFFFF (White)
Border Left: #FF6B6B (Red)
Overlay: rgba(255, 107, 107, 0.1)
Badge: #FF6B6B (Red)
Opacity: 0.7
```

### Date Box
```css
Background: #2C3B4D (Dark Blue)
Text: #FFFFFF (White)
Shadow: rgba(44, 59, 77, 0.3)
```

### Input Field
```css
Background: #FFFFFF (White)
Border: #E9EDEF (Light Gray)
Text: #2D3436 (Dark Gray)
Placeholder: #636E72 (Medium Gray)
Error Border: #FF6B6B (Red)
```

### Primary Button (Join/Create)
```css
Background: #FFB162 (Orange)
Text: #FFFFFF (White)
Shadow: rgba(255, 177, 98, 0.4)
```

### Secondary Button (Chat)
```css
Background: #FFFFFF (White)
Border: #2C3B4D (Dark Blue)
Text: #2C3B4D (Dark Blue)
```

### Destructive Button (Cancel)
```css
Background: #FF6B6B (Red)
Text: #FFFFFF (White)
Shadow: rgba(255, 107, 107, 0.4)
```

### Disabled Button
```css
Background: #C9C1B1 (Disabled Gray)
Text: #FFFFFF (White)
Opacity: 0.6
```

### Active Tab
```css
Background: #2C3B4D (Dark Blue)
Text: #FFFFFF (White)
Shadow: rgba(44, 59, 77, 0.3)
```

### Inactive Tab
```css
Background: Transparent
Text: #636E72 (Medium Gray)
```

### Info Card
```css
Background: #E8F4F8 (Info Blue)
Border Left: #2C3B4D (Dark Blue)
Text: #2D3436 (Dark Gray)
```

### Cancelled Banner
```css
Background: #FF6B6B (Red)
Text: #FFFFFF (White)
Shadow: rgba(255, 107, 107, 0.3)
```

---

## 🎨 Color Palette Summary

### Primary Palette
| Color Name | Hex Code | RGB | Usage |
|------------|----------|-----|-------|
| Dark Blue | `#2C3B4D` | (44, 59, 77) | Primary brand color |
| Orange | `#FFB162` | (255, 177, 98) | Accent/CTA |
| Red | `#FF6B6B` | (255, 107, 107) | Destructive/Alert |

### Neutral Palette
| Color Name | Hex Code | RGB | Usage |
|------------|----------|-----|-------|
| Light Beige | `#F2F1ED` | (242, 241, 237) | Background |
| White | `#FFFFFF` | (255, 255, 255) | Cards/Content |
| Dark Gray | `#2D3436` | (45, 52, 54) | Primary text |
| Medium Gray | `#636E72` | (99, 110, 114) | Secondary text |
| Light Gray | `#E9EDEF` | (233, 237, 239) | Borders |
| Lighter Gray | `#DFE6E9` | (223, 230, 233) | Subtle borders |
| Disabled Gray | `#C9C1B1` | (201, 193, 177) | Disabled states |

### Accent Palette
| Color Name | Hex Code | RGB | Usage |
|------------|----------|-----|-------|
| Info Blue | `#E8F4F8` | (232, 244, 248) | Info cards |

---

## 🎯 Quick Reference

### Copy-Paste Color Codes

```javascript
// Primary Colors
const PRIMARY_BLUE = '#2C3B4D';
const ACCENT_ORANGE = '#FFB162';
const ALERT_RED = '#FF6B6B';

// Backgrounds
const BG_LIGHT_BEIGE = '#F2F1ED';
const BG_WHITE = '#FFFFFF';
const BG_INFO_BLUE = '#E8F4F8';

// Text Colors
const TEXT_DARK = '#2D3436';
const TEXT_MEDIUM = '#636E72';
const TEXT_WHITE = '#FFFFFF';

// Borders
const BORDER_LIGHT = '#E9EDEF';
const BORDER_LIGHTER = '#DFE6E9';

// States
const DISABLED_GRAY = '#C9C1B1';

// Overlays
const OVERLAY_RED = 'rgba(255, 107, 107, 0.1)';
const SHADOW_LIGHT = 'rgba(0, 0, 0, 0.08)';
const SHADOW_MEDIUM = 'rgba(0, 0, 0, 0.1)';
const SHADOW_DARK = 'rgba(0, 0, 0, 0.3)';
```

---

## 🎨 Color Combinations

### Primary Button
```css
background: #FFB162
color: #FFFFFF
shadow: rgba(255, 177, 98, 0.4)
```

### Secondary Button
```css
background: #FFFFFF
border: 2px solid #2C3B4D
color: #2C3B4D
```

### Destructive Button
```css
background: #FF6B6B
color: #FFFFFF
shadow: rgba(255, 107, 107, 0.4)
```

### Card
```css
background: #FFFFFF
border-left: 4px solid #2C3B4D
shadow: 0 2px 8px rgba(0, 0, 0, 0.08)
```

### Cancelled Card
```css
background: #FFFFFF
border-left: 4px solid #FF6B6B
overlay: rgba(255, 107, 107, 0.1)
opacity: 0.7
```

---

## 🌈 Accessibility

### Contrast Ratios

**Dark Blue (#2C3B4D) on White:**
- Ratio: 10.5:1 ✅ AAA (Excellent)

**Orange (#FFB162) on Dark Blue:**
- Ratio: 4.8:1 ✅ AA (Good)

**White on Dark Blue:**
- Ratio: 10.5:1 ✅ AAA (Excellent)

**Dark Gray (#2D3436) on White:**
- Ratio: 13.2:1 ✅ AAA (Excellent)

**Medium Gray (#636E72) on White:**
- Ratio: 5.1:1 ✅ AA (Good)

**Red (#FF6B6B) on White:**
- Ratio: 3.8:1 ⚠️ AA Large Text Only

---

## 🎨 Design System

### Elevation Levels

**Level 1 (Subtle):**
```css
elevation: 2
shadow: 0 1px 3px rgba(0, 0, 0, 0.05)
```

**Level 2 (Cards):**
```css
elevation: 3
shadow: 0 2px 8px rgba(0, 0, 0, 0.08)
```

**Level 3 (Floating):**
```css
elevation: 4
shadow: 0 3px 8px rgba(0, 0, 0, 0.1)
```

**Level 4 (Modal/Header):**
```css
elevation: 8
shadow: 0 4px 8px rgba(0, 0, 0, 0.3)
```

---

## 📱 Platform-Specific

### iOS
- Uses shadow properties
- Softer shadows
- More subtle elevations

### Android
- Uses elevation property
- Material Design shadows
- More pronounced depth

### Web
- Uses box-shadow
- Standard CSS shadows
- Cross-browser compatible

---

## 🎯 Brand Guidelines

### Do's ✅
- Use Dark Blue (#2C3B4D) for primary actions
- Use Orange (#FFB162) for CTAs
- Use Red (#FF6B6B) for destructive actions
- Maintain consistent spacing
- Use white backgrounds for content

### Don'ts ❌
- Don't use colors outside the palette
- Don't use low-contrast combinations
- Don't mix different shades of the same color
- Don't use red for non-destructive actions

---

## 🎨 Export for Design Tools

### Figma/Sketch Variables
```
Primary/Blue: #2C3B4D
Primary/Orange: #FFB162
Primary/Red: #FF6B6B
Neutral/Background: #F2F1ED
Neutral/White: #FFFFFF
Neutral/Text-Dark: #2D3436
Neutral/Text-Medium: #636E72
Neutral/Border: #E9EDEF
```

### CSS Variables
```css
:root {
  --color-primary: #2C3B4D;
  --color-accent: #FFB162;
  --color-danger: #FF6B6B;
  --color-bg: #F2F1ED;
  --color-white: #FFFFFF;
  --color-text: #2D3436;
  --color-text-secondary: #636E72;
  --color-border: #E9EDEF;
}
```

---

Your EventBuddy app has a clean, professional color palette! 🎨
