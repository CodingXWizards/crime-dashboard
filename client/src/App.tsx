import { Routes, Route } from "react-router-dom";
import InputSection from "@/pages/InputSection";
import Home from "@/pages/home";
import Header from "@/pages/dashboard/Header";

const App = () => {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/entry" element={<InputSection />} />
        <Route path="/dashboard" element={<Header />} />
      </Routes>
    </div>
  );
};

export default App;
