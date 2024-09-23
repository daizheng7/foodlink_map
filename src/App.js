import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage';
import DataSummaryPage from './pages/DataSummary';
import './App.css';

const App = () => {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/summary" element={<DataSummaryPage />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;