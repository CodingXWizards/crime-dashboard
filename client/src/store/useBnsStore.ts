import { config } from "@/constants/env";
import { Bns, BnsState } from "@/types/bns";
import { create } from "zustand";
import { devtools } from "zustand/middleware";

const API_URL = config.apiUrl;

// Define the Zustand store with the proper type annotations
const useBnsStore = create<BnsState>()(
  devtools(
    (set) => ({
      bnsList: [],
      loading: false,
      error: null,
      fetchBnsList: async () => {
        set({ loading: true, error: null });
        try {
          const response = await fetch(`${API_URL}/table/bns/all`);
          if (!response.ok) {
            throw new Error("Failed to fetch crime list");
          }
          const data: Bns[] = await response.json();
          set({ bnsList: data, loading: false });
        } catch (error: any) {
          set({ error: (error as Error).message, loading: false });
        }
      },
    }),
    { name: "BnsStore" }
  )
);

export default useBnsStore;
