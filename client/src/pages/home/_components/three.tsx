import { useEffect, useState } from "react";
import useCrimeStore from "@/store/useCrimeStore";

interface ThanaStats {
  thana: string;
  pendingCount: number;
}

interface MonthlyStats {
  month: string;
  year: number;
  thanaData: ThanaStats[];
  totalCount: number;
  periodStart: string;
  periodEnd: string;
}

type PeriodOption = "3months" | "6months" | "1year";

interface PeriodConfig {
  label: string;
  months: number;
}

export const Threemonth = () => {
  const { crimeList, fetchCrimeList, loading } = useCrimeStore();
  const [selectedPeriod, setSelectedPeriod] = useState<PeriodOption>("3months");

  // Get current year and create year range
  const currentYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState<number>(currentYear);

  // Generate array of years from 2020 to current year
  const availableYears = Array.from(
    { length: currentYear - 2020 + 1 },
    (_, index) => currentYear - index,
  );

  const periodOptions: Record<PeriodOption, PeriodConfig> = {
    "3months": { label: "3 Months", months: 3 },
    "6months": { label: "6 Months", months: 6 },
    "1year": { label: "1 Year", months: 12 },
  };

  useEffect(() => {
    fetchCrimeList();
  }, [fetchCrimeList]);

  const getMonthStats = (monthIndex: number): MonthlyStats => {
    const year = selectedYear;
    const month = new Date(year, monthIndex).toLocaleString("default", {
      month: "long",
    });

    // Set date range based on selected period
    const endDate = new Date(year, monthIndex + 1, 0);
    const startDate = new Date(
      year,
      monthIndex + 1 - periodOptions[selectedPeriod].months,
      1,
    );

    // Create thana map to store counts
    const thanaMap = new Map<string, number>();

    crimeList.forEach((crime) => {
      const crimeDate = new Date(crime.incidentDate);

      if (
        crimeDate >= startDate &&
        crimeDate <= endDate &&
        (crime.stage.toLowerCase() === "विवेचना" ||
          crime.stage.toLowerCase() === "चालान तैयार")
      ) {
        thanaMap.set(crime.thana, (thanaMap.get(crime.thana) || 0) + 1);
      }
    });

    const thanaData = Array.from(thanaMap.entries())
      .map(([thana, count]) => ({ thana, pendingCount: count }))
      .sort((a, b) => b.pendingCount - a.pendingCount);

    return {
      month,
      year,
      thanaData,
      totalCount: thanaData.reduce((sum, t) => sum + t.pendingCount, 0),
      periodStart: startDate.toLocaleDateString(),
      periodEnd: endDate.toLocaleDateString(),
    };
  };

  const monthsToShow = [
    getMonthStats(9), // October
    getMonthStats(10), // November
    getMonthStats(11), // December
  ];

  return (
    <section className="bg-white rounded-xl overflow-auto max-h-[calc(100vh-50vh)] shadow-lg border border-gray-100 basis-1/2">
      <div className="p-6">
        <div className="mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-xl font-semibold text-gray-800">
                Period-wise Analysis
              </h2>
            </div>
            <div className="flex items-center gap-4">
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(Number(e.target.value))}
                className="px-3 py-2 rounded-lg text-sm font-medium border border-gray-200 
                          bg-white text-gray-700 focus:outline-none focus:ring-2 
                          focus:ring-blue-500 focus:border-transparent min-w-[120px]"
              >
                {availableYears.map((year) => (
                  <option key={year} value={year}>
                    {year} {year === currentYear ? "(Current)" : ""}
                  </option>
                ))}
              </select>
              <div className="flex gap-2">
                {Object.entries(periodOptions).map(([key, { label }]) => (
                  <button
                    key={key}
                    onClick={() => setSelectedPeriod(key as PeriodOption)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors
                    ${selectedPeriod === key
                        ? "bg-blue-100 text-blue-800 border-blue-200"
                        : "bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100"
                      } border`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
          </div>
          {selectedYear === currentYear && (
            <p className="text-xs text-amber-600 mt-2">
              Note: Data for current year may be incomplete
            </p>
          )}
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-[400px]">
            <div className="flex flex-col items-center gap-2">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-blue-600 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                <div className="w-3 h-3 bg-blue-600 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                <div className="w-3 h-3 bg-blue-600 rounded-full animate-bounce"></div>
              </div>
              <span className="text-sm text-gray-500">Loading data...</span>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {monthsToShow.map((stats, index) => (
              <div
                key={index}
                className="bg-gray-50 rounded-lg border border-gray-200 overflow-hidden"
              >
                <div className="bg-gray-100 p-4 border-b border-gray-200">
                  <div className="flex justify-between items-center text-nowrap">
                    <h3 className="text-lg font-semibold text-gray-800">
                      {stats.month} {stats.year}
                    </h3>
                    <span className="px-2.5 py-0.5 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                      Total: {stats.totalCount}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Previous {periodOptions[selectedPeriod].months} months:{" "}
                    {stats.periodStart} - {stats.periodEnd}
                  </p>
                </div>

                <div className="p-4">
                  <div className="space-y-2">
                    {stats.thanaData.map((thana) => (
                      <div
                        key={thana.thana}
                        className="flex justify-between items-center py-2 border-b border-gray-100"
                      >
                        <span className="text-sm font-medium text-gray-700">
                          {thana.thana}
                        </span>
                        <span className="text-sm bg-gray-100 px-2 py-1 rounded-full">
                          {thana.pendingCount}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
