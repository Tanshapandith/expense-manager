import React from 'react';
import { Link } from 'react-router-dom';
import './Sidebar.css'; 

function Sidebar() {
  return (
    <div className="sidebar">
      <ul className="sidebar-list">
        <li><Link to="/" className="sidebar-link">Home</Link></li>
        <li><Link to="/expenses-list" className="sidebar-link">Expenses List</Link></li>
        <li><Link to="/income-list" className="sidebar-link">Income List</Link></li>
        <li><Link to="/transaction-list" className="sidebar-link">Transaction List</Link></li>
      </ul>
    </div>
  );
}

export default Sidebar;
