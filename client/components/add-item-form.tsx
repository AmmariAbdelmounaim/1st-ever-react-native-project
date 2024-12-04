import { zodResolver } from "@hookform/resolvers/zod";
import React, { useState } from "react";
import type { SubmitHandler } from "react-hook-form";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { Button, ControlledInput, Text, View } from "@/components/ui";
import { AsyncStorage } from "expo-sqlite/kv-store";
import { router } from "expo-router";
import { useItems } from "@/lib/hooks/use-items";
import { getItem, setItem } from "@/lib/storage";
import { StorageItem } from "@/lib/utils";

const schema = z.object({
  barcode: z.string({
    required_error: "QR Code is required",
  }),
});

export type FormType = z.infer<typeof schema>;

export type AddItemFormProps = {
  onSubmit?: SubmitHandler<FormType>;
};

export const AddItemForm = () => {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState<boolean>(false);
  const { handleSubmit, control } = useForm<FormType>({
    resolver: zodResolver(schema),
  });
  const { setItems } = useItems();

  const onSubmit: AddItemFormProps["onSubmit"] = async (data) => {
    try {
      setLoading(true);
      console.log("fetching barcode... ");
      const response = await fetch(
        `${process.env.EXPO_PUBLIC_API_URL}/items/barcode/${data.barcode}`
      );
      if (!response.ok) {
        console.error("This item does not correspond to any item in the db");
        setError("This item does not correspond to any item in the db");
        setLoading(false);
      }
      const result = await response.json();
      if (result.barcode) {
        // Retrieve existing items from AsyncStorage
        const existingItems = (await getItem<StorageItem[]>("items")) || [];

        // Check if the item already exists
        const existingItemIndex = existingItems.findIndex(
          (item) => item.barcode === result.barcode
        );

        if (existingItemIndex !== -1) {
          // Increment the quantity of the existing item
          console.log("existingItemIndex !== -1");
          console.log(
            "existingItems[existingItemIndex].quantity",
            existingItems[existingItemIndex].quantity
          );
          existingItems[existingItemIndex].quantity += 1;
        } else {
          // Add a new item with quantity 1
          result.quantity = 1;
          existingItems.push(result);
        }

        // Store the updated array back in AsyncStorage
        await setItem("items", existingItems);
        setItems(existingItems);
        router.push("/(tabs)/cart");
      }
      setLoading(false);
      // Handle the result as needed
    } catch (error) {
      setError(`Failed to fetch barcode data: ${error}`);
      setLoading(false);
    }
  };

  return (
    <View className="w-full px-6 max-w-md flex flex-col gap-2">
      <ControlledInput
        control={control}
        name="barcode"
        label="Barcode"
        placeholder="1234567891234"
      />
      <Button onPress={handleSubmit(onSubmit)} disabled={loading}>
        <Text className="text-background">Search Item</Text>
      </Button>
    </View>
  );
};
