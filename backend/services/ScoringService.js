// Scoring algorithm for ChartMaster Challenge
// This service handles the calculation of scores, XP, and level progression

class ScoringService {
  // Constants for scoring calculations
  static DIFFICULTY_MULTIPLIERS = {
    beginner: 1.0,
    intermediate: 1.5,
    advanced: 2.0
  };
  
  static MODE_MULTIPLIERS = {
    easy: 1.0,
    hard: 1.5
  };
  
  static TIME_BONUS_THRESHOLD = {
    beginner: 60, // seconds
    intermediate: 90,
    advanced: 120
  };
  
  static ACCURACY_THRESHOLDS = {
    perfect: 95, // percentage
    excellent: 85,
    good: 70,
    average: 50
  };
  
  static XP_PER_SCORE_POINT = 0.1;
  static XP_PER_LEVEL = 100;
  
  /**
   * Calculate score for a challenge attempt
   * @param {Object} params - Scoring parameters
   * @param {string} params.mode - Challenge mode ('easy' or 'hard')
   * @param {string} params.difficultyLevel - Challenge difficulty ('beginner', 'intermediate', 'advanced')
   * @param {number} params.accuracyPercentage - Accuracy percentage (0-100)
   * @param {number} params.timeTaken - Time taken in seconds
   * @param {boolean} params.isFirstAttempt - Whether this is the first attempt at this challenge
   * @returns {Object} Score details
   */
  static calculateScore({
    mode,
    difficultyLevel,
    accuracyPercentage,
    timeTaken,
    isFirstAttempt = true
  }) {
    // Base score based on accuracy
    let baseScore = accuracyPercentage;
    
    // Apply difficulty multiplier
    const difficultyMultiplier = this.DIFFICULTY_MULTIPLIERS[difficultyLevel] || 1.0;
    baseScore *= difficultyMultiplier;
    
    // Apply mode multiplier
    const modeMultiplier = this.MODE_MULTIPLIERS[mode] || 1.0;
    baseScore *= modeMultiplier;
    
    // Calculate time bonus
    const timeThreshold = this.TIME_BONUS_THRESHOLD[difficultyLevel] || 60;
    let timeBonus = 0;
    
    if (timeTaken < timeThreshold) {
      // Bonus for completing faster than threshold
      const timeFactor = (timeThreshold - timeTaken) / timeThreshold;
      timeBonus = Math.round(20 * timeFactor);
    }
    
    // First attempt bonus
    const firstAttemptBonus = isFirstAttempt ? 10 : 0;
    
    // Calculate total score
    const totalScore = Math.round(baseScore) + timeBonus + firstAttemptBonus;
    
    // Calculate XP gained
    const xpGained = Math.round(totalScore * this.XP_PER_SCORE_POINT);
    
    // Determine accuracy rating
    let accuracyRating;
    if (accuracyPercentage >= this.ACCURACY_THRESHOLDS.perfect) {
      accuracyRating = 'perfect';
    } else if (accuracyPercentage >= this.ACCURACY_THRESHOLDS.excellent) {
      accuracyRating = 'excellent';
    } else if (accuracyPercentage >= this.ACCURACY_THRESHOLDS.good) {
      accuracyRating = 'good';
    } else if (accuracyPercentage >= this.ACCURACY_THRESHOLDS.average) {
      accuracyRating = 'average';
    } else {
      accuracyRating = 'needs_improvement';
    }
    
    return {
      baseScore: Math.round(baseScore),
      timeBonus,
      firstAttemptBonus,
      totalScore,
      xpGained,
      accuracyRating
    };
  }
  
  /**
   * Calculate user level based on XP
   * @param {number} xpPoints - Total XP points
   * @returns {Object} Level details
   */
  static calculateLevel(xpPoints) {
    const level = Math.floor(xpPoints / this.XP_PER_LEVEL) + 1;
    const xpForCurrentLevel = xpPoints % this.XP_PER_LEVEL;
    const progressPercentage = Math.round((xpForCurrentLevel / this.XP_PER_LEVEL) * 100);
    const xpToNextLevel = this.XP_PER_LEVEL - xpForCurrentLevel;
    
    return {
      level,
      xpForCurrentLevel,
      progressPercentage,
      xpToNextLevel
    };
  }
  
  /**
   * Check if user qualifies for any badges based on their progress
   * @param {Object} userStats - User statistics
   * @param {Array} availableBadges - Available badges in the system
   * @returns {Array} Badges that the user has newly qualified for
   */
  static checkBadgeQualifications(userStats, availableBadges) {
    const newlyQualifiedBadges = [];
    
    availableBadges.forEach(badge => {
      // Skip badges the user already has
      if (userStats.earnedBadges.includes(badge.id)) {
        return;
      }
      
      let qualified = false;
      
      switch (badge.requirementType) {
        case 'challenge_completion':
          qualified = userStats.challengesCompleted >= badge.requirementValue;
          break;
        case 'score_threshold':
          qualified = userStats.totalScore >= badge.requirementValue;
          break;
        case 'accuracy_threshold':
          qualified = userStats.averageAccuracy >= badge.requirementValue;
          break;
        case 'time_threshold':
          qualified = userStats.averageTimeTaken <= badge.requirementValue;
          break;
        case 'strategy_mastery':
          const strategyProgress = userStats.strategyProgress[badge.requirementValue.strategyId];
          qualified = strategyProgress && 
                     strategyProgress.completedCount >= badge.requirementValue.completedCount &&
                     strategyProgress.averageAccuracy >= badge.requirementValue.accuracy;
          break;
      }
      
      if (qualified) {
        newlyQualifiedBadges.push(badge);
      }
    });
    
    return newlyQualifiedBadges;
  }
}

module.exports = ScoringService;
