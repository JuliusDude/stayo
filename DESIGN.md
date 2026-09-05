---
name: "Stayo"
description: "An all-in-one hotel booking and property management platform."
colors:
  primary: "#0A3B2C"
  secondary: "#D4AF37"
  neutral-bg: "#FAFAFA"
  neutral-surface: "#FFFFFF"
  neutral-border: "#E0E0E0"
  neutral-text: "#121212"
  neutral-text-muted: "#6B6B6B"
typography:
  display:
    fontFamily: "Avenir Next, Avenir, sans-serif"
    fontSize: "clamp(2.5rem, 5vw, 4rem)"
    fontWeight: 600
    lineHeight: 1.1
    letterSpacing: "-0.02em"
  headline:
    fontFamily: "Avenir Next, Avenir, sans-serif"
    fontSize: "clamp(1.5rem, 3vw, 2.25rem)"
    fontWeight: 600
    lineHeight: 1.2
    letterSpacing: "-0.01em"
  body:
    fontFamily: "Avenir Next, Avenir, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.6
    letterSpacing: "normal"
  label:
    fontFamily: "Avenir Next, Avenir, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 500
    lineHeight: 1
    letterSpacing: "0.05em"
    textTransform: "uppercase"
rounded:
  none: "0px"
  sm: "2px"
  md: "4px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "16px"
  lg: "32px"
  xl: "64px"
  xxl: "128px"
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.neutral-surface}"
    rounded: "{rounded.sm}"
    padding: "16px 32px"
  button-secondary:
    backgroundColor: "transparent"
    textColor: "{colors.primary}"
    rounded: "{rounded.sm}"
    padding: "16px 32px"
    border: "1px solid {colors.primary}"
---

# Design System: Stayo

## Overview

**Creative North Star: "The Architectural Concierge"**

Stayo balances two contrasting needs: the aspirational, image-rich discovery experience for guests, and the data-dense, highly functional operational tools for hotel staff. To bridge this, the design system adopts an architectural approach. It relies on crisp grids, sharp typography, and structural lines rather than decorative color washes or soft shadows. The interface acts as a quiet, precise frame that elevates high-quality property photography while bringing absolute clarity to complex management tasks like dynamic pricing and inventory management.

**Key Characteristics:**
- **Structural and precise:** Layouts are defined by visible grid lines and structural borders.
- **Photography first:** Colors and UI elements recede to let property imagery carry the emotional weight.
- **Data density without clutter:** For the management side, information is aligned on strong axes, avoiding nested cards or excessive shading.

## Colors

The palette is restrained and professional, avoiding standard SaaS brights in favor of grounded, architectural hues.

### Primary
- **Deep Pine** (#0A3B2C): The anchor color. Used sparingly for primary actions, critical states, and brand moments. Its depth conveys trust and stability.

### Secondary
- **Aged Brass** (#D4AF37): An accent color used exclusively for status indicators (e.g., 'Reserved' state, star ratings).

### Neutral
- **Gallery White** (#FAFAFA): The global background color. Slightly softer than pure white to reduce eye strain during extended management sessions.
- **Surface White** (#FFFFFF): Used for active content areas to create a subtle separation from the background without relying on shadows.
- **Structural Grey** (#E0E0E0): Used for all borders, dividers, and grid lines. Essential for defining structure.
- **Ink Black** (#121212): The primary text color. High contrast for readability.
- **Graphite** (#6B6B6B): Used for secondary text, metadata, and disabled states.

### Named Rules
**The Content Chrome Rule.** UI chrome (navs, borders, backgrounds) must remain neutral. Color is reserved strictly for interactive elements (Deep Pine), status indicators, or actual property photography.

## Typography

**Display Font:** Avenir Next (with Avenir, sans-serif)
**Body Font:** Avenir Next (with Avenir, sans-serif)

**Character:** Avenir Next offers geometric precision with humanist warmth. Its wide proportions and clean lines make it highly legible at small sizes for data tables (management), while feeling expansive and elegant at display sizes (guest booking).

### Hierarchy
- **Display** (600, clamp(2.5rem, 5vw, 4rem), 1.1): Hero headlines on the guest search and property pages.
- **Headline** (600, clamp(1.5rem, 3vw, 2.25rem), 1.2): Section titles, property names, and dashboard widget headers.
- **Title** (600, 1.25rem, 1.3): Subsections, room type titles, and modal headers.
- **Body** (400, 1rem, 1.6): Standard reading text, descriptions, and list items. Max line length 75ch.
- **Label** (500, 0.875rem, 0.05em, uppercase): Meta-information, table headers, and tiny UI labels.

### Named Rules
**The Single Axis Rule.** Do not mix font weights or colors within a single headline to create emphasis. Use size and space to establish hierarchy.

## Layout

The layout is fundamentally grid-based and heavily reliant on alignment.
- **Guest Experience:** Uses a 12-column fluid grid. Property images break the grid to bleed to the edges, while content remains constrained and centered.
- **Hotel Management:** Uses a fluid, full-width layout with a fixed sidebar. Data tables and forms stretch to fill available space, maximizing data visibility.
- **Rhythm:** Spacing follows a strict 8px baseline grid (8, 16, 32, 64, 128).

## Elevation & Depth

Stayo uses a flat-by-default approach. Depth is not conveyed through drop shadows (which can read as a generic template), but rather through structural borders and subtle background tonal shifts (from Gallery White to Surface White).

### Named Rules
**The Grounded Surface Rule.** Panels, modals, and dropdowns do not float with soft shadows. They are grounded with a crisp 1px border (`neutral-border`) and an opaque background.

## Shapes

Forms are sharp and decisive. 
- **Corners:** Nearly square. A microscopic 2px radius (`sm`) is applied to interactive elements (buttons, inputs) simply to remove the harshness of a true point, but large containers and images use a 0px radius.
- **Dividers:** 1px solid lines are used liberally to separate content instead of relying on whitespace alone, reinforcing the architectural feel.

## Components

### Buttons
- **Shape:** 2px radius.
- **Primary:** Deep Pine background, Surface White text. Padding is generous (16px 32px) to feel substantial.
- **Hover / Focus:** Background darkens slightly; no upward translation/lift.
- **Secondary:** Transparent background, Deep Pine border and text.

### Inputs / Fields
- **Style:** 1px solid Structural Grey border, Surface White background, 2px radius.
- **Focus:** Border shifts to Deep Pine. No generic blue focus rings or soft glows.

### Cards (Property Listings)
- **Corner Style:** 0px radius for images, 2px for the container.
- **Background:** Surface White.
- **Shadow Strategy:** No shadows. Defined by a 1px Structural Grey border.
- **Internal Padding:** 16px.

### Badges / Status Indicators
- **Style:** Used for booking lifecycle (Reserved, Confirmed, Checked-in, Cancelled).
- **Format:** Small, uppercase label typography, with a 1px border matching the text color, on a transparent background.

## Do's and Don'ts

### Do:
- **Do** use 1px solid borders (`neutral-border`) to separate dense information in the management dashboards.
- **Do** ensure all text has a high contrast ratio against its background.
- **Do** align form labels above inputs to maintain a strong left axis.

### Don't:
- **Don't** use soft, diffused box-shadows on cards or modals.
- **Don't** use all-caps for body text or long phrases; restrict uppercase strictly to tiny labels.
- **Don't** add decorative colored backgrounds to sections. Rely on whitespace and borders.
