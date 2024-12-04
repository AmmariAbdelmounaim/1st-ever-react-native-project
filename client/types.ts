import { StorageItem } from "@/lib/utils";

export type History = {
  items: StorageItem[];
  date: string;
  amount: number;
};
