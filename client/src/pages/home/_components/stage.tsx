import React, { useEffect } from "react";
import useCrimeStore from "@/store/useCrimeStore";

interface StageData {
  thana: string;
  khatma: number;
  kharji: number;
  chalanTaiyar: number;
  chalanPesh: number;
  vivechna: number;
  yellowLine: number;
  redLine: number;
  chalanTaiyarRedLine: number;
  kulYog: number;
}

export const Stage = () => {
  const { crimeList, fetchCrimeList, loading } = useCrimeStore();

  useEffect(() => {
    fetchCrimeList();
  }, [fetchCrimeList]);

  const processData = (): { thanaData: StageData[]; totals: StageData } => {
    const thanaMap = new Map<string, StageData>();

    const totals: StageData = {
      thana: "कुल योग",
      khatma: 0,
      kharji: 0,
      chalanTaiyar: 0,
      chalanPesh: 0,
      vivechna: 0,
      kulYog: 0,
      yellowLine: 0,
      redLine: 0,
      chalanTaiyarRedLine: 0,
    };

    crimeList.forEach((crime) => {
      if (!thanaMap.has(crime.thana)) {
        thanaMap.set(crime.thana, {
          thana: crime.thana,
          khatma: 0,
          kharji: 0,
          chalanTaiyar: 0,
          chalanPesh: 0,
          vivechna: 0,
          kulYog: 0,
          yellowLine: 0,
          redLine: 0,
          chalanTaiyarRedLine: 0,
        });
      }

      const thanaData = thanaMap.get(crime.thana)!;

      switch (crime.stage.toLowerCase()) {
        case "खात्मा":
          thanaData.khatma++;
          totals.khatma++;
          break;
        case "खारजी":
          thanaData.kharji++;
          totals.kharji++;
          break;
        case "चालान तैयार":
          if (!crime.marker?.toLowerCase().includes("red")) {
            thanaData.chalanTaiyar++;
            totals.chalanTaiyar++;
          } else {
            thanaData.chalanTaiyarRedLine++;
          }
          break;
        case "चालान पेश":
          thanaData.chalanPesh++;
          totals.chalanPesh++;
          break;
        case "विवेचना":
          thanaData.vivechna++;
          totals.vivechna++;
          break;
      }

      if (crime.marker?.toLowerCase().includes("yellow")) {
        thanaData.yellowLine++;
        totals.yellowLine++;
      }
      if (crime.marker?.toLowerCase().includes("red") && crime.stage.toLowerCase() !== "चालान तैयार") {
        thanaData.redLine++;
        totals.redLine++;
      }
    });

    thanaMap.forEach((data) => {
      data.kulYog = data.khatma + data.kharji + data.chalanTaiyar + data.chalanPesh + data.vivechna;
    });

    totals.kulYog = totals.khatma + totals.kharji + totals.chalanTaiyar + totals.chalanPesh + totals.vivechna;

    return {
      thanaData: Array.from(thanaMap.values()),
      totals,
    };
  };

  const { thanaData, totals } = processData();

  return (
    <section className="bg-gray-100 border border-gray-200 rounded-lg w-full h-full p-6 shadow-md">
      <div className="overflow-x-auto">
        <table className="w-full table-auto border-collapse text-sm bg-white shadow rounded-lg">
          <thead>
            <tr className="bg-gray-200 text-gray-800">
              <th rowSpan={2} className="border border-gray-300 p-3 text-left font-semibold">
                थाना
              </th>
              <th colSpan={6} className="border border-gray-300 p-3 text-left font-semibold">
                स्टेज
              </th>
              <th colSpan={3} className="border border-gray-300 p-3 text-left font-semibold">
                अपराध
              </th>
            </tr>
            <tr className="bg-gray-100 text-gray-700">
              <th className="border border-gray-300 p-2 font-medium">खात्मा</th>
              <th className="border border-gray-300 p-2 font-medium">खारजी</th>
              <th className="border border-gray-300 p-2 font-medium">चालान तैयार</th>
              <th className="border border-gray-300 p-2 font-medium">चालान पेश</th>
              <th className="border border-gray-300 p-2 font-medium">विवेचना</th>
              <th className="border border-gray-300 p-2 font-bold">कुल योग</th>
              <th className="border border-gray-300 p-2 font-medium">Yellow Line</th>
              <th className="border border-gray-300 p-2 font-medium">Red Line</th>
              <th className="border border-gray-300 p-2 font-medium">Chalaan Taiyaar Red Line</th>
            </tr>
          </thead>
          <tbody>
            {thanaData.map((data, index) => (
              <tr key={data.thana} className={`${index % 2 === 0 ? "bg-gray-50" : "bg-white"} hover:bg-gray-100 transition`}>
                <td className="border border-gray-300 p-3 text-center font-medium">{data.thana}</td>
                <td className="border border-gray-300 p-3 text-center">{data.khatma || "-"}</td>
                <td className="border border-gray-300 p-3 text-center">{data.kharji || "-"}</td>
                <td className="border border-gray-300 p-3 text-center">{data.chalanTaiyar || "-"}</td>
                <td className="border border-gray-300 p-3 text-center">{data.chalanPesh || "-"}</td>
                <td className="border border-gray-300 p-3 text-center">{data.vivechna || "-"}</td>
                <td className="border border-gray-300 p-3 text-center font-bold bg-gray-100">{data.kulYog || "-"}</td>
                <td className="border border-gray-300 p-3 text-center">{data.yellowLine || "-"}</td>
                <td className="border border-gray-300 p-3 text-center">{data.redLine || "-"}</td>
                <td className="border border-gray-300 p-3 text-center">{data.chalanTaiyarRedLine || "-"}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="bg-gray-200 font-semibold">
              <td className="border border-gray-300 p-3 text-center">{totals.thana}</td>
              <td className="border border-gray-300 p-3 text-center">{totals.khatma || "-"}</td>
              <td className="border border-gray-300 p-3 text-center">{totals.kharji || "-"}</td>
              <td className="border border-gray-300 p-3 text-center">{totals.chalanTaiyar || "-"}</td>
              <td className="border border-gray-300 p-3 text-center">{totals.chalanPesh || "-"}</td>
              <td className="border border-gray-300 p-3 text-center">{totals.vivechna || "-"}</td>
              <td className="border border-gray-300 p-3 text-center bg-gray-100">{totals.kulYog || "-"}</td>
              <td className="border border-gray-300 p-3 text-center">{totals.yellowLine || "-"}</td>
              <td className="border border-gray-300 p-3 text-center">{totals.redLine || "-"}</td>
              <td className="border border-gray-300 p-3 text-center">{totals.chalanTaiyarRedLine || "-"}</td>
            </tr>
          </tfoot>
        </table>
      </div>
      {loading && <div className="text-center py-4 text-gray-600">Loading...</div>}
    </section>
  );
};
