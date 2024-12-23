import { Routes, Route } from "react-router-dom";
import Entry from "@/pages/entry";
import Home from "@/pages/home";
import Dashboard from "./pages/dashboard";

const App = () => {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/entry" element={<Entry />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </div>
  );
};

export default App;
