import { useEffect, useState } from 'react';
import { getData } from "@/utils/helper";
import useCrimeStore from "@/store/useCrimeStore";
import { DropDown } from "@/components/dropdown";
import { ChevronDown, ChevronUp } from "lucide-react";
import { FormData } from '@/types/form-entry';
import { Loader } from "@/components/loader";

export const Thana = () => {
  const [districts, setDistricts] = useState<{ label: string; value: string }[]>([]);
  const [stages, setStages] = useState<{ label: string; value: string }[]>([]);
  const [thanaData, setThanaData] = useState<Record<string, string[]>>({});
  const [expandedDistricts, setExpandedDistricts] = useState<Record<string, boolean>>({});
  const [formData, setFormData] = useState<FormData>({
    district: '',
    policeStation: '',
    crimeNumber: '',
    incidentDate: '',
    firDate: '',
    csReadyDate: '',
    csFiledDate: '',
    stage: 'विवेचना',
    totalAccused: '',
    arrested: '',
    section: '',
    act: '',
    sectionContent: '',
    chapter: '',
    subChapter: ''
  });
  const { crimeList, fetchCrimeList, loading } = useCrimeStore();

  useEffect(() => {
    const fetchInitialData = async () => {
      const [districtData, stageData] = await Promise.all([
        getData("thana"),
        getData("stage")
      ]);
      setDistricts(districtData.result);
      setStages(stageData.result);
    };
    fetchInitialData();
    fetchCrimeList();
  }, [fetchCrimeList]);

  useEffect(() => {
    const fetchAllThanaLists = async () => {
      const thanaDataTemp: Record<string, string[]> = {};
      for (const district of districts) {
        const thanas = (await getData(district.value)).result;
        thanaDataTemp[district.value] = thanas.map((t: { label: string }) => t.label);
      }
      setThanaData(thanaDataTemp);
    };
    if (districts.length > 0) {
      fetchAllThanaLists();
    }
  }, [districts]);

  const getIOCount = (thanaName: string) => {
    return crimeList
      .filter(crime => crime.io === thanaName)
      .filter(crime => crime.stage === formData.stage)
      .length;
  };

  const toggleDistrict = (districtValue: string) => {
    setExpandedDistricts(prev => ({
      ...prev,
      [districtValue]: !prev[districtValue]
    }));
  };

  return (
    <section className="bg-white rounded-md overflow-auto h-[calc(100vh-1.5rem)] md:h-[calc(100vh-50vh-1.5rem)] shadow-lg border basis-1/2">
      <div className="p-4 border-b bg-white sticky top-0 z-10">
        <DropDown
          name="Stage"
          fieldName="stage"
          data={stages}
          value={formData.stage}
          formData={formData}
          setFormData={setFormData}
        />
      </div>
      
      {loading ? (
        <div className="flex-1">
          <Loader />
        </div>
      ) : (
        <div className="overflow-auto flex-1 p-4">
          {districts.map((district) => (
            <div key={district.value} className="mb-4 bg-white rounded-lg shadow-sm">
              <button
                onClick={() => toggleDistrict(district.value)}
                className="w-full flex items-center justify-between p-3 bg-gray-50 hover:bg-gray-100 rounded-t-lg transition-colors duration-200"
              >
                <span className="font-medium text-gray-800">{district.label}</span>
                {expandedDistricts[district.value] ? (
                  <ChevronUp className="h-5 w-5 text-gray-600" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-gray-600" />
                )}
              </button>
              
              {expandedDistricts[district.value] && (
                <div className="border-t border-gray-100">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="p-3 border-b border-gray-200 text-left font-semibold text-gray-700">Thana</th>
                        <th className="p-3 border-b border-gray-200 text-center font-semibold text-gray-700">Crime Count</th>
                      </tr>
                    </thead>
                    <tbody>
                      {thanaData[district.value]?.map((thana) => (
                        <tr key={thana} className="hover:bg-gray-50 transition-colors duration-150">
                          <td className="p-3 border-b border-gray-100 text-gray-800">{thana}</td>
                          <td className="p-3 border-b border-gray-100 text-center">
                            {getIOCount(thana)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default Thana;