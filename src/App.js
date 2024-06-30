import React from 'react';
import { HashRouter as Router, Route, Routes } from 'react-router-dom';
import Wordchain from './Wordchain';
import Rankings from './Rankings';

function App() {
  return (
    <Router basename="/">
      <Routes>
        <Route path="/" element={<Wordchain />} />
        <Route path="/rankings" element={<Rankings />} />
      </Routes>
    </Router>
  );
}

export default App;