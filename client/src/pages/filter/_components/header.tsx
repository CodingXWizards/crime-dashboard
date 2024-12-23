import React, { Dispatch, SetStateAction } from "react";
import useBnsStore from "@/store/useBnsStore";
import useCrimeStore from "@/store/useCrimeStore";

interface HeaderProps {
  selectedChapter: string;
  selectedSubChapter: string;
  selectedSection: string;
  selectedStage: string;
  setSelectedChapter: Dispatch<SetStateAction<string>>;
  setSelectedSubChapter: Dispatch<SetStateAction<string>>;
  setSelectedSection: Dispatch<SetStateAction<string>>;
  setSelectedStage: Dispatch<SetStateAction<string>>;
}

export const Header: React.FC<HeaderProps> = ({
  selectedChapter,
  selectedSection,
  selectedStage,
  selectedSubChapter,
  setSelectedChapter,
  setSelectedSection,
  setSelectedStage,
  setSelectedSubChapter,
}) => {
  const { bnsList } = useBnsStore();
  const { crimeList } = useCrimeStore();

  const chapters = [...new Set(bnsList.map((item) => item.chapterName))];

  const hasSubChapters = bnsList.filter((item) => item.chapterName === selectedChapter).some((item) => item.subChapter && item.subChapter.trim() !== "");

  const subChapters = [
    ...new Set(
      bnsList.filter((item) => item.chapterName === selectedChapter && item.subChapter && item.subChapter.trim() !== "").map((item) => item.subChapter)
    ),
  ];

  const sections = bnsList
    .filter((item) => {
      if (hasSubChapters) {
        return item.chapterName === selectedChapter && item.subChapter === selectedSubChapter;
      }
      return item.chapterName === selectedChapter;
    })
    .map((item) => ({
      number: item.sectionNumber,
      content: item.sectionContent,
    }));

  console.log(crimeList);
  const stages = crimeList ? [...new Set(crimeList.map((crime) => crime.stage))] : [];

  return (
    <div className="bg-white shadow-sm p-4 rounded">
      <div className="flex flex-col md:flex-row gap-3 md:gap-4">
        <div className="space-y-1 w-[200px]">
          <label htmlFor="chapter" className="block text-xs font-medium text-gray-700">
            Chapter
          </label>
          <select
            id="chapter"
            className="w-full px-2 py-1.5 text-sm bg-white border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            value={selectedChapter}
            onChange={(e) => {
              setSelectedChapter(e.target.value);
              setSelectedSubChapter("");
              setSelectedSection("");
            }}
          >
            <option value="">Select Chapter</option>
            {chapters.map((chapter) => (
              <option key={chapter} value={chapter}>
                {chapter}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-1 w-[200px]">
          <label htmlFor="subChapter" className="block text-xs font-medium text-gray-700">
            Sub Chapter
          </label>
          <select
            id="subChapter"
            className={`w-full px-2 py-1.5 text-sm bg-white border border-gray-300 rounded transition-colors
              ${!selectedChapter ? "bg-gray-50 cursor-not-allowed opacity-60" : "focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"}`}
            value={selectedSubChapter}
            onChange={(e) => {
              setSelectedSubChapter(e.target.value);
              setSelectedSection("");
            }}
            disabled={!selectedChapter}
          >
            <option value="">Select Sub Chapter</option>
            {hasSubChapters ? (
              subChapters.map((subChapter) => (
                <option key={subChapter} value={subChapter}>
                  {subChapter}
                </option>
              ))
            ) : (
              <option value="N/A">N/A</option>
            )}
          </select>
        </div>

        <div className="space-y-1 w-[200px]">
          <label htmlFor="section" className="block text-xs font-medium text-gray-700">
            Section
          </label>
          <select
            id="section"
            className={`w-full px-2 py-1.5 text-sm bg-white border border-gray-300 rounded transition-colors
              ${!selectedChapter ? "bg-gray-50 cursor-not-allowed opacity-60" : "focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"}`}
            value={selectedSection}
            onChange={(e) => setSelectedSection(e.target.value)}
            disabled={!selectedChapter || (hasSubChapters && !selectedSubChapter)}
          >
            <option value="">Select Section</option>
            {sections.map((section) => (
              <option key={section.number} value={section.number}>
                {section.number} - {section.content}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-1 w-[200px]">
          <label htmlFor="stage" className="block text-xs font-medium text-gray-700">
            Stage
          </label>
          <select
            id="stage"
            className="w-full px-2 py-1.5 text-sm bg-white border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            value={selectedStage}
            onChange={(e) => setSelectedStage(e.target.value)}
          >
            <option value="">Select Stage</option>
            {stages.map((stage) => (
              <option key={stage} value={stage}>
                {stage}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

export default Header;
