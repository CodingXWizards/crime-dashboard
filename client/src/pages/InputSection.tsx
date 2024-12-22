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
  });

  const [districts, setDistricts] = useState<{ label: string; value: string }[]>([]);
  const [policeStations, setPoliceStations] = useState<{ label: string; value: string }[]>([]);
  const [sections, setSections] = useState<{ label: string; value: string }[]>([]);
  const [subSections, setSubSections] = useState<{ label: string; value: string }[]>([]);
  const [acts, setActs] = useState<{ label: string; value: string }[]>([]);

  // Custom styles for react-select
  const customStyles = {
    menu: (provided: any) => ({
      ...provided,
      maxHeight: '200px', // Set maximum height for dropdown
    }),
    menuList: (provided: any) => ({
      ...provided,
      maxHeight: '200px', // Set maximum height for the scrollable area
    })
  };

  // Fetch data from API
  useEffect(() => {
    // Fetch districts
    fetch("http://localhost:5000/api/table/db/thana")
      .then((res) => res.json())
      .then((response: TableResponse) => {
        const districts = response.data;
        setDistricts(districts.map((item: string) => ({ 
          label: item, 
          value: item 
        })));
      })
      .catch((error) => {
        console.error("Error fetching districts:", error);
        setDistricts([]); 
      });

    // Fetch acts
    fetch("http://localhost:5000/api/table/db/act")
      .then((res) => res.json())
      .then((response: TableResponse) => {
        const acts = response.data;
        setActs(acts.map((item: string) => ({ 
          label: item, 
          value: item 
        })));
      })
      .catch((error) => {
        console.error("Error fetching acts:", error);
        setActs([]); 
      });

    // Fetch sections
    fetch("/api/sections")
      .then((res) => res.json())
      .then((data) => setSections(data.map((item: string) => ({ label: item, value: item }))));
  }, []);

  useEffect(() => {
    if (formData.district) {
      fetch(`/api/police-stations?district=${formData.district}`)
        .then((res) => res.json())
        .then((data) => setPoliceStations(data.map((item: string) => ({ label: item, value: item }))));
    } else {
      setPoliceStations([]);
    }
  }, [formData.district]);

  useEffect(() => {
    if (formData.section) {
      fetch(`/api/sub-sections?section=${formData.section}`)
        .then((res) => res.json())
        .then((data) => setSubSections(data.map((item: string) => ({ label: item, value: item }))));
    } else {
      setSubSections([]);
    }
  }, [formData.section]);

  const handleSelectChange = (selectedOption: { value: string; label: string } | null, fieldName: keyof FormData) => {
    setFormData({ ...formData, [fieldName]: selectedOption?.value || "" });
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    
    if (name === 'crimeNumber') {
      const sanitizedValue = value.replace(/[^0-9/]/g, '');
      setFormData({ ...formData, [name]: sanitizedValue });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    try {
      const response = await fetch("http://localhost:5000/api/case-entry", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
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
      });
    } catch (err) {
      alert(`Failed to submit case entry: ${err instanceof Error ? err.message : "Unknown error occurred"}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10 flex items-center justify-center">
      <div className="max-w-4xl w-full bg-white shadow-md rounded-lg p-8">
        <h2 className="text-2xl font-semibold text-center text-gray-700 mb-6">Case Details Form</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Dropdown for District */}
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

          {/* Dropdown for Police Station */}
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

          {/* Text Input for Crime Number */}
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

          {/* Date Inputs */}
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

          {/* Dropdowns for Section, Sub Section, and Act */}
          <div>
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
            <br />
            <label className="block text-sm font-medium text-gray-700 mb-1">Section</label>
            <Select
              options={sections}
              value={sections.find((option) => option.value === formData.section)}
              onChange={(selectedOption) => handleSelectChange(selectedOption, "section")}
              placeholder="Select Section"
              className="mt-1"
              styles={customStyles}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Sub Section</label>
            <Select
              options={subSections}
              value={subSections.find((option) => option.value === formData.subSection)}
              onChange={(selectedOption) => handleSelectChange(selectedOption, "subSection")}
              placeholder="Select Sub Section"
              className="mt-1"
              isDisabled={!formData.section}
              styles={customStyles}
            />
          </div>

          {/* Text Inputs for Total Accused and Arrested */}
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
              className="w-full h-12 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-md shadow focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default InputSection;