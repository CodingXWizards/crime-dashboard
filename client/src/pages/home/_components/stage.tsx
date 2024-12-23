import { useEffect } from "react";
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
      if (
        crime.marker?.toLowerCase().includes("red") &&
        crime.stage.toLowerCase() !== "चालान तैयार"
      ) {
        thanaData.redLine++;
        totals.redLine++;
      }
    });

    thanaMap.forEach((data) => {
      data.kulYog =
        data.khatma +
        data.kharji +
        data.chalanTaiyar +
        data.chalanPesh +
        data.vivechna;
    });

    totals.kulYog =
      totals.khatma +
      totals.kharji +
      totals.chalanTaiyar +
      totals.chalanPesh +
      totals.vivechna;

    return {
      thanaData: Array.from(thanaMap.values()),
      totals,
    };
  };

  const { thanaData, totals } = processData();

  return (
    <section className="bg-gray-100 basis-1/2 border border-gray-200 rounded-md w-full overflow-auto flex-grow shadow-md">
      <table className="w-full border-collapse text-sm bg-white shadow">
        <thead>
          <tr className="bg-gray-200 text-gray-800">
            <th rowSpan={2} className="p-3 font-semibold">
              थाना
            </th>
            <th colSpan={6} className="p-3 font-semibold">
              स्टेज
            </th>
            <th colSpan={3} className="p-3 font-semibold">
              अपराध
            </th>
          </tr>
          <tr className="bg-gray-100 text-gray-700">
            <th>खात्मा</th>
            <th>खारजी</th>
            <th>चालान तैयार</th>
            <th>चालान पेश</th>
            <th>विवेचना</th>
            <th className="p-2 font-bold">कुल योग</th>
            <th>Yellow Line</th>
            <th>Red Line</th>
            <th>Chalaan Taiyaar Red Line</th>
          </tr>
        </thead>
        <tbody>
          {thanaData.map((data, index) => (
            <tr
              key={data.thana}
              className={`${
                index % 2 === 0 ? "bg-gray-50" : "bg-white"
              } hover:bg-gray-100 transition`}
            >
              <td className="p-3 text-center font-semibold">{data.thana}</td>
              <td>{data.khatma || "-"}</td>
              <td>{data.kharji || "-"}</td>
              <td>{data.chalanTaiyar || "-"}</td>
              <td>{data.chalanPesh || "-"}</td>
              <td>{data.vivechna || "-"}</td>
              <td className="p-3 text-center font-bold bg-gray-100">
                {data.kulYog || "-"}
              </td>
              <td>{data.yellowLine || "-"}</td>
              <td>{data.redLine || "-"}</td>
              <td>{data.chalanTaiyarRedLine || "-"}</td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr className="bg-gray-200 font-semibold">
            <td>{totals.thana}</td>
            <td>{totals.khatma || "-"}</td>
            <td>{totals.kharji || "-"}</td>
            <td>{totals.chalanTaiyar || "-"}</td>
            <td>{totals.chalanPesh || "-"}</td>
            <td>{totals.vivechna || "-"}</td>
            <td className="p-3 text-center bg-gray-100">
              {totals.kulYog || "-"}
            </td>
            <td>{totals.yellowLine || "-"}</td>
            <td>{totals.redLine || "-"}</td>
            <td>{totals.chalanTaiyarRedLine || "-"}</td>
          </tr>
        </tfoot>
      </table>
      {loading && (
        <div className="text-center py-4 text-gray-600">Loading...</div>
      )}
    </section>
  );
};
