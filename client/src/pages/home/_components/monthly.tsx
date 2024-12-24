import { supabase } from "@/lib/supabase-client";
import { getData } from "@/utils/helper";
import { useEffect, useState } from "react";
import { Loader } from "@/components/loader";

interface CrimeData {
  monthNumber: number; // Represents the crime month (1 for January, 2 for February, etc.)
  weekNumber: number; // Represents the week number of the crime
  [thana: string]: number; // Represents the number of crimes per Thana dynamically
}

export const Monthly = () => {
  const [crimeData, setCrimeData] = useState<CrimeData[]>([]);

  const [thanaList, setThanaList] = useState<string[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      setThanaList((await getData("thana")).result.map((r) => r.label));
    };
    fetchData();
  }, []);

  useEffect(() => {
    const fetchCrimeData = async () => {
      try {
        const { data, error } = await supabase.rpc("get_crime_data");
        if (error) throw error;
        console.log(data);
        const consolidatedData: CrimeData[] = [];
        data.forEach((item: CrimeData) => {
          const existingEntry = consolidatedData.find(
            (entry) =>
              entry.monthNumber === item.monthnumber &&
              entry.weekNumber === item.weeknumber
          );

          if (existingEntry) {
            // If an entry exists for the same month and week, add the thana crime count
            existingEntry[item.thana] = item.crimecount;
          } else {
            // Create a new entry if no matching month/week combination exists
            consolidatedData.push({
              monthNumber: item.monthnumber,
              weekNumber: item.weeknumber,
              [item.thana]: item.crimecount,
            });
          }
        });

        console.log("Consolidated Crime Data:", consolidatedData);
        setCrimeData(consolidatedData);
      } catch (error) {
        console.error(error);
      }
    };

    fetchCrimeData();
  }, []);

  return (
    <section className="bg-white rounded-md overflow-auto h-[calc(100vh-1.5rem)] md:h-[calc(100vh-50vh-1.5rem)] shadow-lg border basis-1/2">
      {!crimeData.length ? (
        <Loader />
      ) : (
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-200">
              <th rowSpan={2}>Crime Month</th>
              <th rowSpan={2}>Crime Week</th>
              <th colSpan={thanaList.length + 1}>Thana</th>
            </tr>
            <tr className="bg-gray-100">
              {thanaList.map((thana) => (
                <th
                  key={thana}
                  className="px-4 py-2 border border-gray-300 text-center"
                >
                  {thana}
                </th>
              ))}
              <th>कुल योग</th>
            </tr>
          </thead>
          <tbody>
            {crimeData.map((row: CrimeData, index) => (
              <tr key={index}>
                <td className="bg-gray-100 font-semibold px-4 py-2 border border-gray-300">
                  {row.monthNumber}
                </td>
                <td className="bg-gray-100 font-semibold px-4 py-2 border border-gray-300">
                  {row.weekNumber}
                </td>
                {thanaList.map((thana) => (
                  <td
                    key={`${index}-${thana}`}
                    className="px-4 py-2 border border-gray-300 text-center"
                  >
                    {row[thana] || 0}
                  </td>
                ))}
                <td className="font-semibold bg-gray-100">
                  {thanaList.reduce((sum, thana) => sum + (row[thana] || 0), 0)}
                </td>
              </tr>
            ))}
            <tr className="bg-gray-200 font-semibold">
              <td colSpan={2}>कुल योग</td>
              {thanaList.map((thana) => (
                <td>{crimeData.reduce((sum, d) => sum + (d[thana] || 0), 0)}</td>
              ))}
              <td>
                {thanaList.reduce(
                  (wholeSum, thana) =>
                    wholeSum +
                    crimeData.reduce((sum, row) => sum + (row[thana] || 0), 0),
                  0
                )}
              </td>
            </tr>
          </tbody>
        </table>
      )}
    </section>
  );
};
