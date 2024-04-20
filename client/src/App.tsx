import Dashboard from "./assets/pages/Dashboard/Dashboard";
import Register from "./assets/pages/Register/Register";
import { Routes, Route } from "react-router-dom";
function App() {
  return (
    <div>
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </div>
  );
}

export default App;
