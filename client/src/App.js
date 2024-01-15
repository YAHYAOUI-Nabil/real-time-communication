import { Routes, Route, HashRouter } from "react-router-dom";
import "./App.css";
import Authentication from "./pages/authentication";
import ValidateUser from "./pages/authentication/components/ValidateUser";

function App() {
  return (
    <div className="App">
      <HashRouter>
        <Routes>
          <Route path="/" element={<Authentication />} />
          <Route path="/validate-account" element={<ValidateUser />} />
        </Routes>
      </HashRouter>
    </div>
  );
}

export default App;
