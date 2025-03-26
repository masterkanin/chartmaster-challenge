// Badge service for ChartMaster Challenge
// This service handles badge management and awarding

class BadgeService {
  /**
   * Initialize the badge system with predefined badges
   * @returns {Array} Array of predefined badges
   */
  static initializeBadges() {
    return [
      // Challenge completion badges
      {
        id: 'challenge_novice',
        name: 'Challenge Novice',
        description: 'Complete 5 challenges',
        imageUrl: '/images/badges/challenge_novice.png',
        requirementType: 'challenge_completion',
        requirementValue: 5
      },
      {
        id: 'challenge_adept',
        name: 'Challenge Adept',
        description: 'Complete 25 challenges',
        imageUrl: '/images/badges/challenge_adept.png',
        requirementType: 'challenge_completion',
        requirementValue: 25
      },
      {
        id: 'challenge_master',
        name: 'Challenge Master',
        description: 'Complete 100 challenges',
        imageUrl: '/images/badges/challenge_master.png',
        requirementType: 'challenge_completion',
        requirementValue: 100
      },
      
      // Score threshold badges
      {
        id: 'score_hunter',
        name: 'Score Hunter',
        description: 'Accumulate 1,000 total points',
        imageUrl: '/images/badges/score_hunter.png',
        requirementType: 'score_threshold',
        requirementValue: 1000
      },
      {
        id: 'score_achiever',
        name: 'Score Achiever',
        description: 'Accumulate 5,000 total points',
        imageUrl: '/images/badges/score_achiever.png',
        requirementType: 'score_threshold',
        requirementValue: 5000
      },
      {
        id: 'score_legend',
        name: 'Score Legend',
        description: 'Accumulate 20,000 total points',
        imageUrl: '/images/badges/score_legend.png',
        requirementType: 'score_threshold',
        requirementValue: 20000
      },
      
      // Accuracy badges
      {
        id: 'accuracy_apprentice',
        name: 'Accuracy Apprentice',
        description: 'Achieve 70% average accuracy',
        imageUrl: '/images/badges/accuracy_apprentice.png',
        requirementType: 'accuracy_threshold',
        requirementValue: 70
      },
      {
        id: 'accuracy_expert',
        name: 'Accuracy Expert',
        description: 'Achieve 85% average accuracy',
        imageUrl: '/images/badges/accuracy_expert.png',
        requirementType: 'accuracy_threshold',
        requirementValue: 85
      },
      {
        id: 'accuracy_virtuoso',
        name: 'Accuracy Virtuoso',
        description: 'Achieve 95% average accuracy',
        imageUrl: '/images/badges/accuracy_virtuoso.png',
        requirementType: 'accuracy_threshold',
        requirementValue: 95
      },
      
      // Speed badges
      {
        id: 'speed_thinker',
        name: 'Speed Thinker',
        description: 'Average completion time under 60 seconds',
        imageUrl: '/images/badges/speed_thinker.png',
        requirementType: 'time_threshold',
        requirementValue: 60
      },
      {
        id: 'speed_analyzer',
        name: 'Speed Analyzer',
        description: 'Average completion time under 45 seconds',
        imageUrl: '/images/badges/speed_analyzer.png',
        requirementType: 'time_threshold',
        requirementValue: 45
      },
      {
        id: 'speed_prodigy',
        name: 'Speed Prodigy',
        description: 'Average completion time under 30 seconds',
        imageUrl: '/images/badges/speed_prodigy.png',
        requirementType: 'time_threshold',
        requirementValue: 30
      },
      
      // Strategy mastery badges
      {
        id: 'order_block_apprentice',
        name: 'Order Block Apprentice',
        description: 'Complete 5 Order Block challenges with 70% accuracy',
        imageUrl: '/images/badges/order_block_apprentice.png',
        requirementType: 'strategy_mastery',
        requirementValue: {
          strategyId: 'order_block',
          completedCount: 5,
          accuracy: 70
        }
      },
      {
        id: 'order_block_master',
        name: 'Order Block Master',
        description: 'Complete 15 Order Block challenges with 85% accuracy',
        imageUrl: '/images/badges/order_block_master.png',
        requirementType: 'strategy_mastery',
        requirementValue: {
          strategyId: 'order_block',
          completedCount: 15,
          accuracy: 85
        }
      },
      {
        id: 'fvg_apprentice',
        name: 'FVG Apprentice',
        description: 'Complete 5 Fair Value Gap challenges with 70% accuracy',
        imageUrl: '/images/badges/fvg_apprentice.png',
        requirementType: 'strategy_mastery',
        requirementValue: {
          strategyId: 'fair_value_gap',
          completedCount: 5,
          accuracy: 70
        }
      },
      {
        id: 'fvg_master',
        name: 'FVG Master',
        description: 'Complete 15 Fair Value Gap challenges with 85% accuracy',
        imageUrl: '/images/badges/fvg_master.png',
        requirementType: 'strategy_mastery',
        requirementValue: {
          strategyId: 'fair_value_gap',
          completedCount: 15,
          accuracy: 85
        }
      },
      {
        id: 'liquidity_apprentice',
        name: 'Liquidity Apprentice',
        description: 'Complete 5 Liquidity Sweep challenges with 70% accuracy',
        imageUrl: '/images/badges/liquidity_apprentice.png',
        requirementType: 'strategy_mastery',
        requirementValue: {
          strategyId: 'liquidity_sweep',
          completedCount: 5,
          accuracy: 70
        }
      },
      {
        id: 'liquidity_master',
        name: 'Liquidity Master',
        description: 'Complete 15 Liquidity Sweep challenges with 85% accuracy',
        imageUrl: '/images/badges/liquidity_master.png',
        requirementType: 'strategy_mastery',
        requirementValue: {
          strategyId: 'liquidity_sweep',
          completedCount: 15,
          accuracy: 85
        }
      }
    ];
  }
  
  /**
   * Award badges to a user based on their progress
   * @param {Object} user - User object
   * @param {Object} userStats - User statistics
   * @returns {Array} Newly awarded badges
   */
  static awardBadges(user, userStats) {
    const availableBadges = this.initializeBadges();
    const newlyQualifiedBadges = [];
    
    availableBadges.forEach(badge => {
      // Skip badges the user already has
      if (user.badges.some(userBadge => userBadge.id === badge.id)) {
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
  
  /**
   * Get badge details by ID
   * @param {string} badgeId - Badge ID
   * @returns {Object|null} Badge details or null if not found
   */
  static getBadgeById(badgeId) {
    const badges = this.initializeBadges();
    return badges.find(badge => badge.id === badgeId) || null;
  }
  
  /**
   * Get all badges for a specific category
   * @param {string} category - Badge category (e.g., 'challenge_completion', 'score_threshold')
   * @returns {Array} Badges in the specified category
   */
  static getBadgesByCategory(category) {
    const badges = this.initializeBadges();
    return badges.filter(badge => badge.requirementType === category);
  }
  
  /**
   * Get all badges for a specific strategy
   * @param {string} strategyId - Strategy ID
   * @returns {Array} Badges for the specified strategy
   */
  static getBadgesByStrategy(strategyId) {
    const badges = this.initializeBadges();
    return badges.filter(
      badge => badge.requirementType === 'strategy_mastery' && 
               badge.requirementValue.strategyId === strategyId
    );
  }
}

module.exports = BadgeService;
