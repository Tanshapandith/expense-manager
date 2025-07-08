import React, { useEffect, useState } from "react";
import "./Transactionlist.css";

function Transactionlist() {
  const [transactions, setTransactions] = useState([]);
  const [editId, setEditId] = useState(null);
  const [editData, setEditData] = useState({ description: "", amount: "" });

  const incomeURL = 'https://expenses-ca578-default-rtdb.firebaseio.com/income';
  const expensesURL = 'https://expenses-ca578-default-rtdb.firebaseio.com/expenses';

  useEffect(() => {
    fetchAllTransactions();
  }, []);

  const fetchAllTransactions = async () => {
    try {
      const [incomeRes, expensesRes] = await Promise.all([
        fetch(`${incomeURL}.json`),
        fetch(`${expensesURL}.json`),
      ]);

      const [incomeData, expensesData] = await Promise.all([
        incomeRes.json(),
        expensesRes.json(),
      ]);

      const incomeList = incomeData
        ? Object.entries(incomeData).map(([id, data]) => ({
            id,
            ...data,
            type: "Income",
          }))
        : [];

      const expensesList = expensesData
        ? Object.entries(expensesData).map(([id, data]) => ({
            id,
            ...data,
            type: "Expenses",
          }))
        : [];

      const combined = [...incomeList, ...expensesList].sort(
        (a, b) => new Date(b.date) - new Date(a.date)
      );

      setTransactions(combined);
    } catch (error) {
      console.error("Error fetching transactions:", error);
    }
  };

  const handleDelete = async (id, type) => {
    const url = type === "Income" ? `${incomeURL}/${id}.json` : `${expensesURL}/${id}.json`;
    try {
      await fetch(url, { method: 'DELETE' });
      fetchAllTransactions();
    } catch (error) {
      console.error("Failed to delete:", error);
    }
  };

  const handleEdit = (item) => {
    setEditId(item.id);
    setEditData({ description: item.description, amount: item.amount });
  };

  const handleEditChange = (e) => {
    setEditData({ ...editData, [e.target.name]: e.target.value });
  };

  const handleEditSave = async (id, type) => {
    const url = type === "Income" ? `${incomeURL}/${id}.json` : `${expensesURL}/${id}.json`;
    try {
      await fetch(url, {
        method: 'PATCH', 
        body: JSON.stringify(editData),
        headers: { 'Content-Type': 'application/json' },
      });
      setEditId(null);
      setEditData({ description: "", amount: "" });
      fetchAllTransactions();
    } catch (error) {
      console.error("Error updating transaction:", error);
    }
  };

  return (
    <div className="table-container">
      <table className="transaction-table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Description</th>
            <th>Type</th>
            <th>Amount</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {transactions.length === 0 ? (
            <tr>
              <td colSpan="5" style={{ textAlign: "center" }}>
                No transactions found.
              </td>
            </tr>
          ) : (
            transactions.map((item) => (
              <tr key={item.id}>
                <td>{item.date}</td>
                <td>
                  {editId === item.id ? (
                    <input
                      type="text"
                      name="description"
                      value={editData.description}
                      onChange={handleEditChange}
                    />
                  ) : (
                    item.description
                  )}
                </td>
                <td>{item.type}</td>
                <td>
                  {editId === item.id ? (
                    <input
                      type="number"
                      name="amount"
                      value={editData.amount}
                      onChange={handleEditChange}
                    />
                  ) : (
                    `₹${item.amount}`
                  )}
                </td>
                <td>
                  {editId === item.id ? (
                    <button
                      className="action-btn save-btn"
                      onClick={() => handleEditSave(item.id, item.type)}
                    >
                      Save
                    </button>
                  ) : (
                    <button
                      className="action-btn edit-btn"
                      onClick={() => handleEdit(item)}
                    >
                      Edit
                    </button>
                  )}
                  <button
                    className="action-btn delete-btn"
                    onClick={() => handleDelete(item.id, item.type)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default Transactionlist;
