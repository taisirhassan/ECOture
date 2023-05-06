import "./App.css";
import Header from "./components/Header/Header";
import About from "./components/About/About";
import Menu from "./components/Menu/Menu";
import SearchBar from "./components/SearchBar/SearchBar";

function App() {
  return (
    <div>
      <Header />
      <About />

      <SearchBar />
    </div>
  );
}

export default App;
