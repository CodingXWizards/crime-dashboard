import { useEffect } from "react";
import useCrimeStore from "@/store/useCrimeStore";
import { Loader } from "@/components/loader";

interface StageData {
  thana: string;
  [key: string]: number | string;
  kulYog: number;
}

export const Stage = () => {
  const { crimeList, fetchCrimeList, stages, loading } = useCrimeStore();

  useEffect(() => {
    fetchCrimeList();
  }, [fetchCrimeList]);

  const processData = (): { thanaData: StageData[]; totals: StageData } => {
    const thanaMap = new Map<string, StageData>();

    const totals: StageData = {
      thana: "कुल योग",
      kulYog: 0,
    };

    // Initialize thana data
    crimeList.forEach((crime) => {
      if (!thanaMap.has(crime.district)) {
        const newThanaData: StageData = {
          thana: crime.district,
          kulYog: 0,
        };
        // Initialize stage counters
        stages.forEach((stage) => {
          newThanaData[stage.name] = 0;
          totals[stage.name] = totals[stage.name] || 0;
        });
        thanaMap.set(crime.district, newThanaData);
      }

      const thanaData = thanaMap.get(crime.district)!;

      // Count stage occurrences
      if (crime.stage) {
        thanaData[crime.stage] = ((thanaData[crime.stage] as number) || 0) + 1;
        totals[crime.stage] = ((totals[crime.stage] as number) || 0) + 1;
      }
    });

    // Calculate totals
    thanaMap.forEach((data) => {
      data.kulYog = stages.reduce((sum, stage) => sum + ((data[stage.name] as number) || 0), 0);
    });
    totals.kulYog = stages.reduce((sum, stage) => sum + ((totals[stage.name] as number) || 0), 0);

    return {
      thanaData: Array.from(thanaMap.values()),
      totals,
    };
  };

  const { thanaData, totals } = processData();

  return (
    <section className="bg-white rounded-md overflow-auto h-[calc(100vh-1.5rem)] md:h-[calc(100vh-50vh-1.5rem)] shadow-lg border basis-1/2">
      {loading ? (
        <Loader />
      ) : (
        <table className="w-full border-collapse text-sm h-full">
          <thead>
            <tr className="bg-gray-200 text-gray-800">
              <th rowSpan={2} className="p-3 font-semibold">
                District
              </th>
              <th colSpan={stages.length + 1} className="p-3 font-semibold">
                स्टेज
              </th>
            </tr>
            <tr className="bg-gray-100 text-gray-700">
              {stages.map((stage) => (
                <th key={stage.name}>{stage.name}</th>
              ))}
              <th className="p-2 font-bold">कुल योग</th>
            </tr>
          </thead>
          <tbody>
            {thanaData.map((data, index) => (
              <tr key={data.thana} className={`${index % 2 === 0 ? "bg-gray-50" : "bg-white"} hover:bg-gray-100 transition`}>
                <td className="p-3 text-center font-semibold">{data.thana}</td>
                {stages.map((stage) => (
                  <td key={stage.name} className="text-center">
                    {data[stage.name] || "-"}
                  </td>
                ))}
                <td className="p-3 text-center font-bold bg-gray-100">{data.kulYog || "-"}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="bg-gray-200 font-semibold">
              <td className="text-center">{totals.thana}</td>
              {stages.map((stage) => (
                <td key={stage.name} className="text-center">
                  {totals[stage.name] || "-"}
                </td>
              ))}
              <td className="p-3 text-center bg-gray-100">{totals.kulYog || "-"}</td>
            </tr>
          </tfoot>
        </table>
      )}
    </section>
  );
};
