import useBnsStore from "@/store/useBnsStore";
import { useEffect } from "react";

const Home = () => {
  // const { fetchCrimeList, loading, crimeList } = useCrimeStore();

  const { fetchBnsList, loading, bnsList, error } = useBnsStore();

  useEffect(() => {
    fetchBnsList();
  }, [fetchBnsList]);

  return (
    <div>
      dhwi
      {loading ? <p>Loading...</p> : <div>{JSON.stringify(bnsList)}</div>}
    </div>
  );
};

export default Home;
