import { Tabs } from "expo-router";
import { Camera } from "@/lib/icons/camera";
import { Plus } from "@/lib/icons/plus";
import { ThemeToggle } from "@/components/theme-toggle";
import { Text } from "@/components/ui";
import { ShoppingCart } from "@/lib/icons/shopping-cart";
import { FileLock } from "@/lib/icons/file-lock";

const TabsLayout = () => {
  return (
    <Tabs>
      <Tabs.Screen
        name="index"
        options={{
          title: "Scan Item",
          tabBarIcon({ color, size }) {
            return <Camera color={color} size={size} />;
          },
          headerRight: () => <ThemeToggle />,
        }}
      />
      <Tabs.Screen
        name="add-item"
        options={{
          title: "Add Item",
          tabBarIcon({ color, size }) {
            return <Plus color={color} size={size} />;
          },
          headerRight: () => <ThemeToggle />,
          headerTitle(props) {
            return <Text className="text-xl font-semibold">Add Item</Text>;
          },
        }}
      />
      <Tabs.Screen
        name="cart"
        options={{
          title: "Cart",
          tabBarIcon({ color, size }) {
            return <ShoppingCart color={color} size={size} />;
          },
          headerRight: () => <ThemeToggle />,
          headerTitle(props) {
            return <Text className="text-xl font-semibold">Add Item</Text>;
          },
        }}
      />
      <Tabs.Screen
        name="payment-history"
        options={{
          title: "Payment History",
          tabBarIcon({ color, size }) {
            return <FileLock color={color} size={size} />;
          },
          headerRight: () => <ThemeToggle />,
          headerTitle(props) {
            return (
              <Text className="text-xl font-semibold">Payment History</Text>
            );
          },
        }}
      />
    </Tabs>
  );
};

export default TabsLayout;
