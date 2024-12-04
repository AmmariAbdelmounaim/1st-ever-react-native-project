import { useEffect, useState } from "react";
import { getItem, setItem } from "../storage";
import { Platform } from "react-native";
import { SplashScreen } from "expo-router";
import { useColorScheme } from "../use-color-scheme";
import { setAndroidNavigationBar } from "../android-navigation-bar";

export function useThemeInitialization() {
  const { colorScheme, setColorScheme, isDarkColorScheme } = useColorScheme();
  const [isColorSchemeLoaded, setIsColorSchemeLoaded] = useState(false);

  useEffect(() => {
    (async () => {
      const theme = await getItem("theme");
      console.log(theme);
      if (!theme) {
        setAndroidNavigationBar(colorScheme);
        setItem("theme", colorScheme);
        setIsColorSchemeLoaded(true);
        return;
      }
      const colorTheme = theme === "dark" ? "dark" : "light";
      setAndroidNavigationBar(colorTheme);
      if (colorTheme !== colorScheme) {
        setColorScheme(colorTheme);
        setIsColorSchemeLoaded(true);
        return;
      }
      setIsColorSchemeLoaded(true);
    })().finally(() => {
      SplashScreen.hideAsync();
    });
  }, []);

  return { isDarkColorScheme, isColorSchemeLoaded };
}
