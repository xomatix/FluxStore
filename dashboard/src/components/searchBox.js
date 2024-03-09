import React, { useEffect, useState, useRef } from "react";

const SearchBox = () => {
  const [showInput, setShowInput] = useState(false);
  const [filter, setFilter] = useState("");
  const inputRef = useRef();

  const handleKeyPress = (event) => {
    if (event.key === "-") {
      setShowInput(true);
      setTimeout(() => {
        setFilter("");
        inputRef.current.focus();
      }, 50);
      window.removeEventListener("keydown", handleKeyPress);
    }
  };

  useEffect(() => {
    window.addEventListener("keydown", handleKeyPress);

    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, []);

  const handleFilter = (e) => {
    if (e.key === "Enter") {
      var items = document.getElementsByClassName("search-item");
      let f = filter;

      for (let i = 0; i < items.length; i++) {
        var isVisible = false;

        for (let j = 0; j < items[i].children.length; j++) {
          //   console.log(items[i].children[j].innerHTML);
          if (
            items[i].children[j].innerHTML
              .toLowerCase()
              .indexOf(f.toLowerCase()) != -1
          ) {
            isVisible = true;
          }
        }
        items[i].classList.toggle("hidden-item", !isVisible);
      }
      setFilter("");
      setShowInput(false);
      window.addEventListener("keydown", handleKeyPress);
    }
  };

  const handleChange = (e) => {
    setFilter(e.target.value);
  };

  return (
    <>
      <div className="search-box">
        {showInput ? (
          <input
            className=""
            ref={inputRef}
            value={filter}
            type="text"
            onChange={handleChange}
            onKeyDown={handleFilter}
          />
        ) : null}
      </div>
    </>
  );
};

export default SearchBox;
