import { Item } from "@/api/items";
import { getItem, setItem } from "./storage";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export type StorageItem = Item & { quantity: number };

export async function addStorageItem(newItem: Item) {
  // Retrieve existing items from AsyncStorage
  const existingItems = (await getItem<StorageItem[]>("items")) || [];

  // Check if the item already exists
  const existingItemIndex = existingItems.findIndex(
    (storateItem) => storateItem.barcode === newItem.barcode
  );

  if (existingItemIndex !== -1) {
    // Increment the quantity of the existing item
    existingItems[existingItemIndex].quantity += 1;
  } else {
    // Add a new item with quantity 1
    (newItem as unknown as StorageItem).quantity = 1;
    existingItems.push(newItem as unknown as StorageItem);
  }

  // Store the updated array back in AsyncStorage
  await setItem("items", existingItems);
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
