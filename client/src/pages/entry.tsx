import { DropDown } from "@/components/dropdown";
import { InputField } from "@/components/input-field";
import { FormData, SectionData } from "@/types/form-entry";
import { getData } from "@/utils/helper";
import { useEffect, useState } from "react";

const Entry = () => {
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
    act: "",
    sectionContent: "",
    chapter: "",
    subChapter: "",
  });

  const [districts, setDistricts] = useState<
    { label: string; value: string }[]
  >([]);
  const [policeStations, setPoliceStations] = useState<
    { label: string; value: string }[]
  >([]);
  const [sections, setSections] = useState<{ label: string; value: string }[]>(
    []
  );

  const [acts, setActs] = useState<{ label: string; value: string }[]>([]);
  const [sectionsData, setSectionsData] = useState<SectionData[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  // Fetch max ID and initial data
  useEffect(() => {
    const fetchAllData = async () => {
      setDistricts((await getData("thana")).result);
      setActs((await getData("act")).result);
      fetch("/api/sections")
        .then((res) => res.json())
        .then((data) => setSections(data));
    };
    fetchAllData();
  }, []);

  // Fetch police stations when district changes
  useEffect(() => {
    const fetchPoliceStation = async () => {
      if (formData.district) {
        setPoliceStations((await getData(formData.district)).result);
      } else {
        setPoliceStations([]);
      }
    };

    fetchPoliceStation();
  }, [formData.district]);

  // Fetch sections when act changes
  useEffect(() => {
    const fetchSectionData = async () => {
      if (!formData.act) {
        setSections([]);
        setSectionsData([]);
        setFormData((prev) => ({
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
          fetch(
            `http://localhost:5000/api/table/${formData.act}/sectionNumber`
          ),
          fetch(`http://localhost:5000/api/table/${formData.act}/all`),
        ]);

        const sectionsData = await sectionsResponse.json();
        const allSectionsData = await allSectionsResponse.json();

        setSections(
          sectionsData.data.map((item: string) => ({
            label: item,
            value: item,
          }))
        );

        setSections(
          sectionsData.data.map((item: string) => ({
            label: item,
            value: item,
          }))
        );
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
        (item) => String(item.sectionNumber) === String(formData.section)
      );

      if (sectionInfo) {
        setFormData((prev) => ({
          ...prev,
          sectionContent: sectionInfo.sectionContent,
          chapter: sectionInfo.chapterName,
          subChapter: sectionInfo.subChapter,
        }));
      }
    }
  }, [formData.section, sectionsData]);

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
          ...formData,
          thana: formData.policeStation,
          incidentDate: formData.incidentDate
            ? new Date(formData.incidentDate).toISOString()
            : null,
          dateOfArrest: formData.firDate
            ? new Date(formData.firDate).toISOString()
            : null,
          chargeSheetReadyDate: formData.csReadyDate
            ? new Date(formData.csReadyDate).toISOString()
            : null,
          chargeSheetFileDate: formData.csFiledDate
            ? new Date(formData.csFiledDate).toISOString()
            : null,
          totalAccused: parseInt(formData.totalAccused) || 0,
          totalArrested: parseInt(formData.arrested) || 0,
        }),
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(
          responseData.error ||
            responseData.message ||
            "Failed to submit case entry"
        );
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
        act: "",
        sectionContent: "",
        chapter: "",
        subChapter: "",
      });
    } catch (err) {
      alert(
        `Failed to submit case entry: ${
          err instanceof Error ? err.message : "Unknown error occurred"
        }`
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10 flex items-center justify-center">
      <div className="max-w-4xl w-full bg-white shadow-md rounded-lg p-8">
        <h2 className="text-2xl font-semibold text-center text-gray-700 mb-6">
          Case Details Form
        </h2>
        {loading && (
          <div className="inset-0 z-10 fixed top-0 bg-gray-500 bg-opacity-50 flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Dropdown for District */}
          <DropDown
            name="District"
            fieldName="district"
            data={districts}
            value={formData.district}
            formData={formData}
            setFormData={setFormData}
          />
          {/* Dropdown for Police Station */}
          <DropDown
            name="Police Station"
            fieldName="policeStation"
            disabled={!formData.district}
            data={policeStations}
            value={formData.policeStation}
            formData={formData}
            setFormData={setFormData}
          />
          {/* Text Input for Crime Number */}
          <InputField
            name="Crime Number"
            type="NUMBER"
            placeholder="Enter Crime Number (e.g., 123/45)"
            value={formData.crimeNumber}
            formData={formData}
            setFormData={setFormData}
          />

          {/* Dates Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputField
              name="Incident Date"
              value={formData.incidentDate}
              type="DATE"
              formData={formData}
              setFormData={setFormData}
            />
            <InputField
              name="FIR Date"
              value={formData.firDate}
              type="DATE"
              placeholder=""
              formData={formData}
              setFormData={setFormData}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputField
              name="CS Ready Date"
              value={formData.csReadyDate}
              type="DATE"
              formData={formData}
              setFormData={setFormData}
            />
            <InputField
              name="CS Filed Date"
              value={formData.csFiledDate}
              type="DATE"
              formData={formData}
              setFormData={setFormData}
            />
          </div>

          {/* Act and Section Selection */}
          <DropDown
            name="Act"
            data={acts}
            fieldName="act"
            value={formData.act}
            formData={formData}
            setFormData={setFormData}
          />
          <DropDown
            name="Section"
            data={sections}
            fieldName="section"
            value={formData.section}
            formData={formData}
            disabled={!formData.act}
            setFormData={setFormData}
          />

          {/* Auto-populated fields */}
          {formData.section && (
            <>
              <InputField
                name="Chapter"
                value={formData.chapter}
                formData={formData}
                setFormData={setFormData}
              />

              <InputField
                name="Section Content"
                value={formData.sectionContent}
                type="TEXTAREA"
                formData={formData}
                setFormData={setFormData}
              />
            </>
          )}

          {/* Text Inputs for Total Accused and Arrested */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputField
              name="Total Accused"
              value={formData.totalAccused}
              placeholder="Enter Total Accused"
              type="NUMBER"
              formData={formData}
              setFormData={setFormData}
            />
            <InputField
              name="Arrested"
              value={formData.arrested}
              placeholder="Enter Arrested"
              type="NUMBER"
              formData={formData}
              setFormData={setFormData}
            />
          </div>

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              disabled={loading}
              className={`w-full h-12 ${
                loading
                  ? "bg-indigo-400 cursor-not-allowed"
                  : "bg-indigo-600 hover:bg-indigo-700"
              } text-white font-semibold py-2 px-4 rounded-md shadow focus:outline-none focus:ring-2 focus:ring-indigo-500`}
            >
              {loading ? "Submitting..." : "Submit"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Entry;
