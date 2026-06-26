// src/theme/colors.ts
// Colors migrated from src/constants/colors.ts - using LightColors/DarkColors format

export const LightColors = {
  // Brand
  primary: "#386b01", // M3 Expressive Light Primary (Vibrant Green)
  primaryDark: "#183800", // M3 On Primary Container / Darker accent
  primaryLight: "#54910f", // M3 Lighter vibrant green accent

  // Backgrounds
  background: "#f7f9ee", // M3 Expressive Light Background (Greenish-tinted neutral)
  surface: "#f7f9ee", // M3 Surface
  surfaceSecondary: "#ffffff", // M3 Surface Bright
  surfaceAlt: "#edf2e0", // M3 Surface Variant

  // Text
  textPrimary: "#131f00", // M3 On Surface / On Primary Container
  textDark: "#131f00", // M3 On Surface
  textSecondary: "#43493e", // M3 On Surface Variant
  textMuted: "#74796e", // M3 Outline
  textInverse: "#ffffff", // M3 On Primary / Inverse On Surface

  // Borders
  border: "#c3c8bb", // M3 Outline Variant
  borderLight: "#e0e4d6", // M3 Lighter Outline / Surface Container High
  divider: "#c3c8bb", // M3 Outline Variant
  borderNeutral: "#edf2e0", // M3 Surface Variant

  // States
  success: "#386b01", // M3 Primary
  warning: "#865300", // M3 Expressive Amber/Orange
  error: "#ba1a1a", // M3 Standard Error
  info: "#006684", // M3 Expressive Blue/Cyan

  // Navigation
  tabBar: "#edf2e0", // M3 Surface Container
  tabActive: "#386b01", // M3 Primary
  tabInactive: "#43493e", // M3 On Surface Variant

  // Cards
  card: "#f1f4e7", // M3 Surface Container Low
  cardSecondary: "#edf2e0", // M3 Surface Container

  // Inputs
  inputBackground: "#edf2e0", // M3 Surface Container
  inputBorder: "#74796e", // M3 Outline
  inputPlaceholder: "#74796e", // M3 Outline

  // Overlay
  overlay: "rgba(28, 29, 23, 0.35)", // M3 Scrim with transparency

  // Attendance
  present: "#386b01", // M3 Primary
  absent: "#ba1a1a", // M3 Error
  late: "#865300", // M3 Warning/Amber

  // Notice
  noticeInfo: "#006684", // M3 Info
  noticeUrgent: "#ba1a1a", // M3 Error

  // Assignment
  assignmentPending: "#865300", // M3 Warning
  assignmentSubmitted: "#386b01", // M3 Primary
};

export const DarkColors = {
  // Brand
  primary: "#9cd65d", // M3 Expressive Dark Primary
  primaryDark: "#234e00", // M3 Primary Container
  primaryLight: "#b8f377", // M3 Lighter variant

  // Backgrounds
  background: "#0b1014", // M3 Expressive Dark Background
  surface: "#10140b", // M3 Dark Surface
  surfaceSecondary: "#1c2117", // M3 Surface Container
  surfaceAlt: "#181c13", // M3 Surface Container Low

  // Text
  textPrimary: "#e2e3d8", // M3 On Surface
  textDark: "#e2e3d8", // M3 On Surface
  textSecondary: "#c3c8bb", // M3 On Surface Variant
  textMuted: "#8d9286", // M3 Outline
  textInverse: "#131f00", // M3 Inverse On Surface / On Primary

  // Borders
  border: "#43493e", // M3 Outline Variant
  borderLight: "#2d3228", // M3 Surface Container High
  divider: "#43493e", // M3 Outline Variant
  borderNeutral: "#1c2117", // M3 Surface Container

  // States
  success: "#9cd65d", // M3 Primary
  warning: "#ffb961", // M3 Dark Amber
  error: "#ffb4ab", // M3 Dark Error
  info: "#66d3ff", // M3 Dark Cyan/Blue

  // Navigation
  tabBar: "#181c13", // M3 Surface Container Low
  tabActive: "#9cd65d", // M3 Primary
  tabInactive: "#8d9286", // M3 Outline

  // Cards
  card: "#1c2117", // M3 Surface Container
  cardSecondary: "#22271c", // M3 Surface Container High

  // Inputs
  inputBackground: "#1c2117", // M3 Surface Container
  inputBorder: "#8d9286", // M3 Outline
  inputPlaceholder: "#8d9286", // M3 Outline

  // Overlay
  overlay: "rgba(0, 0, 0, 0.5)", // M3 Scrim

  // Attendance
  present: "#9cd65d", // M3 Primary
  absent: "#ffb4ab", // M3 Error
  late: "#ffb961", // M3 Warning

  // Notice
  noticeInfo: "#66d3ff", // M3 Info
  noticeUrgent: "#ffb4ab", // M3 Error

  // Assignment
  assignmentPending: "#ffb961", // M3 Warning
  assignmentSubmitted: "#9cd65d", // M3 Primary
};

export type AppColors = typeof LightColors;
