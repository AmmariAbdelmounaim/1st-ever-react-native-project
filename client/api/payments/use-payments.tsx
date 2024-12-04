import type { AxiosError } from "axios";
import { createQuery } from "react-query-kit";

import { client } from "../common";
import type { Payment } from "./types";

type Response = Payment[];
type Variables = void; // as react-query-kit is strongly typed, we need to specify the type of the variables as void in case we don't need them

export const usePayments = createQuery<Response, Variables, AxiosError>({
  queryKey: ["payments"],
  fetcher: () => {
    return client.get(`payments`).then((response) => response.data);
  },
});
