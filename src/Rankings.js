import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Rankings = () => {
  const [rankings, setRankings] = useState([]);

  useEffect(() => {
    const storedRankings = JSON.parse(localStorage.getItem('wordchainRankings') || '[]');
    const sortedRankings = storedRankings.sort((a, b) => {
      if (a.time !== b.time) return a.time - b.time;
      return a.hints - b.hints;
    });
    setRankings(sortedRankings);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold mb-2">Wordchain Rankings</h1>
      </div>
      <Link to="/" className="mb-4 text-blue-500 hover:text-blue-700">Back to Game</Link>
      <table className="w-full max-w-2xl bg-white shadow-md rounded-lg overflow-hidden">
        <thead className="bg-gray-200">
          <tr>
            <th className="px-4 py-2">Rank</th>
            <th className="px-4 py-2">Name</th>
            <th className="px-4 py-2">Time (seconds)</th>
            <th className="px-4 py-2">Hints Used</th>
          </tr>
        </thead>
        <tbody>
          {rankings.map((rank, index) => (
            <tr key={index} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
              <td className="px-4 py-2 text-center">{index + 1}</td>
              <td className="px-4 py-2">{rank.name}</td>
              <td className="px-4 py-2 text-center">{rank.time}</td>
              <td className="px-4 py-2 text-center">{rank.hints}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Rankings;