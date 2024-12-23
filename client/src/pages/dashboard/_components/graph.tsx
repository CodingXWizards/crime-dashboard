import { Line } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, ChartData, ChartOptions } from "chart.js";
import useCrimeStore from "@/store/useCrimeStore";
import { Crime } from "@/types/crime";
import { useEffect, useState } from "react";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

interface MonthlyData {
  [key: string]: number;
}

interface ProcessedData {
  labels: string[];
  values: number[];
}

interface GraphProps {
  selectedChapter: string;
  selectedSubChapter: string;
  selectedSection: string;
  selectedStage: string;
}

export const Graph: React.FC<GraphProps> = ({ selectedSection, selectedStage }) => {
  const { crimeList } = useCrimeStore();

  const getFilteredData = () => {
    return crimeList.filter((crime) => {
      const matchesSection = !selectedSection || crime.primarySection.toString() === selectedSection.split("-")[0].trim();
      const matchesStage = !selectedStage || crime.stage === selectedStage;
      return matchesSection && matchesStage;
    });
  };

  const processData = (): ProcessedData => {
    const filteredData = getFilteredData();
    if (!filteredData?.length) return { labels: [], values: [] };

    const monthlyData = filteredData.reduce<MonthlyData>((acc, crime: Crime) => {
      const date = new Date(crime.incidentDate);
      const key = `${date.getMonth() + 1}/${date.getFullYear()}`;
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {});

    const labels = Object.keys(monthlyData).sort((a, b) => {
      const [monthA, yearA] = a.split("/").map(Number);
      const [monthB, yearB] = b.split("/").map(Number);
      return yearA === yearB ? monthA - monthB : yearA - yearB;
    });

    const values = labels.map((label) => monthlyData[label]);
    return { labels, values };
  };

  const [labels, setLabels] = useState<string[]>([]);
  const [values, setValues] = useState<number[]>([]);
  useEffect(() => {
    const data = processData();
    setLabels(data.labels);
    setValues(data.values);
  }, [selectedSection, selectedStage]);

  const data: ChartData<"line"> = {
    labels,
    datasets: [
      {
        label: "Filtered Cases",
        data: values,
        borderColor: "rgb(75, 192, 192)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        tension: 0.3,
        fill: true,
      },
    ],
  };

  const options: ChartOptions<"line"> = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Crime Cases Timeline",
        font: { size: 16 },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: "Number of Cases",
          font: { size: 14 },
        },
        ticks: {
          precision: 0,
        },
      },
      x: {
        title: {
          display: true,
          text: "Month/Year",
          font: { size: 14 },
        },
      },
    },
    maintainAspectRatio: false,
  };

  return (
    <div className="bg-white p-4 rounded shadow-sm h-[400px]">
      {values.length > 0 ? (
        <Line options={options} data={data} />
      ) : (
        <div className="flex items-center justify-center h-full text-gray-500">No data available for selected filters</div>
      )}
    </div>
  );
};

export default Graph;
