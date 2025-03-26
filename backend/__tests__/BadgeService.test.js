import React from 'react';

// Mock test for the BadgeService
describe('BadgeService', () => {
  // Import the service
  const BadgeService = require('../services/BadgeService');
  
  test('initializeBadges returns an array of badge objects', () => {
    const badges = BadgeService.initializeBadges();
    
    // Check that badges is an array
    expect(Array.isArray(badges)).toBe(true);
    
    // Check that it contains badge objects
    expect(badges.length).toBeGreaterThan(0);
    
    // Check that each badge has the required properties
    badges.forEach(badge => {
      expect(badge).toHaveProperty('id');
      expect(badge).toHaveProperty('name');
      expect(badge).toHaveProperty('description');
      expect(badge).toHaveProperty('imageUrl');
      expect(badge).toHaveProperty('requirementType');
      expect(badge).toHaveProperty('requirementValue');
    });
  });
  
  test('awardBadges correctly identifies badges a user qualifies for', () => {
    // Mock user and stats
    const user = {
      badges: []
    };
    
    const userStats = {
      challengesCompleted: 10,
      totalScore: 2000,
      averageAccuracy: 75,
      averageTimeTaken: 50,
      strategyProgress: {
        'order_block': {
          completedCount: 6,
          averageAccuracy: 80
        }
      }
    };
    
    const newBadges = BadgeService.awardBadges(user, userStats);
    
    // Check that the user qualifies for the expected badges
    expect(newBadges.some(badge => badge.id === 'challenge_novice')).toBe(true);
    expect(newBadges.some(badge => badge.id === 'score_hunter')).toBe(true);
    expect(newBadges.some(badge => badge.id === 'accuracy_apprentice')).toBe(true);
    expect(newBadges.some(badge => badge.id === 'order_block_apprentice')).toBe(true);
    
    // Check that the user doesn't qualify for higher tier badges
    expect(newBadges.some(badge => badge.id === 'challenge_master')).toBe(false);
    expect(newBadges.some(badge => badge.id === 'accuracy_virtuoso')).toBe(false);
  });
  
  test('awardBadges does not award badges the user already has', () => {
    // Mock user with existing badges
    const user = {
      badges: [
        { id: 'challenge_novice' },
        { id: 'score_hunter' }
      ]
    };
    
    const userStats = {
      challengesCompleted: 10,
      totalScore: 2000,
      averageAccuracy: 75,
      averageTimeTaken: 50,
      strategyProgress: {}
    };
    
    const newBadges = BadgeService.awardBadges(user, userStats);
    
    // Check that the user doesn't get badges they already have
    expect(newBadges.some(badge => badge.id === 'challenge_novice')).toBe(false);
    expect(newBadges.some(badge => badge.id === 'score_hunter')).toBe(false);
    
    // But still gets badges they qualify for and don't have
    expect(newBadges.some(badge => badge.id === 'accuracy_apprentice')).toBe(true);
  });
  
  test('getBadgeById returns the correct badge', () => {
    const badge = BadgeService.getBadgeById('challenge_novice');
    
    expect(badge).not.toBeNull();
    expect(badge.id).toBe('challenge_novice');
    expect(badge.name).toBe('Challenge Novice');
  });
  
  test('getBadgeById returns null for non-existent badge', () => {
    const badge = BadgeService.getBadgeById('non_existent_badge');
    
    expect(badge).toBeNull();
  });
  
  test('getBadgesByCategory returns badges of the specified category', () => {
    const badges = BadgeService.getBadgesByCategory('accuracy_threshold');
    
    expect(badges.length).toBeGreaterThan(0);
    badges.forEach(badge => {
      expect(badge.requirementType).toBe('accuracy_threshold');
    });
  });
});
