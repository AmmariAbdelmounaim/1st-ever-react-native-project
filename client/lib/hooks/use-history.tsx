import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import { StorageItem } from "../utils";
import { History } from "@/types";
import { getItem } from "../storage";

interface HistoryContextType {
  history: History[];
  setHistory: React.Dispatch<React.SetStateAction<History[]>>;
}
// Create the context
const HistoryContext = createContext<HistoryContextType | undefined>(undefined);

// Create a provider component
export const HistoryProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [history, setHistory] = useState<History[]>([]);

  useEffect(() => {
    const fetchHistory = async () => {
      const storedHistory = (await getItem<History[]>("history")) || [];
      setHistory(storedHistory);
    };

    fetchHistory();
  }, []);

  return (
    <HistoryContext.Provider value={{ history, setHistory }}>
      {children}
    </HistoryContext.Provider>
  );
};

// Create a custom hook to use the ItemsContext
export const useHistory = (): HistoryContextType => {
  const context = useContext(HistoryContext);
  if (!context) {
    throw new Error("useHistory must be used within an HistoryProvider");
  }
  return context;
};
