import React, { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, Legend, Tooltip } from 'recharts';

const COLORS = ['#FF8042', '#00C49F'];

function Home() {
  const [transactions, setTransactions] = useState([]);
  const [incomeTotal, setIncomeTotal] = useState(0);
  const [expensesTotal, setExpensesTotal] = useState(0);

  const incomeURL = "https://expenses-ca578-default-rtdb.firebaseio.com/income.json";
  const expensesURL = "https://expenses-ca578-default-rtdb.firebaseio.com/expenses.json";

  useEffect(() => {
    fetchAllTransactions();
  }, []);

  const fetchAllTransactions = async () => {
    try {
      const [incomeRes, expensesRes] = await Promise.all([
        fetch(incomeURL),
        fetch(expensesURL),
      ]);
            
       const [incomeData, expensesData] = await Promise.all([
        incomeRes.json(),
        expensesRes.json(),
      ]);

      const incomeList = incomeData
        ? Object.entries(incomeData).map(([id, data]) => ({
            id,
            ...data,
            type: 'Income',
            amount: parseFloat(data.amount),
          }))
        : [];

      const expensesList = expensesData
        ? Object.entries(expensesData).map(([id, data]) => ({
            id,
            ...data,
            type: 'Expenses',
            amount: parseFloat(data.amount),
          }))
        : [];

      const combined = [...incomeList, ...expensesList].sort(
        (a, b) => new Date(b.date) - new Date(a.date)
      );

      const incomeSum = incomeList.reduce((sum, item) => sum + item.amount, 0);
      const expensesSum = expensesList.reduce((sum, item) => sum + item.amount, 0);

      setTransactions(combined);
      setIncomeTotal(incomeSum);
      setExpensesTotal(expensesSum);
    } catch (error) {
      console.error("Error fetching transactions:", error);
    }
  };

  const pieData = [
    { name: 'Expenses', value: expensesTotal },
    { name: 'Income', value: incomeTotal },
  ];

  const totalAmount = 0; 

  return (
    <div style={{ padding: '20px' }}>
      <h3>Income and Expenses</h3>

      <PieChart width={400} height={300}>
        <Pie
          data={pieData}
          cx="50%"
          cy="50%"
          outerRadius={100}
          label
          dataKey="value"
        >
          {pieData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
<h4 style={{ marginTop: '30px' }}>Total Income: ₹{incomeTotal.toFixed(2)}</h4>
<h4 style={{ marginTop: '10px' }}>Total Expenses: ₹{expensesTotal.toFixed(2)}</h4>

      <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '10px' }}>
        <thead>
          <tr style={{ backgroundColor: '#f2f2f2' }}>
            <th style={thStyle}>Date</th>
            <th style={thStyle}>Description</th>
            <th style={thStyle}>Type</th>
            <th style={thStyle}>Amount</th>
          </tr>
        </thead>
        <tbody>
          {transactions.length === 0 ? (
            <tr>
              <td colSpan="4" style={{ textAlign: 'center', padding: '10px' }}>
                No transactions found.
              </td>
            </tr>
          ) : (
            transactions.map((item) => (
              <tr key={item.id}>
                <td style={tdStyle}>{item.date}</td>
                <td style={tdStyle}>{item.description}</td>
                <td style={tdStyle}>{item.type}</td>
                <td style={tdStyle}>₹{item.amount.toFixed(2)}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

const thStyle = {
  border: '1px solid #ddd',
  padding: '8px',
  textAlign: 'left',
};

const tdStyle = {
  border: '1px solid #ddd',
  padding: '8px',
};

export default Home;
