import type { AxiosError } from "axios";
import { createMutation } from "react-query-kit";

import { client } from "../common";
import type { PendingItem, Sheet } from "./types";

type Variables = { pending_items: PendingItem[]; customer_id: string };
type Response = Sheet;

export const useAddSheet = createMutation<Response, Variables, AxiosError>({
  mutationFn: async (variables) =>
    client({
      url: "payments",
      method: "POST",
      data: variables,
    }).then((response) => response.data),
});
