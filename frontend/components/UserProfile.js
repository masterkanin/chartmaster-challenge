import React, { useState } from 'react';

const UserProfile = ({ user, userStats }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    username: user?.username || '',
    email: user?.email || '',
    bio: user?.bio || '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // In a real implementation, this would call an API to update the user profile
    setIsEditing(false);
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="bg-blue-600 text-white p-6">
        <div className="flex items-center">
          <div className="w-20 h-20 bg-white rounded-full overflow-hidden mr-4">
            <img 
              src={user?.profileImage || '/images/default-avatar.jpg'} 
              alt="Profile" 
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <h2 className="text-2xl font-bold">{user?.username || 'User Profile'}</h2>
            <p className="text-blue-200">Member since {new Date(user?.createdAt || Date.now()).toLocaleDateString()}</p>
          </div>
          {!isEditing && (
            <button 
              className="ml-auto bg-white text-blue-600 px-4 py-2 rounded hover:bg-blue-50"
              onClick={() => setIsEditing(true)}
            >
              Edit Profile
            </button>
          )}
        </div>
      </div>
      
      <div className="p-6">
        {isEditing ? (
          <form onSubmit={handleSubmit}>
            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  rows="4"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                ></textarea>
              </div>
            </div>
            
            <div className="flex space-x-3">
              <button 
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Save Changes
              </button>
              <button 
                type="button"
                className="bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300"
                onClick={() => setIsEditing(false)}
              >
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-700 mb-1">Level</h3>
                <p className="text-2xl font-bold">{user?.level || 1}</p>
                <p className="text-sm text-gray-500">{user?.xpPoints || 0} XP</p>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-700 mb-1">Challenges Completed</h3>
                <p className="text-2xl font-bold">{userStats?.challengesCompleted || 0}</p>
                <p className="text-sm text-gray-500">
                  {userStats?.easyModeCompleted || 0} Easy / {userStats?.hardModeCompleted || 0} Hard
                </p>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-700 mb-1">Average Accuracy</h3>
                <p className="text-2xl font-bold">{userStats?.averageAccuracy || 0}%</p>
                <p className="text-sm text-gray-500">Across all challenges</p>
              </div>
            </div>
            
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-3">About</h3>
              <p className="text-gray-700">
                {user?.bio || 'No bio provided yet.'}
              </p>
            </div>
            
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-3">Strategy Proficiency</h3>
              {userStats?.strategyProficiency?.length > 0 ? (
                <div className="space-y-4">
                  {userStats.strategyProficiency.map((strategy, index) => (
                    <div key={index}>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium">{strategy.name}</span>
                        <span className="text-sm font-medium">{strategy.proficiency}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full" 
                          style={{ width: `${strategy.proficiency}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 italic">No strategy data available</p>
              )}
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-3">Achievements</h3>
              {userStats?.achievements?.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {userStats.achievements.map((achievement, index) => (
                    <div key={index} className="flex items-center p-3 bg-gray-50 rounded-md">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                        <span className="text-lg">🏆</span>
                      </div>
                      <div>
                        <p className="font-medium">{achievement.name}</p>
                        <p className="text-sm text-gray-600">{achievement.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 italic">No achievements yet</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserProfile;
