import type { AxiosError } from "axios";
import { createQuery } from "react-query-kit";

import { client } from "../common";
import type { Item } from "./types";

type Variables = { barcode: string };
type Response = Item;

export const useItem = createQuery<Response, Variables, AxiosError>({
  queryKey: ["items"],
  fetcher: (variables) => {
    return client
      .get(`items/barcode/${variables.barcode}`)
      .then((response) => response.data);
  },
  staleTime: 0,
});
