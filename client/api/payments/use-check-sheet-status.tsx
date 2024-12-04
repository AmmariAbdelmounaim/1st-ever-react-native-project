import type { AxiosError } from "axios";
import { createMutation } from "react-query-kit";

import { client } from "../common";
import type { Payment } from "./types";

type Variables = { payment_intent_id: string; customer_id: string };
type Response = Payment;

export const useCheckSheetStatus = createMutation<
  Response,
  Variables,
  AxiosError
>({
  mutationFn: async (variables) =>
    client({
      url: `payments/check/${variables.payment_intent_id}`,
      method: "POST",
      data: variables.customer_id,
    }).then((response) => response.data),
});
