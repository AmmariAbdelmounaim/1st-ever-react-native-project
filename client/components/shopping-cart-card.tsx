import { View } from "react-native";
import { Card, CardContent, CardFooter } from "./ui/card";
import { Button, Text } from "./ui";
import { Trash2 } from "@/lib/icons/trash";
import { H3, Muted, P } from "./ui/typography";
import { StorageItem } from "@/lib/utils";
import { Minus } from "@/lib/icons/minus";
import { Plus } from "@/lib/icons/plus";
import { getItem, setItem } from "@/lib/storage";
import { useEffect, useState } from "react";
import { useItems } from "@/lib/hooks/use-items";

interface ShoppingCartCardProps {
  item: StorageItem;
}

function ShoppingCartCard({ item }: ShoppingCartCardProps) {
  const { id, name, price, quantity } = item;
  const [amount, setAmount] = useState<number>(quantity);
  const { items, setItems } = useItems();
  const [currentItem, setCurrentItem] = useState<StorageItem | undefined>(
    items.find((storedItem) => storedItem.id === id)
  );

  useEffect(() => {
    setCurrentItem(items.find((storedItem) => storedItem.id === id));
  }, [JSON.stringify(items)]);

  const onIncrease = async () => {
    try {
      setAmount((prevAmount) => {
        const newAmount = prevAmount + 1;
        const updatedItems = items.map((storedItem: any) => {
          if (storedItem.barcode === item.barcode) {
            return { ...storedItem, quantity: newAmount };
          }
          return storedItem;
        });
        setItems(updatedItems);
        setItem("items", updatedItems);
        console.log("updated items: ", updatedItems);
        return newAmount;
      });
    } catch (error) {
      console.error("Error updating quantity:", error);
    }
  };

  const onDecrease = async () => {
    try {
      setAmount((prevAmount) => {
        const newAmount = prevAmount > 0 ? prevAmount - 1 : prevAmount;
        const updatedItems = items.map((storedItem: any) => {
          if (storedItem.barcode === item.barcode) {
            return { ...storedItem, quantity: newAmount };
          }
          return storedItem;
        });
        setItems(updatedItems);
        setItem("items", updatedItems);
        return newAmount;
      });
    } catch (error) {
      console.error("Error updating quantity:", error);
    }
  };

  const deleteItem = async () => {
    try {
      const storageItems =
        items.length > 0
          ? items
          : (await getItem<StorageItem[]>("items")) || [];

      const updatedItems = storageItems.filter(
        (storedItem: StorageItem) => storedItem.barcode !== item.barcode
      );
      setItems(updatedItems);
      await setItem("items", updatedItems);
    } catch (error) {
      console.error("Error deleting item:", error);
    }
  };
  return (
    <Card className="w-full max-w-md">
      <CardContent className="p-6">
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "flex-start",
          }}
        >
          <View>
            <H3 className="font-semibold capitalize text-lg">{name}</H3>
            <Muted>Price: ${price / 100}</Muted>
          </View>
          <Button
            variant="destructive"
            size="icon"
            onPress={async () => {
              await deleteItem();
            }}
          >
            <Trash2 className="h-4 w-4 text-background" />
          </Button>
        </View>
      </CardContent>
      <CardFooter className="flex justify-between items-center p-6 pt-0">
        <View
          className="flex items-center space-x-2"
          style={{
            display: "flex",
            flexDirection: "row",
            gap: 5,
          }}
        >
          <Button
            variant="outline"
            size="icon"
            onPress={async () => {
              await onDecrease();
            }}
          >
            <Minus className="h-4 w-4 text-foreground" />
          </Button>
          <Text className="font-medium text-lg">{currentItem?.quantity}</Text>
          <Button
            variant="outline"
            size="icon"
            onPress={async () => {
              onIncrease();
            }}
          >
            <Plus className="h-4 w-4 text-foreground" />
          </Button>
        </View>
        <P className="font-semibold">Total: ${(price * amount) / 100}</P>
      </CardFooter>
    </Card>
  );
}

export default ShoppingCartCard;
