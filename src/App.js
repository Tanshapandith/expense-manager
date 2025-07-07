import './App.css';
import { Routes, Route } from 'react-router-dom';
import Navbar from '../src/Components/Navbar';
import Sidebar from '../src/Components/Sidebar';

import Home from '../src/Page/Home';
import ExpensesList from './Page/Expenseslist';
import IncomeList from './Page/Incomelist';
import TransactionList from './Page/Transactionlist';

function App() {
  return (
    <div>
      <Navbar/>
      <div style={{ display: 'flex' }}>
        <Sidebar />
        <div style={{ padding: '20px', flexGrow: 1 }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/expenses-list" element={<ExpensesList />} />
            <Route path="/income-list" element={<IncomeList />} />
            <Route path="/transaction-list" element={<TransactionList />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}

export default App;

