import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import { StorageItem } from "../utils";
import { getItem } from "../storage";

interface ItemsContextType {
  items: StorageItem[];
  setItems: React.Dispatch<React.SetStateAction<StorageItem[]>>;
}

// Create the context
const ItemsContext = createContext<ItemsContextType | undefined>(undefined);

// Create a provider component
export const ItemsProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [items, setItems] = useState<StorageItem[]>([]);

  useEffect(() => {
    const fetchItems = async () => {
      const storedItems = (await getItem<StorageItem[]>("items")) || [];
      setItems(storedItems);
    };

    fetchItems();
  }, []);

  return (
    <ItemsContext.Provider value={{ items, setItems }}>
      {children}
    </ItemsContext.Provider>
  );
};

// Create a custom hook to use the ItemsContext
export const useItems = (): ItemsContextType => {
  const context = useContext(ItemsContext);
  if (!context) {
    throw new Error("useItems must be used within an ItemsProvider");
  }
  return context;
};
