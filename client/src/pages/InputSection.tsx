import { useEffect, useState } from "react";
import Select from "react-select";

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

  // Fetch data from API
  useEffect(() => {
    fetch("/api/districts")
      .then((res) => res.json())
      .then((data) => setDistricts(data.map((item: string) => ({ label: item, value: item }))));

    fetch("/api/sections")
      .then((res) => res.json())
      .then((data) => setSections(data.map((item: string) => ({ label: item, value: item }))));

    fetch("/api/acts")
      .then((res) => res.json())
      .then((data) => setActs(data.map((item: string) => ({ label: item, value: item }))));
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
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    console.log("Submitted Data:", formData);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10 flex items-center justify-center">
      <div className="max-w-4xl w-full bg-white shadow-md rounded-lg p-8">
        <h2 className="text-2xl font-semibold text-center text-gray-700 mb-6">Case Details Form</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Searchable Dropdown for District */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">District</label>
            <Select
              options={districts}
              value={districts.find((option) => option.value === formData.district)}
              onChange={(selectedOption) => handleSelectChange(selectedOption, "district")}
              placeholder="Select District"
              className="mt-1"
            />
          </div>

          {/* Searchable Dropdown for Police Station */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Police Station</label>
            <Select
              options={policeStations}
              value={policeStations.find((option) => option.value === formData.policeStation)}
              onChange={(selectedOption) => handleSelectChange(selectedOption, "policeStation")}
              placeholder="Select Police Station"
              className="mt-1"
              isDisabled={!formData.district}
            />
          </div>

          {/* Text Input for Crime Number */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Crime Number</label>
            <input
              type="number"
              name="crimeNumber"
              value={formData.crimeNumber}
              onChange={handleInputChange}
              placeholder="Enter Crime Number"
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

          {/* Other Fields */}
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

          {/* Dropdown for Section */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Section</label>
            <Select
              options={sections}
              value={sections.find((option) => option.value === formData.section)}
              onChange={(selectedOption) => handleSelectChange(selectedOption, "section")}
              placeholder="Select Section"
              className="mt-1"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Total Accused</label>
            <input
              type="text"
              name="totalAccused"
              value={formData.totalAccused}
              onChange={handleInputChange}
              placeholder="Enter Total Accused"
              className="mt-1 block w-full h-12 rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-3"
            />
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
