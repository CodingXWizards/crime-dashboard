import React, { useEffect } from "react";
import useCrimeStore from "@/store/useCrimeStore";

interface MonthlyStats {
  month: string;
  year: number;
  currentCount: number;
  lastYearCount: number;
  difference: number;
  percentageChange: number;
}

export const Threemonth = () => {
  const { crimeList, fetchCrimeList, loading } = useCrimeStore();

  useEffect(() => {
    fetchCrimeList();
  }, [fetchCrimeList]);

  const getMonthStats = (monthIndex: number): MonthlyStats => {
    const year = 2023;
    const month = new Date(year, monthIndex).toLocaleString("default", { month: "long" });

    // Get current year's cases (full year up to the specified month)
    const currentYearCases = crimeList.filter((crime) => {
      const crimeDate = new Date(crime.incidentDate);
      const endDate = new Date(year, monthIndex + 1, 0); // Last day of specified month
      const startDate = new Date(year - 1, monthIndex + 1, 1); // First day of next month last year

      return crimeDate >= startDate && crimeDate <= endDate && crime.stage.toLowerCase() === "विवेचना";
    }).length;

    // Get previous year's cases (full year up to the specified month)
    const lastYearCases = crimeList.filter((crime) => {
      const crimeDate = new Date(crime.incidentDate);
      const endDate = new Date(year - 1, monthIndex + 1, 0); // Last day of specified month last year
      const startDate = new Date(year - 2, monthIndex + 1, 1); // First day of next month two years ago

      return crimeDate >= startDate && crimeDate <= endDate && crime.stage.toLowerCase() === "विवेचना";
    }).length;

    const difference = currentYearCases - lastYearCases;
    const percentageChange = lastYearCases ? (difference / lastYearCases) * 100 : 100;

    return {
      month,
      year,
      currentCount: currentYearCases,
      lastYearCount: lastYearCases,
      difference,
      percentageChange,
    };
  };

  const monthsToShow = [
    getMonthStats(9), // October
    getMonthStats(10), // November
    getMonthStats(11), // December
  ];

  return (
    <section className="bg-white rounded-xl shadow-lg border border-gray-100 basis-1/2">
      <div className="p-6">
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-800">Quarterly Crime Comparison</h2>
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
              <div key={index} className="bg-gray-50 rounded-lg border border-gray-200 overflow-hidden">
                <div className="bg-gray-100 p-4 border-b border-gray-200">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold text-gray-800">
                      {stats.month} {stats.year}
                    </h3>
                    <div className="flex items-center gap-2">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium ${
                          stats.difference > 0 ? "bg-red-100 text-red-800" : "bg-green-100 text-green-800"
                        }`}
                      >
                        {stats.difference > 0 ? "▲" : "▼"}
                        {Math.abs(stats.percentageChange).toFixed(1)}%
                      </span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">Pending Investigation Cases</p>
                </div>

                <div className="p-4 space-y-4">
                  {/* Current Year Stats */}
                  <div className="bg-white p-3 rounded border border-gray-200">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-sm font-medium text-gray-600">2023 Cases</p>
                        <p className="text-xl font-bold text-gray-900">{stats.currentCount}</p>
                      </div>
                      <span className="text-xs text-gray-500">Current Year</span>
                    </div>
                  </div>
                </div>

                {/* Previous Year Stats */}
                <div className="bg-white p-3 rounded border border-gray-200">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm font-medium text-gray-600">2022 Cases</p>
                      <p className="text-xl font-bold text-gray-900">{stats.lastYearCount}</p>
                    </div>
                    <span className="text-xs text-gray-500">Previous Year</span>
                  </div>
                </div>

                {/* Difference Analysis */}
                <div className={`p-3 rounded border ${stats.difference > 0 ? "bg-red-50 border-red-200" : "bg-green-50 border-green-200"}`}>
                  <p className="text-sm font-medium text-gray-700">Year-over-Year Change</p>
                  <div className="flex justify-between items-center mt-1">
                    <p className={`text-lg font-bold ${stats.difference > 0 ? "text-red-700" : "text-green-700"}`}>
                      {stats.difference > 0 ? "+" : ""}
                      {stats.difference} cases
                    </p>
                    <div className="flex items-center">
                      {stats.difference > 0 ? (
                        <span className="text-xs text-red-600">Increased</span>
                      ) : (
                        <span className="text-xs text-green-600">Decreased</span>
                      )}
                    </div>
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
