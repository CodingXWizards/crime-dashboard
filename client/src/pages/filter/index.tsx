import { useEffect, useState } from "react";
import { Districts } from "./_components/districts";
import Graph from "./_components/graph";
import Header from "./_components/header";
import { useCrimeStore } from "@/store";
import useBnsStore from "@/store/useBnsStore";

const Filters = () => {
  const [selectedChapter, setSelectedChapter] = useState<string>("");
  const [selectedSubChapter, setSelectedSubChapter] = useState<string>("");
  const [selectedSection, setSelectedSection] = useState<string>("");
  const [selectedStage, setSelectedStage] = useState<string>("");
  const { fetchBnsList } = useBnsStore();
  const { fetchCrimeList } = useCrimeStore();

  useEffect(() => {
    fetchBnsList();
    fetchCrimeList();
  }, []);

  return (
    <main className="flex w-full">
      <Districts />
      <div className="basis-4/5">
        <Header
          selectedChapter={selectedChapter}
          selectedSection={selectedSection}
          selectedStage={selectedStage}
          selectedSubChapter={selectedSubChapter}
          setSelectedChapter={setSelectedChapter}
          setSelectedSection={setSelectedSection}
          setSelectedStage={setSelectedStage}
          setSelectedSubChapter={setSelectedSubChapter}
        />
        <Graph
          selectedChapter={selectedChapter}
          selectedSection={selectedSection}
          selectedStage={selectedStage}
          selectedSubChapter={selectedSubChapter}
        />
      </div>
    </main>
  );
};

export default Filters;
