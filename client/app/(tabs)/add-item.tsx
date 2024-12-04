import { AddItemForm } from "@/components/add-item-form";
import { H1, Muted } from "@/components/ui/typography";
import { Platform, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { FullWindowOverlay } from "react-native-screens";

function AddItemPage() {
  const insets = useSafeAreaInsets();
  return (
    <>
      <View className="flex-1 items-center justify-center">
        <View className="p-4  max-w-md gap-6">
          <View className="gap-1">
            <H1 className="text-foreground text-center">
              Manually add an item
            </H1>
            <Muted className="text-base text-center">
              Hey 🙂, Stupid enough to input your own item ? Go Ahead we made a
              form exactly for people like you.
            </Muted>
          </View>
        </View>
        <AddItemForm />
      </View>
    </>
  );
}

export default AddItemPage;
