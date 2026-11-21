---
name: Swachha Parisara
description: Warm, tactile sunlit consumer mobile design system for Dakshina Kannada plastic waste reporting and recycling.
colors:
  primary: "#0d7a57"
  primary-dark: "#096144"
  primary-deep: "#064733"
  primary-light: "#e5f6ef"
  primary-lighter: "#f2fbf7"
  cream: "#f4f7f5"
  surface: "#ffffff"
  sunken: "#edf2ef"
  ink: "#101916"
  muted: "#52635c"
  muted-light: "#75867f"
  border: "#e2e9e5"
  border-light: "#eef3f0"
  yellow: "#f59e0b"
  yellow-dark: "#b45309"
  yellow-light: "#fef5e0"
  orange-red: "#e05232"
  orange-red-dark: "#b43518"
  orange-red-light: "#fff0ec"
  severity-mid: "#f97316"
  mint-accent: "#a7f3d0"
typography:
  hero-metric:
    fontFamily: "Bricolage Grotesque, Noto Sans Kannada, ui-sans-serif, system-ui, sans-serif"
    fontSize: "52px"
    fontWeight: 800
    lineHeight: 1
  hero-metric-sm:
    fontFamily: "Bricolage Grotesque, Noto Sans Kannada, ui-sans-serif, system-ui, sans-serif"
    fontSize: "44px"
    fontWeight: 800
    lineHeight: 1
  display:
    fontFamily: "Bricolage Grotesque, Noto Sans Kannada, ui-sans-serif, system-ui, sans-serif"
    fontSize: "32px"
    fontWeight: 800
    lineHeight: 1.12
    letterSpacing: "-0.025em"
  title:
    fontFamily: "Bricolage Grotesque, Noto Sans Kannada, ui-sans-serif, system-ui, sans-serif"
    fontSize: "22px"
    fontWeight: 700
    lineHeight: 1.24
    letterSpacing: "-0.02em"
  brand:
    fontFamily: "Bricolage Grotesque, Noto Sans Kannada, ui-sans-serif, system-ui, sans-serif"
    fontSize: "17px"
    fontWeight: 800
    lineHeight: 1.2
  heading:
    fontFamily: "Bricolage Grotesque, Noto Sans Kannada, ui-sans-serif, system-ui, sans-serif"
    fontSize: "17px"
    fontWeight: 700
    lineHeight: 1.32
  body:
    fontFamily: "Figtree, Noto Sans Kannada, ui-sans-serif, system-ui, sans-serif"
    fontSize: "15px"
    fontWeight: 400
    lineHeight: 1.55
  body-sm:
    fontFamily: "Figtree, Noto Sans Kannada, ui-sans-serif, system-ui, sans-serif"
    fontSize: "14px"
    fontWeight: 400
    lineHeight: 1.5
  ui-sm:
    fontFamily: "Figtree, Noto Sans Kannada, ui-sans-serif, system-ui, sans-serif"
    fontSize: "13px"
    fontWeight: 500
    lineHeight: 1.45
  caption:
    fontFamily: "Figtree, Noto Sans Kannada, ui-sans-serif, system-ui, sans-serif"
    fontSize: "12px"
    fontWeight: 600
    lineHeight: 1.4
  micro:
    fontFamily: "Figtree, Noto Sans Kannada, ui-sans-serif, system-ui, sans-serif"
    fontSize: "11px"
    fontWeight: 600
    lineHeight: 1.3
  stamp:
    fontFamily: "Figtree, Noto Sans Kannada, ui-sans-serif, system-ui, sans-serif"
    fontSize: "10px"
    fontWeight: 700
    lineHeight: 1.2
rounded:
  sm: "6px"
  xs-focus: "8px"
  md: "10px"
  lg: "12px"
  xl: "16px"
  2xl: "20px"
  3xl: "24px"
  full: "9999px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "16px"
  lg: "24px"
  xl: "32px"
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.surface}"
    rounded: "{rounded.lg}"
    padding: "12px 18px"
  button-secondary:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    rounded: "{rounded.lg}"
    padding: "12px 18px"
  card-default:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    rounded: "{rounded.xl}"
    padding: "20px"
  input-default:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    rounded: "{rounded.lg}"
    padding: "10px 14px"
  chip-selected:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.surface}"
    rounded: "{rounded.lg}"
    padding: "8px 14px"
---

# Design System: Swachha Parisara

## Overview

**North Star:** Sunlit Coastal Consumer Utility (Urban Company × Apple Health × Swiggy sensibility).

Tactile, warm consumer mobile app for Dakshina Kannada residents. Pure white cards float over a cool sunlit mist ground (`#f4f7f5`) via soft layered shadows, anchored by a bold Coastal Emerald hero surface (`#0d7a57`) and sunlit marigold reward accents (`#f59e0b`). Rejects beige wireframe boxes, fake status dots inside pills, developer monospace badges, and square map pins.

## Colors

- **Coastal Emerald:** `#0d7a57` (dark `#096144`, deep `#064733`, mint `#e5f6ef`, wash `#f2fbf7`) — primary CTAs, hero impact card, active nav capsule, cleared map pins.
- **Sunlit Marigold:** `#f59e0b` (ink `#b45309`, wash `#fef5e0`) — points balance chip (with star icon), reward progress, scheduled pickups, low-density pins.
- **Terracotta Coral:** `#e05232` (ink `#b43518`, wash `#fff0ec`) — high-density pins, destructive actions, unread counts, non-recyclable alerts.
- **Neutrals:** Cool Mist `#f4f7f5` ground, Pure White `#ffffff` cards, Soft Sage `#edf2ef` wells, Charcoal Ink `#101916`, Slate Muted `#52635c`.

## Typography

**Display & Brand:** `Bricolage Grotesque` + `Noto Sans Kannada`
**Body & UI:** `Figtree` + `Noto Sans Kannada` with `tabular-nums` on figures, dates, and weights. Zero developer monospace styling in consumer UI.

## Elevation & Shapes

Soft layered shadows (`0 1px 2px rgba(16,25,22,0.04), 0 8px 24px -6px rgba(16,25,22,0.07)`) elevate cards off `#f4f7f5` without boxy `1px` wireframe borders. Circular map pins (`9999px`), `16px–20px` cards, `12px` buttons/chips, `8px–10px` tinted status tags (zero dots).

## Do's and Don'ts

- **Do** anchor key pages (`/home`, `/rewards`) with a bold emerald hero surface and elevate secondary cards with soft ambient shadows.
- **Do** use circular map pins, icon-led rewards chips, and full-card tappable rows for scheduled pickups.
- **Don't** put fake status dots inside pills, boxy borders around every item, monospace technical stamps, or repetitive `Track >` button rows.
