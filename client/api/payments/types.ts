import { Item } from "../items";

export type Payment = {
  id: string;
  checkout_date: string;
  is_checked: boolean;
  customer: {
    id: string;
    email: string;
  };
  purchased_items: {
    item: Item;
    amount: number;
  }[];
};

export type PendingItem = {
  id: number;
  amount: number;
};

export type Sheet = {
  pending_items: PendingItem[];
  customer_id: string;
};
