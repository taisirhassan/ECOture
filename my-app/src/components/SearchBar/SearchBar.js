import React from "react";

function SearchBar(props) {
  return (
    <div>
      <input type="text" placeholder="Search..." onChange={props.onChange} />
    </div>
  );
}

export default SearchBar;
