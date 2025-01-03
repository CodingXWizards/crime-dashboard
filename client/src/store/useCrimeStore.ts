import { config } from "@/constants/env";
import { Crime, CrimeState } from "@/types/crime";
import { getData } from "@/utils/helper";
import { create } from "zustand";
import { devtools } from "zustand/middleware";

const API_URL = `${config.apiUrl}`;

// Define the Zustand store with the proper type annotations
const useCrimeStore = create<CrimeState>()(
  devtools(
    (set) => ({
      crimeList: [],
      stages: [],
      loading: false,
      error: null,
      fetchCrimeList: async () => {
        set({ loading: true, error: null });
        try {
          const response = await fetch(`${API_URL}/table/crime/all`);
          if (!response.ok) {
            throw new Error("Failed to fetch crime list");
          }
          const data: Crime[] = await response.json();

          const stages = await getData("stage");

          set({
            crimeList: data,
            stages: stages.result.map((stage: { label: string }) => ({ name: stage.label })),
            loading: false,
          });
        } catch (error: any) {
          set({ error: (error as Error).message, loading: false });
        }
      },
    }),
    { name: "CrimeStore" }
  )
);

export default useCrimeStore;
