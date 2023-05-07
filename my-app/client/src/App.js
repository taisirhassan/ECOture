import "./App.css";
import Landing from "./pages/Landing";
import SearchBar from "./components/SearchBar/SearchBar";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function App() {
  return (
    <Router>
      <Routes>
        <Route exact path="/" element={<SearchBar />} />
      </Routes>
    </Router>
  );
}

export default App;
