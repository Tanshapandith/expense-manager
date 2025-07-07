import React from 'react';

function Navbar() {
  return (
    <nav style={styles.nav}>
      <h1 style={styles.heading}>Expenses Manager</h1>
    </nav>
  );
}

const styles = {
  nav: {
    background: '#333',
    color: '#fff',
    padding: '1rem',
    textAlign: 'center',
  },
  heading: {
    margin: 0,
    fontSize: '24px',
  },
};

export default Navbar;
