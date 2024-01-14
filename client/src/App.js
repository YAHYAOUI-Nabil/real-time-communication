import { Routes, Route, HashRouter } from "react-router-dom";
import "./App.css";
import Authentication from "./pages/authentication";

function App() {
  return (
    <div className="App">
      <HashRouter>
        <Routes>
          <Route path="/" element={<Authentication />} />
        </Routes>
      </HashRouter>
    </div>
  );
}

export default App;
