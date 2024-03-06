"use client";
import "./navbar.css";
import { useEffect, useState } from "react";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // document.addEventListener("keypress", (e) => {
    //   if (e.key == "`") {
    //     setTimeout(() => {
    //       toggleNavbar();
    //     }, 50);
    //   }
    // });
  }, []);

  const toggleNavbar = () => {
    setIsOpen((prevVisibility) => !prevVisibility);
  };
  const handleLinkRedirect = (e, link) => {
    e.preventDefault();
    window.location.href = `${link}`;
  };

  return (
    <>
      <div className={`navbar ${isOpen ? "open" : ""}`}>
        <button className="toggle-button" onClick={toggleNavbar}>
          ☰
        </button>

        {/* style={{display: isOpen ? 'block' : 'none'}} */}
        <nav className="navbar-content">
          <button
            className={"button-blue"}
            onClick={(e) => handleLinkRedirect(e, "/offer")}
          >
            Offers
          </button>
          <button
            className={"button-blue"}
            onClick={(e) => handleLinkRedirect(e, "/group")}
          >
            Groups
          </button>
          <button
            className={"button-blue"}
            onClick={(e) => handleLinkRedirect(e, "/product")}
          >
            Products
          </button>
        </nav>
      </div>
    </>
  );
};

export default Navbar;
