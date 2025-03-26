import React from 'react';

const UserDashboard = ({ user, progress, badges }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="bg-blue-600 text-white p-6">
        <div className="flex items-center">
          <div className="w-16 h-16 bg-white rounded-full overflow-hidden mr-4">
            <img 
              src={user?.profileImage || '/images/default-avatar.jpg'} 
              alt="Profile" 
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <h2 className="text-2xl font-bold">{user?.username || 'User'}</h2>
            <p className="text-blue-200">Level {user?.level || 1}</p>
          </div>
        </div>
      </div>
      
      <div className="p-6">
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-3">Progress Overview</h3>
          <div className="bg-gray-100 h-4 rounded-full overflow-hidden">
            <div 
              className="bg-green-500 h-full" 
              style={{ width: `${user?.xpPoints ? (user.xpPoints % 100) : 0}%` }}
            ></div>
          </div>
          <div className="flex justify-between mt-1 text-sm text-gray-600">
            <span>Level {user?.level || 1}</span>
            <span>{user?.xpPoints || 0} XP</span>
            <span>Level {(user?.level || 1) + 1}</span>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-semibold text-blue-800 mb-1">Challenges Completed</h4>
            <p className="text-2xl font-bold">{progress?.completed || 0}</p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <h4 className="font-semibold text-green-800 mb-1">Average Score</h4>
            <p className="text-2xl font-bold">{progress?.averageScore || 0}</p>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg">
            <h4 className="font-semibold text-purple-800 mb-1">Badges Earned</h4>
            <p className="text-2xl font-bold">{badges?.length || 0}</p>
          </div>
        </div>
        
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-3">Recent Activity</h3>
          {progress?.recent?.length > 0 ? (
            <div className="space-y-3">
              {progress.recent.map((item, index) => (
                <div key={index} className="flex items-center p-3 bg-gray-50 rounded-md">
                  <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center mr-3">
                    {item.mode === 'easy' ? '📝' : '✏️'}
                  </div>
                  <div className="flex-grow">
                    <p className="font-medium">{item.challengeTitle}</p>
                    <p className="text-sm text-gray-600">{item.strategyName} • {new Date(item.completedAt).toLocaleDateString()}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-blue-600">{item.score}</p>
                    <p className="text-sm text-gray-600">{item.accuracyPercentage}% accuracy</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 italic">No recent activity</p>
          )}
        </div>
        
        <div>
          <h3 className="text-lg font-semibold mb-3">Badges</h3>
          {badges?.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {badges.map((badge, index) => (
                <div key={index} className="text-center">
                  <div className="w-16 h-16 mx-auto mb-2 bg-gray-100 rounded-full flex items-center justify-center">
                    <img 
                      src={badge.imageUrl} 
                      alt={badge.name} 
                      className="w-12 h-12"
                    />
                  </div>
                  <p className="text-sm font-medium">{badge.name}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 italic">No badges earned yet</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
