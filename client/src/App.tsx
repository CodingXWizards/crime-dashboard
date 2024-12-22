import { Routes, Route } from "react-router-dom";
import InputSection from "@/pages/InputSection";
import Home from "@/pages/home";

const App = () => {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/entry" element={<InputSection />} />
      </Routes>
    </div>
  );
};

export default App;
