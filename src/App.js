import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage';
import DataSummaryPage from './pages/DataSummaryPage';
import { supabase } from './supabaseClient';
import './App.css';

const App = () => {
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStores = async () => {
      try {
        const { data, error } = await supabase
          .from('find_food')
          .select('*');

        if (error) throw error;

        setStores(data);
      } catch (error) {
        console.error('Error fetching stores:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStores();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<HomePage stores={stores} />} />
          <Route path="/data" element={<DataSummaryPage stores={stores} />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;