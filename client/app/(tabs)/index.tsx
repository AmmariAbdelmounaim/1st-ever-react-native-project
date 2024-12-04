import { CameraView, useCameraPermissions } from "expo-camera";
import { Stack, useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
  AppState,
  Button,
  Platform,
  StatusBar,
  StyleSheet,
  View,
} from "react-native";
import { useItem } from "@/api/items";
import { addStorageItem, StorageItem } from "@/lib/utils";
import { Text } from "@/components/ui";
import { useItems } from "@/lib/hooks/use-items";
import { getItem, setItem } from "@/lib/storage";
import { AsyncStorage } from "expo-sqlite/kv-store";

export default function App() {
  const [permission, requestPermission] = useCameraPermissions();
  const [barcode, setBarcode] = useState("");
  const [originalBarcode, setOriginalBarcode] = useState(""); // New state for original barcode
  const router = useRouter();

  const qrLock = useRef(false);
  const appState = useRef(AppState.currentState);
  const { setItems } = useItems();
  const { data: scannedItem } = useItem({
    variables: { barcode: originalBarcode },
    enabled: !!originalBarcode,
  });

  useEffect(() => {
    const subscription = AppState.addEventListener("change", (nextAppState) => {
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === "active"
      ) {
        qrLock.current = false;
      }
      appState.current = nextAppState;
    });

    return () => {
      subscription.remove();
    };
  }, [barcode]);

  useEffect(() => {
    const updateItems = async () => {
      if (scannedItem) {
        const existingItems = (await getItem<StorageItem[]>("items")) || [];

        // Check if the item already exists
        const existingItemIndex = existingItems.findIndex(
          (storageItem) => storageItem.barcode === scannedItem.barcode
        );

        if (existingItemIndex !== -1) {
          // Increment the quantity of the existing item
          existingItems[existingItemIndex].quantity += 1;
        } else {
          // Add a new item with quantity 1
          (scannedItem as unknown as StorageItem).quantity = 1;
          existingItems.push(scannedItem as unknown as StorageItem);
        }

        // Store the updated array back in AsyncStorage
        await setItem("items", existingItems);
        setItems(existingItems);

        // Navigate to the cart
        router.push("/(tabs)/cart");

        // Wait for a specified time before resetting the lock
        setTimeout(() => {
          qrLock.current = false; // Reset the lock after a delay
        }, 2000); // 2000 milliseconds = 2 seconds
      }
    };

    updateItems();
  }, [scannedItem, barcode]);

  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    return (
      <View className="flex-1">
        <Text>We need your permission to show the camera</Text>
        <Button onPress={requestPermission} title="grant permission" />
      </View>
    );
  }

  return (
    <View className="flex-1 p-6 justify-center gap-6">
      <Stack.Screen
        options={{
          title: "Scan Item",
          headerShown: true,
        }}
      />
      {Platform.OS === "android" ? <StatusBar hidden /> : null}
      <CameraView
        style={StyleSheet.absoluteFillObject}
        facing="back"
        onBarcodeScanned={({ data }) => {
          if (data && !qrLock.current) {
            qrLock.current = true;
            setTimeout(async () => {
              setBarcode(`${data}-${Date.now()}`);
              setOriginalBarcode(data);
            }, 500);
          }
        }}
      />
    </View>
  );
}
