import "./App.css";
import About from "./components/About /About";
import Header from "./components/Header/Header";
import Menu from "./components/Menu/Menu";
import SearchBar from "./components/SearchBar/SearchBar";

function App() {
  return (
    <div>
      <Header />
      <About />
      <Menu />
      <SearchBar />
    </div>
  );
}

export default App;
