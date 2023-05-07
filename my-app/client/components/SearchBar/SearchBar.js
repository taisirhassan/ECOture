import React from "react";
import "./SearchBar.css";

function SearchBar(props) {
  return (
    <div className="search-container">
      <input
        type="text"
        placeholder="Search..."
        onChange={props.onChange}
        className="search-input"
      />
      <button className="search-button" onClick={props.onSearch}>
        Search
      </button>
    </div>
  );
}

export default SearchBar;
