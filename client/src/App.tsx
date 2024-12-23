import { Routes, Route } from "react-router-dom";
import Entry from "@/pages/entry";
import Home from "@/pages/home";

const App = () => {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/entry" element={<Entry />} />
      </Routes>
    </div>
  );
};

export default App;
