import { Routes, Route, HashRouter } from "react-router-dom";
import "./App.css";
import Authentication from "./pages/authentication";
import Chat from "./pages/chat";
import ValidateUser from "./pages/authentication/components/ValidateUser";
import RequiredAuth from "./components/RequiredAuth";

function App() {
  return (
    <div className="App">
      <HashRouter>
        <Routes>
          <Route path="/" element={<Authentication />} />
          <Route path="/validate-account" element={<ValidateUser />} />
          <Route path="/chat" element={<RequiredAuth Component={Chat} />} />
        </Routes>
      </HashRouter>
    </div>
  );
}

export default App;
