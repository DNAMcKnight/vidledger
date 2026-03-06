// import React from "react";
import { FiMenu, FiSearch } from "react-icons/fi";
import "./navbar.css";

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="left-section">
        <div className="menu-icon">
          <FiMenu />
        </div>
        <div className="youtube">YouTube</div>
      </div>

      <div className="search">
        <input type="text" placeholder="Search"></input>
        <div className="search-icon">
          <FiSearch />
        </div>
      </div>
      <div className="right-section">
        <div className="create-section">
          <div className="plus-icon">+</div>
          <div className="create">create</div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
