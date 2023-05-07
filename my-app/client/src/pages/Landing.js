import About from "../components/About/About";
import Header from "../components/Header/Header";
import Menu from "../components/Menu/Menu";
import SearchBar from "../components/SearchBar/SearchBar";

function Landing() {
  return (
    <div>
      <Header />
      <About />
      <SearchBar />
      <Menu />
    </div>
  );
}

export default Landing;
