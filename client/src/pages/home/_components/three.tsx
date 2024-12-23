import React, { useEffect, useState } from "react";
import useCrimeStore from "@/store/useCrimeStore";

interface PoliceStationStats {
  policeStation: string;
  pendingCount: number;
}

interface DistrictStats {
  district: string; // This was previously called thana
  policeStations: PoliceStationStats[];
  totalCount: number;
}

interface MonthlyStats {
  month: string;
  year: number;
  districtData: DistrictStats[];
  periodStart: string;
  periodEnd: string;
  totalCount: number; // Add this line
}

type PeriodOption = "3months" | "6months" | "1year";

interface PeriodConfig {
  label: string;
  months: number;
}

export const Threemonth = () => {
  const { crimeList, fetchCrimeList, loading } = useCrimeStore();
  const [selectedPeriod, setSelectedPeriod] = useState<PeriodOption>("3months");
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());
  const [selectedDistrict, setSelectedDistrict] = useState<string>("");

  // Get unique districts from crime list
  const districts = React.useMemo(() => [...new Set(crimeList.map((crime) => crime.thana))].sort(), [crimeList]);

  // Get current year and create year range
  const currentYear = new Date().getFullYear();
  const availableYears = Array.from({ length: currentYear - 2020 + 1 }, (_, index) => currentYear - index);

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
    const month = new Date(year, monthIndex).toLocaleString("default", { month: "long" });
    const endDate = new Date(year, monthIndex + 1, 0);
    const startDate = new Date(year, monthIndex + 1 - periodOptions[selectedPeriod].months, 1);

    const districtMap = new Map<string, Map<string, number>>();

    crimeList.forEach((crime) => {
      const crimeDate = new Date(crime.incidentDate);
      const district = crime.thana; // This is the district name

      if (
        crimeDate >= startDate &&
        crimeDate <= endDate &&
        (crime.stage.toLowerCase() === "विवेचना" || crime.stage.toLowerCase() === "चालान तैयार") &&
        (!selectedDistrict || district === selectedDistrict)
      ) {
        // Get police stations from the column that matches the district name
        const policeStationsString = crime[district];

        // Initialize district in map if not exists
        if (!districtMap.has(district)) {
          districtMap.set(district, new Map());
        }

        // Get or create the police stations map for this district
        const policeStationMap = districtMap.get(district)!;

        // If we have police stations data in the district column
        if (typeof policeStationsString === "string" && policeStationsString) {
          // Split the police stations (assuming they're comma-separated)
          const policeStations = policeStationsString.split(",").map((ps) => ps.trim());

          // Count each police station
          policeStations.forEach((station) => {
            if (station) {
              policeStationMap.set(station, (policeStationMap.get(station) || 0) + 1);
            }
          });
        }
      }
    });

    // Convert the map data to our expected format
    const districtData = Array.from(districtMap.entries()).map(([district, stations]) => ({
      district,
      policeStations: Array.from(stations.entries())
        .map(([name, count]) => ({
          policeStation: name,
          pendingCount: count,
        }))
        .sort((a, b) => b.pendingCount - a.pendingCount),
      totalCount: Array.from(stations.values()).reduce((sum, count) => sum + count, 0),
    }));

    const totalCount = districtData.reduce((sum, district) => sum + district.totalCount, 0);

    return {
      month,
      year,
      districtData,
      periodStart: startDate.toLocaleDateString(),
      periodEnd: endDate.toLocaleDateString(),
      totalCount, // Add this
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
          <div className="flex justify-between items-center flex-wrap gap-4">
            <div>
              <h2 className="text-xl font-semibold text-gray-800">Period-wise Analysis</h2>
              <p className="text-sm text-gray-600 mt-1">Pending cases by police station (विवेचना + चालान तैयार)</p>
            </div>
            <div className="flex items-center gap-4">
              {/* Year Selector */}
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(Number(e.target.value))}
                className="px-3 py-2 rounded-lg text-sm font-medium border border-gray-200 
                          bg-white text-gray-700 focus:outline-none focus:ring-2 
                          focus:ring-blue-500 focus:border-transparent"
              >
                {availableYears.map((year) => (
                  <option key={year} value={year}>
                    {year} {year === currentYear ? "(Current)" : ""}
                  </option>
                ))}
              </select>

              {/* District Selector */}
              <select
                value={selectedDistrict}
                onChange={(e) => setSelectedDistrict(e.target.value)}
                className="px-3 py-2 rounded-lg text-sm font-medium border border-gray-200 
                          bg-white text-gray-700 focus:outline-none focus:ring-2 
                          focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">All Districts</option>
                {districts.map((district) => (
                  <option key={district} value={district}>
                    {district}
                  </option>
                ))}
              </select>

              {/* Period Selector Buttons */}
              <div className="flex gap-2">
                {Object.entries(periodOptions).map(([key, { label }]) => (
                  <button
                    key={key}
                    onClick={() => setSelectedPeriod(key as PeriodOption)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors
                    ${
                      selectedPeriod === key ? "bg-blue-100 text-blue-800 border-blue-200" : "bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100"
                    } border`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
          </div>
          {selectedYear === currentYear && <p className="text-xs text-amber-600 mt-2">Note: Data for current year may be incomplete</p>}
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
                    <span className="px-2.5 py-0.5 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">Total: {stats.totalCount}</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Previous {periodOptions[selectedPeriod].months} months: {stats.periodStart} - {stats.periodEnd}
                  </p>
                </div>

                <div className="p-4">
                  <div className="space-y-4">
                    {stats.districtData.map((district) => (
                      <div key={district.district} className="space-y-2">
                        {!selectedDistrict && (
                          <h4 className="font-medium text-gray-900 border-b pb-1">
                            {district.district} ({district.totalCount})
                          </h4>
                        )}
                        <div className="space-y-2 pl-2">
                          {district.policeStations.map((station) => (
                            <div key={station.policeStation} className="flex justify-between items-center py-1">
                              <span className="text-sm text-gray-700">{station.policeStation}</span>
                              <span className="text-sm bg-gray-100 px-2 py-1 rounded-full">{station.pendingCount}</span>
                            </div>
                          ))}
                        </div>
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
