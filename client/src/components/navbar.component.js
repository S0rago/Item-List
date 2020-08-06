import React, { Component } from 'react';
import { Link } from 'react-router-dom';

export default class Navbar extends Component {

  render() {
    return (
      <nav className="navbar navbar-dark bg-dark navbar-expand-lg">
        <Link to="/" className="navbar-brand">ItemList</Link>
        <div className="collpase navbar-collapse">
        <ul className="navbar-nav mr-auto">
          <li className="navbar-item">
          <Link to="/" className="nav-link">Items</Link>
          </li>
          <li className="navbar-item">
          <Link to="/additem" className="nav-link">Add item</Link>
          </li>
          <li className="navbar-item">
          <Link to="/addkiller" className="nav-link">Add killer</Link>
          </li>
        </ul>
        </div>
      </nav>
    );
  }
}