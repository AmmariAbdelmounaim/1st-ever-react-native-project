import { useEffect, useState } from "react";
import { Alert, ScrollView, View } from "react-native";
import {
  initPaymentSheet,
  presentPaymentSheet,
} from "@stripe/stripe-react-native";
import ShoppingCartCard from "@/components/shopping-cart-card";
import { Button, Text } from "@/components/ui";
import { getItem, removeItem, setItem } from "../../lib/storage";
import { useItems } from "@/lib/hooks/use-items";
import { useHistory } from "@/lib/hooks/use-history";
import { History } from "@/types";
import { StorageItem } from "@/lib/utils";

function CartPage() {
  const { items, setItems } = useItems();
  const [strypeItems, setStrypeItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [paymentIntentId, setPaymentIntentId] = useState<string>("");
  const { setHistory } = useHistory();

  const apiUrl = process.env.EXPO_PUBLIC_API_URL;
  const userId = "cus_RKQWhrZ1ho0MaT";

  useEffect(() => {
    const updatedStrypeItems = items.map((item) => {
      return {
        id: item.id,
        amount: item.quantity,
      };
    });
    setStrypeItems(updatedStrypeItems);
  }, [items]);

  const fetchPaymentSheetParams = async () => {
    try {
      const response = await fetch(`${apiUrl}/payments/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          pending_items: strypeItems,
          customer_id: userId,
        }),
      });

      const text = await response.text(); // Get the response as text

      // Check if the response is JSON
      if (response.headers.get("content-type")?.includes("application/json")) {
        const data = JSON.parse(text); // Parse the text as JSON

        const { paymentIntent, ephemeralKey, customer } = data;

        return {
          paymentIntent,
          ephemeralKey,
          customer,
        };
      } else {
        throw new Error("Response is not JSON");
      }
    } catch (error) {
      console.error("Failed to fetch payment sheet params:", error);
    }
  };

  const initializePaymentSheet = async () => {
    try {
      setLoading(true);
      const { paymentIntent, ephemeralKey, customer } =
        await fetchPaymentSheetParams();

      const { error } = await initPaymentSheet({
        merchantDisplayName: "Example, Inc.",
        customerId: customer,
        customerEphemeralKeySecret: ephemeralKey,
        paymentIntentClientSecret: paymentIntent,
        allowsDelayedPaymentMethods: false,
        returnURL: "myapp://payment-complete",
      });
      if (!error) {
        setPaymentIntentId(paymentIntent);
        setLoading(false);
      }
    } catch (err) {
      Alert.alert(
        "Error",
        "An error occurred during payment sheet initialization:"
      );
    }
  };

  const openPaymentSheet = async () => {
    const { error } = await presentPaymentSheet();

    if (error) {
    } else {
      const paymentIntent = `pi_${paymentIntentId.split("_")[1]}`;
      const response = await fetch(
        `${apiUrl}/payments/check/${paymentIntent}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            customer_id: userId,
          }),
        }
      );

      if (response.status == 200) {
        try {
          const existingHistory: History[] =
            (await getItem<History[]>("history")) || [];

          const date = new Date().toISOString();

          const totalAmount = items.reduce(
            (sum, item) => sum + item.price * item.quantity,
            0
          );

          const newHistoryEntry: History = {
            items,
            date,
            amount: totalAmount,
          };

          const updatedHistory: History[] = [
            ...existingHistory,
            newHistoryEntry,
          ];

          await setItem("history", updatedHistory);

          setHistory(updatedHistory);

          await removeItem("items");

          setItems([]);

          setStrypeItems([]);

          Alert.alert("Success", "Your order is confirmed!");
        } catch (err) {
          console.error("Error during payment success handling:", err);
        }
      }
    }
  };

  useEffect(() => {
    if (strypeItems.length > 0) {
      initializePaymentSheet();
    }
  }, [strypeItems]);

  return (
    <ScrollView className="bg-muted px-2">
      <View
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 4,
          justifyContent: "center",
          alignItems: "center",
          marginTop: 5,
        }}
      >
        {items.map((item, index) => (
          <ShoppingCartCard key={index} item={item} />
        ))}
      </View>
      {items.length > 0 && (
        <View
          style={{
            marginTop: 5,
            paddingLeft: 5,
            paddingRight: 5,
          }}
        >
          <Button disabled={loading} onPress={openPaymentSheet}>
            <Text className="text-background">Checkout</Text>
          </Button>
        </View>
      )}
    </ScrollView>
  );
}

export default CartPage;
