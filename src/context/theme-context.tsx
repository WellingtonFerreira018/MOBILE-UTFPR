import { createContext, ReactNode, useContext, useState } from "react"

type Theme = "light" | "dark"

type ThemeColors = {
  background: string
  text: string
  card: string
  border: string
  primary: string
  secondary: string
}

type ThemeContextType = {
  theme: Theme
  colors: ThemeColors
  toggleTheme: () => void
}

const lightColors: ThemeColors = {
  background: "#ffffff",
  text: "#333333",
  card: "#f8f9fa",
  border: "#e0e0e0",
  primary: "#007AFF",
  secondary: "#5856D6",
}

const darkColors: ThemeColors = {
  background: "#1a1a1a",
  text: "#ffffff",
  card: "#2d2d2d",
  border: "#404040",
  primary: "#0A84FF",
  secondary: "#5E5CE6",
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

type ThemeProviderProps = {
  children: ReactNode
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>("light")

  const toggleTheme = (): void => {
    setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"))
  }

  const colors = theme === "light" ? lightColors : darkColors

  const value: ThemeContextType = {
    theme,
    colors,
    toggleTheme,
  }

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

export function useTheme(): ThemeContextType {
  const context = useContext(ThemeContext)

  if (context === undefined) {
    throw new Error("useTheme deve ser usado dentro de um ThemeProvider")
  }

  return context
}
