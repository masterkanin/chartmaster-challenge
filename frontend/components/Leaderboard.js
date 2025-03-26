import React from 'react';

const Leaderboard = ({ leaderboardData, strategyFilter, timeFilter }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="bg-blue-600 text-white p-6">
        <h2 className="text-2xl font-bold">Leaderboard</h2>
        <p className="text-blue-200">
          {strategyFilter ? `${strategyFilter} Strategy` : 'Global'} 
          {timeFilter ? ` - ${timeFilter}` : ''}
        </p>
      </div>
      
      <div className="p-4">
        <div className="flex justify-between items-center mb-4">
          <div className="flex space-x-2">
            <select className="border rounded-md px-3 py-2 text-sm">
              <option value="">All Strategies</option>
              <option value="order-block">Order Block</option>
              <option value="fair-value-gap">Fair Value Gap</option>
              <option value="liquidity-sweep">Liquidity Sweep</option>
            </select>
            
            <select className="border rounded-md px-3 py-2 text-sm">
              <option value="">All Time</option>
              <option value="this-week">This Week</option>
              <option value="this-month">This Month</option>
            </select>
          </div>
          
          <div>
            <select className="border rounded-md px-3 py-2 text-sm">
              <option value="score">Score</option>
              <option value="accuracy">Accuracy</option>
              <option value="time">Time</option>
            </select>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="bg-gray-50 border-b">
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rank</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Score</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Accuracy</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Challenges</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Level</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {leaderboardData?.map((entry, index) => (
                <tr key={index} className={index < 3 ? 'bg-yellow-50' : ''}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className={`flex items-center justify-center w-6 h-6 rounded-full ${
                      index === 0 ? 'bg-yellow-400' :
                      index === 1 ? 'bg-gray-300' :
                      index === 2 ? 'bg-yellow-700' : 'bg-gray-100'
                    } text-xs font-bold`}>
                      {index + 1}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-8 w-8 rounded-full bg-gray-200 flex-shrink-0 mr-3">
                        <img 
                          src={entry.profileImage || '/images/default-avatar.jpg'} 
                          alt="" 
                          className="h-8 w-8 rounded-full"
                        />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">{entry.username}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-bold text-gray-900">{entry.score}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{entry.accuracy}%</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{entry.challengesCompleted}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                      Level {entry.level}
                    </div>
                  </td>
                </tr>
              ))}
              
              {!leaderboardData || leaderboardData.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-4 text-center text-sm text-gray-500">
                    No leaderboard data available
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;
