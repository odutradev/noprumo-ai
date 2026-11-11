import { shadcn } from "enchase/styles/shadcn"

import type { ThemeInput } from "enchase/theme"

export const theme: ThemeInput = {
  style: shadcn,
  brand: "#E0652A",
  fonts: {
    primary: "'Geist Variable', 'Geist', system-ui, -apple-system, 'Segoe UI', sans-serif",
    mono: "'Geist Mono Variable', 'Geist Mono', ui-monospace, 'SFMono-Regular', Menlo, Consolas, monospace"
  },
  light: {
    colors: {
      primary: "#FF8A4C",
      onPrimary: "#0F1012",
      primaryHover: "#F27838",
      primaryContainer: "#FFF3EC",
      onPrimaryContainer: "#5E2A0F",
      secondary: "#3358D4",
      onSecondary: "#FFFFFF",
      secondaryContainer: "#EDEEEF",
      onSecondaryContainer: "#16181B",
      success: "#1A7548",
      error: "#C42F3A",
      warning: "#8A6100",
      info: "#3358D4",
      background: "#FCFCFB",
      surface: "#FFFFFF",
      surfaceContainerLow: "#F6F6F4",
      surfaceContainer: "#F6F6F4",
      surfaceContainerHigh: "#F2F3F4",
      text: { primary: "#16181B", secondary: "#5E646E" },
      border: "#D9DCE0",
      borderLight: "#EDEEEF",
      codeBackground: "#F6F6F4"
    }
  },
  dark: {
    colors: {
      primary: "#FF8A4C",
      onPrimary: "#0F1012",
      primaryHover: "#FFA673",
      primaryContainer: "#3A1A09",
      onPrimaryContainer: "#FFC4A3",
      secondary: "#7AA2FF",
      onSecondary: "#0F1012",
      secondaryContainer: "#2C3036",
      onSecondaryContainer: "#F2F1EE",
      success: "#4CC38A",
      error: "#FF6B6B",
      warning: "#F5C451",
      info: "#7AA2FF",
      background: "#0F1012",
      surface: "#16181B",
      surfaceContainerLow: "#16181B",
      surfaceContainer: "#1F2226",
      surfaceContainerHigh: "#2C3036",
      text: { primary: "#F2F1EE", secondary: "#9AA0A9" },
      border: "#2C3036",
      borderLight: "#1F2226",
      codeBackground: "#16181B"
    }
  }
}

export const colorModeStorageKey = "enchase-color-mode"
