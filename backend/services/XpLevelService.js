// XP and Level service for ChartMaster Challenge
// This service handles XP calculation and level progression

class XpLevelService {
  // Constants for XP and level calculations
  static XP_PER_LEVEL = 100;
  static MAX_LEVEL = 50;
  
  /**
   * Calculate level details based on XP points
   * @param {number} xpPoints - Total XP points
   * @returns {Object} Level details
   */
  static calculateLevelDetails(xpPoints) {
    const level = Math.min(
      Math.floor(xpPoints / this.XP_PER_LEVEL) + 1,
      this.MAX_LEVEL
    );
    
    const xpForCurrentLevel = xpPoints % this.XP_PER_LEVEL;
    const progressPercentage = Math.round((xpForCurrentLevel / this.XP_PER_LEVEL) * 100);
    const xpToNextLevel = level < this.MAX_LEVEL ? this.XP_PER_LEVEL - xpForCurrentLevel : 0;
    
    return {
      level,
      xpForCurrentLevel,
      progressPercentage,
      xpToNextLevel,
      totalXp: xpPoints,
      isMaxLevel: level >= this.MAX_LEVEL
    };
  }
  
  /**
   * Calculate XP gained from a challenge completion
   * @param {Object} challengeResult - Challenge completion result
   * @returns {number} XP gained
   */
  static calculateXpGain(challengeResult) {
    const {
      score,
      accuracyPercentage,
      difficultyLevel,
      mode,
      isFirstAttempt
    } = challengeResult;
    
    // Base XP from score
    const baseXp = Math.round(score * 0.1);
    
    // Bonus XP for high accuracy
    let accuracyBonus = 0;
    if (accuracyPercentage >= 95) {
      accuracyBonus = 5;
    } else if (accuracyPercentage >= 85) {
      accuracyBonus = 3;
    } else if (accuracyPercentage >= 70) {
      accuracyBonus = 1;
    }
    
    // Difficulty bonus
    const difficultyBonus = {
      beginner: 0,
      intermediate: 2,
      advanced: 5
    }[difficultyLevel] || 0;
    
    // Mode bonus
    const modeBonus = mode === 'hard' ? 3 : 0;
    
    // First attempt bonus
    const firstAttemptBonus = isFirstAttempt ? 2 : 0;
    
    // Calculate total XP gain
    const totalXpGain = baseXp + accuracyBonus + difficultyBonus + modeBonus + firstAttemptBonus;
    
    return totalXpGain;
  }
  
  /**
   * Check if user has leveled up
   * @param {number} oldXp - Previous XP total
   * @param {number} newXp - New XP total
   * @returns {Object} Level up details
   */
  static checkLevelUp(oldXp, newXp) {
    const oldLevel = Math.floor(oldXp / this.XP_PER_LEVEL) + 1;
    const newLevel = Math.floor(newXp / this.XP_PER_LEVEL) + 1;
    
    const hasLeveledUp = newLevel > oldLevel;
    const levelsGained = newLevel - oldLevel;
    
    return {
      hasLeveledUp,
      levelsGained,
      oldLevel,
      newLevel
    };
  }
  
  /**
   * Get level-based rewards
   * @param {number} level - User level
   * @returns {Array} Rewards for the level
   */
  static getLevelRewards(level) {
    // Define rewards for specific levels
    const levelRewards = {
      5: [
        { type: 'feature_unlock', name: 'Strategy Comparison', description: 'Compare different strategies side by side' }
      ],
      10: [
        { type: 'feature_unlock', name: 'Advanced Chart Tools', description: 'Access to advanced drawing tools' }
      ],
      15: [
        { type: 'feature_unlock', name: 'Custom Challenges', description: 'Create your own custom challenges' }
      ],
      20: [
        { type: 'feature_unlock', name: 'Strategy Creation', description: 'Create and share your own strategies' }
      ],
      25: [
        { type: 'badge', id: 'level_master', name: 'Level Master', description: 'Reach level 25' }
      ],
      50: [
        { type: 'badge', id: 'trading_legend', name: 'Trading Legend', description: 'Reach the maximum level' }
      ]
    };
    
    return levelRewards[level] || [];
  }
  
  /**
   * Get level title based on level
   * @param {number} level - User level
   * @returns {string} Level title
   */
  static getLevelTitle(level) {
    if (level >= 50) return 'Trading Legend';
    if (level >= 40) return 'Trading Master';
    if (level >= 30) return 'Trading Expert';
    if (level >= 20) return 'Trading Professional';
    if (level >= 15) return 'Trading Adept';
    if (level >= 10) return 'Trading Enthusiast';
    if (level >= 5) return 'Trading Apprentice';
    return 'Trading Novice';
  }
}

module.exports = XpLevelService;
