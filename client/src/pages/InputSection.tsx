import { useEffect, useState } from "react";
import Select from "react-select";

interface ApiResponse {
  success: boolean;
  message: string;
  data?: any;
  error?: string;
}

interface TableResponse {
  column: string;
  data: string[];
}

interface SectionData {
  chapterName: string;
  chapterDescription: string;
  subChapter: string;
  sectionNumber: number;
  sectionContent: string;
}

interface FormData {
  district: string;
  policeStation: string;
  crimeNumber: string;
  incidentDate: string;
  firDate: string;
  csReadyDate: string;
  csFiledDate: string;
  stage: string;
  totalAccused: string;
  arrested: string;
  section: string;
  subSection: string;
  act: string;
  sectionContent: string;
  chapter: string;
  subChapter: string;
}

interface CrimeData {
  id: number;
  marker: string | null;
  district: string | null;
  thana: string;
  io: string;
  crimeNumber: string;
  section: string;
  incidentDate: string;
  firDate: string;
  totalAccused: number | null;
  totalArrested: number | null;
  totalLeft: number;
  dateOfArrest: string | null;
  stage: string;
  chargeSheetReadyDate: string | null;
  chargeSheetFileDate: string | null;
  primarySection: string;
  chargeType: string;
  act: string | null;
}

const InputSection = () => {
  const [formData, setFormData] = useState<FormData>({
    district: "",
    policeStation: "",
    crimeNumber: "",
    incidentDate: "",
    firDate: "",
    csReadyDate: "",
    csFiledDate: "",
    stage: "",
    totalAccused: "",
    arrested: "",
    section: "",
    subSection: "",
    act: "",
    sectionContent: "",
    chapter: "",
    subChapter: "",
  });

  const [maxId, setMaxId] = useState<number>(0);
  const [districts, setDistricts] = useState<{ label: string; value: string }[]>([]);
  const [policeStations, setPoliceStations] = useState<{ label: string; value: string }[]>([]);
  const [sections, setSections] = useState<{ label: string; value: string }[]>([]);
  const [subSections, setSubSections] = useState<{ label: string; value: string }[]>([]);
  const [acts, setActs] = useState<{ label: string; value: string }[]>([]);
  const [sectionsData, setSectionsData] = useState<SectionData[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const customStyles = {
    menu: (provided: any) => ({
      ...provided,
      maxHeight: '200px',
    }),
    menuList: (provided: any) => ({
      ...provided,
      maxHeight: '200px',
    })
  };

  // Fetch max ID and initial data
  useEffect(() => {
    const fetchInitialData = async () => {
      setLoading(true);
      try {
        const [districtResponse, actsResponse, crimeResponse] = await Promise.all([
          fetch("http://localhost:5000/api/table/db/thana"),
          fetch("http://localhost:5000/api/table/db/act"),
          fetch("http://localhost:5000/api/table/crime/all")
        ]);

        const [districtData, actsData, crimeData] = await Promise.all([
          districtResponse.json(),
          actsResponse.json(),
          crimeResponse.json()
        ]);

        // Set districts and acts data
        setDistricts(districtData.data.map((item: string) => ({ 
          label: item, 
          value: item 
        })));
        
        setActs(actsData.data.map((item: string) => ({ 
          label: item, 
          value: item 
        })));

        // Find maximum ID from crime data
        const currentMaxId = crimeData.reduce((max: number, item: CrimeData) => 
          item.id > max ? item.id : max, 0);
        setMaxId(currentMaxId);

      } catch (error) {
        console.error("Error fetching initial data:", error);
        alert("Failed to load initial data. Please refresh the page.");
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();
  }, []);

  // Fetch police stations when district changes
  useEffect(() => {
    const fetchPoliceStations = async () => {
      if (!formData.district) {
        setPoliceStations([]);
        return;
      }

      setLoading(true);
      try {
        const response = await fetch(`http://localhost:5000/api/table/db/${formData.district}`);
        const data = await response.json();
        setPoliceStations(data.data.map((item: string) => ({ 
          label: item, 
          value: item 
        })));
      } catch (error) {
        console.error("Error fetching police stations:", error);
        setPoliceStations([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPoliceStations();
  }, [formData.district]);

  // Fetch sections when act changes
  useEffect(() => {
    const fetchSectionData = async () => {
      if (!formData.act) {
        setSections([]);
        setSectionsData([]);
        setFormData(prev => ({
          ...prev,
          section: "",
          sectionContent: "",
          chapter: "",
          subChapter: "",
        }));
        return;
      }

      setLoading(true);
      try {
        const [sectionsResponse, allSectionsResponse] = await Promise.all([
          fetch(`http://localhost:5000/api/table/${formData.act}/sectionNumber`),
          fetch(`http://localhost:5000/api/table/${formData.act}/all`)
        ]);

        const sectionsData = await sectionsResponse.json();
        const allSectionsData = await allSectionsResponse.json();
        
        setSections(sectionsData.data.map((item: string) => ({ 
          label: item, 
          value: item 
        })));
        setSectionsData(allSectionsData);
      } catch (error) {
        console.error("Error fetching section data:", error);
        setSections([]);
        setSectionsData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchSectionData();
  }, [formData.act]);

  // Update section details when section changes
  useEffect(() => {
    if (formData.section && sectionsData.length > 0) {
      const sectionInfo = sectionsData.find(
        item => String(item.sectionNumber) === String(formData.section)
      );
      
      if (sectionInfo) {
        setFormData(prev => ({
          ...prev,
          sectionContent: sectionInfo.sectionContent,
          chapter: sectionInfo.chapterName,
          subChapter: sectionInfo.subChapter,
        }));
      }
    }
  }, [formData.section, sectionsData]);

  const handleSelectChange = (selectedOption: { value: string; label: string } | null, fieldName: keyof FormData) => {
    setFormData(prev => ({ ...prev, [fieldName]: selectedOption?.value || "" }));
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    
    if (name === 'crimeNumber') {
      const sanitizedValue = value.replace(/[^0-9/]/g, '');
      setFormData(prev => ({ ...prev, [name]: sanitizedValue }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    try {
      setLoading(true);
      const response = await fetch("http://localhost:5000/api/case-entry", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: maxId + 1,
          ...formData,
          thana: formData.policeStation,
          incidentDate: formData.incidentDate ? new Date(formData.incidentDate).toISOString() : null,
          dateOfArrest: formData.firDate ? new Date(formData.firDate).toISOString() : null,
          chargeSheetReadyDate: formData.csReadyDate ? new Date(formData.csReadyDate).toISOString() : null,
          chargeSheetFileDate: formData.csFiledDate ? new Date(formData.csFiledDate).toISOString() : null,
          totalAccused: parseInt(formData.totalAccused) || 0,
          totalArrested: parseInt(formData.arrested) || 0,
        }),
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.error || responseData.message || "Failed to submit case entry");
      }

      // Update maxId after successful submission
      setMaxId(prevMaxId => prevMaxId + 1);

      alert("Case entry submitted successfully!");
      setFormData({
        district: "",
        policeStation: "",
        crimeNumber: "",
        incidentDate: "",
        firDate: "",
        csReadyDate: "",
        csFiledDate: "",
        stage: "",
        totalAccused: "",
        arrested: "",
        section: "",
        subSection: "",
        act: "",
        sectionContent: "",
        chapter: "",
        subChapter: "",
      });
    } catch (err) {
      alert(`Failed to submit case entry: ${err instanceof Error ? err.message : "Unknown error occurred"}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10 flex items-center justify-center">
      <div className="max-w-4xl w-full bg-white shadow-md rounded-lg p-8">
        <h2 className="text-2xl font-semibold text-center text-gray-700 mb-6">Case Details Form</h2>
        {loading && (
          <div className="absolute inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* District */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">District</label>
            <Select
              options={districts}
              value={districts.find((option) => option.value === formData.district)}
              onChange={(selectedOption) => handleSelectChange(selectedOption, "district")}
              placeholder="Select District"
              className="mt-1"
              styles={customStyles}
            />
          </div>

          {/* Police Station */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Police Station</label>
            <Select
              options={policeStations}
              value={policeStations.find((option) => option.value === formData.policeStation)}
              onChange={(selectedOption) => handleSelectChange(selectedOption, "policeStation")}
              placeholder="Select Police Station"
              className="mt-1"
              isDisabled={!formData.district}
              styles={customStyles}
            />
          </div>

          {/* Crime Number */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Crime Number</label>
            <input
              type="text"
              name="crimeNumber"
              value={formData.crimeNumber}
              onChange={handleInputChange}
              placeholder="Enter Crime Number (e.g., 123/45)"
              pattern="[0-9/]*"
              className="mt-1 block w-full h-12 rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-3"
            />
          </div>

          {/* Dates Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Incident Date</label>
              <input
                type="date"
                name="incidentDate"
                value={formData.incidentDate}
                onChange={handleInputChange}
                className="mt-1 block w-full h-12 rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-3"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">FIR Date</label>
              <input
                type="date"
                name="firDate"
                value={formData.firDate}
                onChange={handleInputChange}
                className="mt-1 block w-full h-12 rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-3"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">CS Ready Date</label>
              <input
                type="date"
                name="csReadyDate"
                value={formData.csReadyDate}
                onChange={handleInputChange}
                className="mt-1 block w-full h-12 rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-3"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">CS Filed Date</label>
              <input
                type="date"
                name="csFiledDate"
                value={formData.csFiledDate}
                onChange={handleInputChange}
                className="mt-1 block w-full h-12 rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-3"
              />
            </div>
          </div>

          {/* Act and Section Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Act</label>
            <Select
              options={acts}
              value={acts.find((option) => option.value === formData.act)}
              onChange={(selectedOption) => handleSelectChange(selectedOption, "act")}
              placeholder="Select Act"
              className="mt-1"
              styles={customStyles}
            />
          </div>

          <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Section</label>
            <Select
              options={sections}
              value={sections.find((option) => option.value === formData.section)}
              onChange={(selectedOption) => handleSelectChange(selectedOption, "section")}
              placeholder="Select Section"
              className="mt-1"
              isDisabled={!formData.act}
              styles={customStyles}
            />
          </div>

          {/* Auto-populated fields */}
          {formData.section && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Chapter</label>
                <input
                  type="text"
                  value={formData.chapter}
                  readOnly
                  className="mt-1 block w-full h-12 rounded-md border border-gray-300 bg-gray-50 sm:text-sm px-3"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Section Content</label>
                <textarea
                  value={formData.sectionContent}
                  readOnly
                  className="mt-1 block w-full rounded-md border border-gray-300 bg-gray-50 sm:text-sm px-3 py-2"
                  rows={3}
                />
              </div>
            </>
          )}

          {/* Stage Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Stage</label>
            <input
              type="text"
              name="stage"
              value={formData.stage}
              onChange={handleInputChange}
              placeholder="Enter Stage"
              className="mt-1 block w-full h-12 rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-3"
            />
          </div>

          {/* Total Accused and Arrested */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Total Accused</label>
              <input
                type="number"
                name="totalAccused"
                value={formData.totalAccused}
                onChange={handleInputChange}
                placeholder="Enter Total Accused"
                min="0"
                className="mt-1 block w-full h-12 rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-3"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Arrested</label>
              <input
                type="number"
                name="arrested"
                value={formData.arrested}
                onChange={handleInputChange}
                placeholder="Enter Arrested"
                min="0"
                className="mt-1 block w-full h-12 rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-3"
              />
            </div>
          </div>

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              disabled={loading}
              className={`w-full h-12 ${
                loading 
                  ? 'bg-indigo-400 cursor-not-allowed' 
                  : 'bg-indigo-600 hover:bg-indigo-700'
              } text-white font-semibold py-2 px-4 rounded-md shadow focus:outline-none focus:ring-2 focus:ring-indigo-500`}
            >
              {loading ? 'Submitting...' : 'Submit'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default InputSection;