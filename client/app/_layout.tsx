import "../global.css";
import React from "react";
import { SplashScreen, Stack } from "expo-router";
import { StripeProvider } from "@stripe/stripe-react-native";
import { APIProvider } from "@/api";
import { NAV_THEME } from "@/lib/constants";
import { Theme, ThemeProvider } from "@react-navigation/native";
import { useThemeInitialization } from "@/lib";
import { StatusBar } from "expo-status-bar";
import { Platform } from "react-native";
import { Text } from "@/components/ui";
import { ThemeToggle } from "@/components/theme-toggle";
import { AsyncStorage } from "expo-sqlite/kv-store";
import { ItemsProvider } from "@/lib/hooks/use-items";
import { HistoryProvider } from "@/lib/hooks/use-history";

const LIGHT_THEME: Theme = {
  dark: false,
  colors: NAV_THEME.light,
  fonts: Platform.select({
    ios: {
      regular: {
        fontFamily: "System",
        fontWeight: "400",
      },
      medium: {
        fontFamily: "System",
        fontWeight: "500",
      },
      bold: {
        fontFamily: "System",
        fontWeight: "600",
      },
      heavy: {
        fontFamily: "System",
        fontWeight: "700",
      },
    },
    default: {
      regular: {
        fontFamily: "sans-serif",
        fontWeight: "normal",
      },
      medium: {
        fontFamily: "sans-serif-medium",
        fontWeight: "normal",
      },
      bold: {
        fontFamily: "sans-serif",
        fontWeight: "600",
      },
      heavy: {
        fontFamily: "sans-serif",
        fontWeight: "700",
      },
    },
  }),
};
const DARK_THEME: Theme = {
  dark: true,
  colors: NAV_THEME.dark,
  fonts: Platform.select({
    ios: {
      regular: {
        fontFamily: "System",
        fontWeight: "400",
      },
      medium: {
        fontFamily: "System",
        fontWeight: "500",
      },
      bold: {
        fontFamily: "System",
        fontWeight: "600",
      },
      heavy: {
        fontFamily: "System",
        fontWeight: "700",
      },
    },
    default: {
      regular: {
        fontFamily: "sans-serif",
        fontWeight: "normal",
      },
      medium: {
        fontFamily: "sans-serif-medium",
        fontWeight: "normal",
      },
      bold: {
        fontFamily: "sans-serif",
        fontWeight: "600",
      },
      heavy: {
        fontFamily: "sans-serif",
        fontWeight: "700",
      },
    },
  }),
};

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from "expo-router";

// Prevent the splash screen from auto-hiding before getting the color scheme.
SplashScreen.preventAutoHideAsync();

function Providers({ children }: { children: React.ReactElement }) {
  const { isColorSchemeLoaded, isDarkColorScheme } = useThemeInitialization();

  if (!isColorSchemeLoaded) {
    return (
      <StripeProvider publishableKey={process.env.EXPO_PUBLIC_STRIPE_PK!}>
        <APIProvider>
          <ItemsProvider>{children}</ItemsProvider>
        </APIProvider>
      </StripeProvider>
    );
  }

  return (
    <ThemeProvider value={isDarkColorScheme ? DARK_THEME : LIGHT_THEME}>
      <StripeProvider publishableKey={process.env.EXPO_PUBLIC_STRIPE_PK!}>
        <APIProvider>
          <ItemsProvider>
            <HistoryProvider>
              <StatusBar style={isDarkColorScheme ? "light" : "dark"} />
              {children}
            </HistoryProvider>
          </ItemsProvider>
        </APIProvider>
      </StripeProvider>
    </ThemeProvider>
  );
}

function RootLayout() {
  return (
    <Providers>
      <Stack
        initialRouteName="(tabs)"
        screenOptions={{
          headerBackTitle: "Back",
          headerTitle(props) {
            return (
              <Text className="text-xl font-semibold">
                {toOptions(props.children)}
              </Text>
            );
          },
          headerRight: () => <ThemeToggle />,
        }}
      >
        <Stack.Screen
          name="(tabs)"
          options={{
            headerShown: false,
          }}
        />
      </Stack>
    </Providers>
  );
}

function toOptions(name: string) {
  const title = name
    .split("-")
    .map(function (str: string) {
      return str.replace(/\b\w/g, function (char) {
        return char.toUpperCase();
      });
    })
    .join(" ");
  return title;
}

export default RootLayout;
