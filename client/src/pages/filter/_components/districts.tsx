import { config } from "@/constants/env";
import { useCrimeStore } from "@/store";
import { useEffect, useState } from "react";

export const Districts = () => {
  const [districts, setDistricts] = useState<{ label: string; value: string }[]>([]);
  const { crimeList } = useCrimeStore();
  const API_URL = config.apiUrl;
  useEffect(() => {
    fetch(`${API_URL}/table/db/thana`)
      .then((res) => res.json())
      .then((response: { data: string[]; column: string }) => {
        const districts = response.data;
        setDistricts(
          districts.map((item: string) => ({
            label: item,
            value: item,
          }))
        );
      })
      .catch((error) => {
        console.error("Error fetching districts:", error);
        setDistricts([]);
      });
  }, []);

  return (
    <aside className="px-4 basis-1/5 flex flex-col border-r">
      {districts.length !== 0 &&
        districts.map((district) => (
          <p>
            {district.label} - {crimeList.filter((crime) => crime.thana.toLowerCase() === district.label.toLowerCase()).length}
          </p>
        ))}
    </aside>
  );
};
