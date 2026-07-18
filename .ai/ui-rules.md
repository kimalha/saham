# AI UI/UX Coding Rules

This document outlines the rules for implementing and maintaining UI/UX components in the SPK Saham LQ45 mobile application, ensuring premium aesthetics and optimal user experiences.

---

## 1. Visual Aesthetics & Design System

Every screen must look premium, modern, and cohesive. Avoid generic styles and browser-default visual behaviors.

* **Primary Background:** HSL `(224, 40%, 7%)` or Hex `#0B0F19` (rich dark blue-gray).
* **Secondary Background:** HSL `(218, 37%, 14%)` or Hex `#161F30` (used for cards, panels, and input containers).
* **Accent Primary:** HSL `(217, 91%, 60%)` or Hex `#3B82F6` (vibrant blue for main buttons and indicators).
* **Benefit Indicator Color:** HSL `(160, 84%, 39%)` or Hex `#10B981` (emerald green for benefit kriteria).
* **Cost Indicator Color:** HSL `(0, 84%, 60%)` or Hex `#EF4444` (crimson red for cost kriteria).
* **Text Selection:** Ensure high contrast between text background and foreground. Do not place dark text on dark backgrounds.

---

## 2. Layout, Grid, & Responsiveness

* **Flexible Dimensions:** Avoid hardcoding fixed pixel widths for layout panels. Use flexbox (`flex: 1`, `flexDirection: 'column'`) and percentage widths to handle varied smartphone screen resolutions.
* **Padding & Margins Consistency:** Enforce an 8dp grid spacing system. Content paddings should be multiples of 8 (e.g., `padding: 16`, `marginVertical: 8`, `gap: 12`).
* **Safe Areas:** Wrap all root screens with `SafeAreaView` from `react-native-safe-area-context` to avoid layout overlapping with status bars, physical notches, or home indicators.

---

## 3. Interactive Components & Animations

* **Micro-interactions:** Add touch visual feedback to all interactive elements:
  * For buttons, use `Pressable` with dynamic styling on the pressed state (e.g., scale-down effect `transform: [{ scale: 0.98 }]` or opacity transition).
  * Render hover effects or state changes smoothly with `LayoutAnimation` or `Reanimated` library hooks.
* **Sliders (Weight Input):** Sliders must display real-time numeric value updates. Highlight the values in green when the total matches exactly 100%, and in crimson when invalid.
* **Loading Skeletons:** Use skeleton loaders instead of simple blank screens or raw activity indicators to represent database/network query states.

---

## 4. Accessibility Constraints

* **Touch Targets:** Make all clickable elements (buttons, checkboxes, navigation links) at least `48dp x 48dp` in size to accommodate various finger profiles.
* **Color Independence:** Do not convey critical information using color indicators alone. For instance, when a weight total is incorrect, display both a red background AND an warning text alert label.
* **Text Sizing:** Respect system-wide font scales. Use standard text styles that dynamically resize when the user changes operating system display settings.
