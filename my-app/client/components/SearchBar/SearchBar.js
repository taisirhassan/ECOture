import React, {useState} from "react";
import "./SearchBar.css";

const SearchBar = () => {
  const [itemUrl, setItemUrl] = useState('');
  //const [search, setSearch] = useState(false);

  const onChange = event => {
    setItemUrl(event.target.value);
  }

  const onSearch = () => {
    //do stuff with itemUrl
  }
  
  return (
    <div className="search-container">
      <input
        type="text"
        placeholder="Search..."
        onChange={onChange}
        className="search-input"
      />
      <button className="search-button" onClick={onSearch}>
        Search
      </button>
      <ProductCard
        
      ></ProductCard>
    </div>
  );
}

export default SearchBar;
