// Leaderboard service for ChartMaster Challenge
// This service handles leaderboard calculations and rankings

class LeaderboardService {
  /**
   * Generate global leaderboard
   * @param {Array} users - Array of users with their progress data
   * @param {Object} options - Leaderboard options
   * @param {string} options.sortBy - Sort field ('score', 'accuracy', 'challenges')
   * @param {string} options.timeRange - Time range ('all', 'week', 'month')
   * @param {number} options.limit - Maximum number of entries
   * @returns {Array} Sorted leaderboard entries
   */
  static generateGlobalLeaderboard(users, options = {}) {
    const { 
      sortBy = 'score', 
      timeRange = 'all',
      limit = 50 
    } = options;
    
    // Filter progress data by time range if needed
    const filteredUsers = users.map(user => {
      if (timeRange === 'all') {
        return user;
      }
      
      // Clone user to avoid modifying original
      const filteredUser = { ...user };
      
      // Filter progress by date
      const cutoffDate = this.getCutoffDate(timeRange);
      
      if (filteredUser.progress) {
        filteredUser.progress = filteredUser.progress.filter(
          entry => new Date(entry.completedAt) >= cutoffDate
        );
        
        // Recalculate stats based on filtered progress
        this.recalculateUserStats(filteredUser);
      }
      
      return filteredUser;
    });
    
    // Sort users based on selected criteria
    let sortedUsers;
    switch (sortBy) {
      case 'score':
        sortedUsers = filteredUsers.sort((a, b) => b.stats.totalScore - a.stats.totalScore);
        break;
      case 'accuracy':
        sortedUsers = filteredUsers.sort((a, b) => b.stats.averageAccuracy - a.stats.averageAccuracy);
        break;
      case 'challenges':
        sortedUsers = filteredUsers.sort((a, b) => b.stats.challengesCompleted - a.stats.challengesCompleted);
        break;
      default:
        sortedUsers = filteredUsers.sort((a, b) => b.stats.totalScore - a.stats.totalScore);
    }
    
    // Limit number of entries and format for display
    return sortedUsers.slice(0, limit).map((user, index) => ({
      rank: index + 1,
      userId: user._id,
      username: user.username,
      profileImage: user.profileImage,
      level: user.level,
      xpPoints: user.xpPoints,
      score: user.stats.totalScore,
      accuracy: user.stats.averageAccuracy,
      challengesCompleted: user.stats.challengesCompleted,
      badges: user.badges ? user.badges.length : 0
    }));
  }
  
  /**
   * Generate strategy-specific leaderboard
   * @param {Array} users - Array of users with their progress data
   * @param {string} strategyId - Strategy ID
   * @param {Object} options - Leaderboard options
   * @param {string} options.sortBy - Sort field ('score', 'accuracy', 'challenges')
   * @param {string} options.timeRange - Time range ('all', 'week', 'month')
   * @param {number} options.limit - Maximum number of entries
   * @returns {Array} Sorted leaderboard entries
   */
  static generateStrategyLeaderboard(users, strategyId, options = {}) {
    const { 
      sortBy = 'score', 
      timeRange = 'all',
      limit = 50 
    } = options;
    
    // Filter users who have progress in this strategy
    const filteredUsers = users.filter(user => {
      return user.progress && user.progress.some(entry => entry.challenge.strategy === strategyId);
    }).map(user => {
      // Clone user to avoid modifying original
      const filteredUser = { ...user };
      
      // Filter progress by strategy and time range
      const cutoffDate = this.getCutoffDate(timeRange);
      
      filteredUser.progress = filteredUser.progress.filter(
        entry => entry.challenge.strategy === strategyId && 
                (timeRange === 'all' || new Date(entry.completedAt) >= cutoffDate)
      );
      
      // Recalculate stats based on filtered progress
      this.recalculateUserStats(filteredUser);
      
      return filteredUser;
    });
    
    // Sort users based on selected criteria
    let sortedUsers;
    switch (sortBy) {
      case 'score':
        sortedUsers = filteredUsers.sort((a, b) => b.stats.totalScore - a.stats.totalScore);
        break;
      case 'accuracy':
        sortedUsers = filteredUsers.sort((a, b) => b.stats.averageAccuracy - a.stats.averageAccuracy);
        break;
      case 'challenges':
        sortedUsers = filteredUsers.sort((a, b) => b.stats.challengesCompleted - a.stats.challengesCompleted);
        break;
      default:
        sortedUsers = filteredUsers.sort((a, b) => b.stats.totalScore - a.stats.totalScore);
    }
    
    // Limit number of entries and format for display
    return sortedUsers.slice(0, limit).map((user, index) => ({
      rank: index + 1,
      userId: user._id,
      username: user.username,
      profileImage: user.profileImage,
      level: user.level,
      xpPoints: user.xpPoints,
      score: user.stats.totalScore,
      accuracy: user.stats.averageAccuracy,
      challengesCompleted: user.stats.challengesCompleted
    }));
  }
  
  /**
   * Get user's rank in global leaderboard
   * @param {string} userId - User ID
   * @param {Array} users - Array of users with their progress data
   * @param {Object} options - Leaderboard options
   * @returns {Object} User's rank information
   */
  static getUserGlobalRank(userId, users, options = {}) {
    const leaderboard = this.generateGlobalLeaderboard(users, options);
    const userRank = leaderboard.findIndex(entry => entry.userId === userId);
    
    if (userRank === -1) {
      return {
        found: false,
        rank: null,
        totalUsers: users.length
      };
    }
    
    return {
      found: true,
      rank: userRank + 1,
      totalUsers: users.length,
      percentile: Math.round(((users.length - (userRank + 1)) / users.length) * 100)
    };
  }
  
  /**
   * Get user's rank in strategy-specific leaderboard
   * @param {string} userId - User ID
   * @param {Array} users - Array of users with their progress data
   * @param {string} strategyId - Strategy ID
   * @param {Object} options - Leaderboard options
   * @returns {Object} User's rank information
   */
  static getUserStrategyRank(userId, users, strategyId, options = {}) {
    const leaderboard = this.generateStrategyLeaderboard(users, strategyId, options);
    const userRank = leaderboard.findIndex(entry => entry.userId === userId);
    
    // Count users who have attempted this strategy
    const usersWithStrategy = users.filter(user => {
      return user.progress && user.progress.some(entry => entry.challenge.strategy === strategyId);
    }).length;
    
    if (userRank === -1) {
      return {
        found: false,
        rank: null,
        totalUsers: usersWithStrategy
      };
    }
    
    return {
      found: true,
      rank: userRank + 1,
      totalUsers: usersWithStrategy,
      percentile: Math.round(((usersWithStrategy - (userRank + 1)) / usersWithStrategy) * 100)
    };
  }
  
  /**
   * Helper method to get cutoff date based on time range
   * @param {string} timeRange - Time range ('all', 'week', 'month')
   * @returns {Date} Cutoff date
   */
  static getCutoffDate(timeRange) {
    const now = new Date();
    
    switch (timeRange) {
      case 'week':
        return new Date(now.setDate(now.getDate() - 7));
      case 'month':
        return new Date(now.setMonth(now.getMonth() - 1));
      default:
        return new Date(0); // Beginning of time
    }
  }
  
  /**
   * Helper method to recalculate user stats based on filtered progress
   * @param {Object} user - User object with progress data
   */
  static recalculateUserStats(user) {
    if (!user.progress || user.progress.length === 0) {
      user.stats = {
        totalScore: 0,
        averageScore: 0,
        averageAccuracy: 0,
        challengesCompleted: 0,
        easyModeCompleted: 0,
        hardModeCompleted: 0
      };
      return;
    }
    
    const totalScore = user.progress.reduce((sum, entry) => sum + entry.score, 0);
    const averageScore = Math.round(totalScore / user.progress.length);
    const averageAccuracy = Math.round(
      user.progress.reduce((sum, entry) => sum + entry.accuracyPercentage, 0) / user.progress.length
    );
    const easyModeCompleted = user.progress.filter(entry => entry.mode === 'easy').length;
    const hardModeCompleted = user.progress.filter(entry => entry.mode === 'hard').length;
    
    user.stats = {
      totalScore,
      averageScore,
      averageAccuracy,
      challengesCompleted: user.progress.length,
      easyModeCompleted,
      hardModeCompleted
    };
  }
}

module.exports = LeaderboardService;
