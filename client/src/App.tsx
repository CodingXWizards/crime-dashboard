import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import InputSection from "./pages/InputSection";

const App = () => {
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/entry" element={<InputSection />} />
          <Route path="/" element={<div>Home Page</div>} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
