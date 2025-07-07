import React, { useState, useEffect } from 'react';
import './Expenseslist.css';

function Expenseslist() {
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    category: 'Expenses',
    description: '',
    amount: ''
  });
  const [expenses, setExpenses] = useState([]);

  const firebaseURL = 'https://expenses-ca578-default-rtdb.firebaseio.com/expenses.json';

  useEffect(() => {
    fetchExpenses();
  }, []);

  const fetchExpenses = async () => {
    try {
      const response = await fetch(firebaseURL);
      const data = await response.json();
      if (data) {
        const loadedExpenses = Object.entries(data).map(([id, value]) => ({
          id,
          ...value,
        }));
        setExpenses(loadedExpenses);
      }
    } catch (error) {
      console.error('Error fetching expenses:', error);
    }
  };

  const handleOpen = () => setShowModal(true);

  const handleClose = () => {
    setShowModal(false);
    setFormData({
      date: new Date().toISOString().split('T')[0],
      category: 'Expenses',
      description: '',
      amount: ''
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      const response = await fetch(firebaseURL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        handleClose();
        fetchExpenses();
      } else {
        console.error('Failed to save data:', await response.text());
      }
    } catch (error) {
      console.error('Error saving data:', error);
    }
  };

  return (
    <div className="expenses-container">
      <h2>Expenses</h2>
      <button className="add-button" onClick={handleOpen}>Add Expense</button>

      <table className="expenses-table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Category</th>
            <th>Description</th>
            <th>Amount</th>
          </tr>
        </thead>
        <tbody>
          {expenses.length === 0 ? (
            <tr><td colSpan="4" className="no-data">No data found</td></tr>
          ) : (
            expenses.map((item) => (
              <tr key={item.id}>
                <td>{item.date}</td>
                <td>{item.category}</td>
                <td>{item.description}</td>
                <td>₹{item.amount}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Add Entry</h3>

            <label>Date</label>
            <input type="date" name="date" value={formData.date} onChange={handleChange} />

            <label>Category</label>
            <select name="category" value={formData.category} onChange={handleChange}>
              <option value="Expenses">Expenses</option>
              <option value="Income">Income</option>
            </select>

            <label>Description</label>
            <input type="text" name="description" value={formData.description} onChange={handleChange} />

            <label>Amount</label>
            <input type="number" name="amount" value={formData.amount} onChange={handleChange} />

            <div className="modal-buttons">
              <button onClick={handleSave}>Save</button>
              <button onClick={handleClose} className="cancel">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Expenseslist;
