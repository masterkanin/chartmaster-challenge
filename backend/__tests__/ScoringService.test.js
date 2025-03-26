import React from 'react';

// Mock test for the ScoringService
describe('ScoringService', () => {
  // Import the service
  const ScoringService = require('../services/ScoringService');
  
  test('calculateScore returns correct score for easy mode beginner challenge', () => {
    const params = {
      mode: 'easy',
      difficultyLevel: 'beginner',
      accuracyPercentage: 80,
      timeTaken: 45,
      isFirstAttempt: true
    };
    
    const result = ScoringService.calculateScore(params);
    
    // Check that the result has all expected properties
    expect(result).toHaveProperty('baseScore');
    expect(result).toHaveProperty('timeBonus');
    expect(result).toHaveProperty('firstAttemptBonus');
    expect(result).toHaveProperty('totalScore');
    expect(result).toHaveProperty('xpGained');
    expect(result).toHaveProperty('accuracyRating');
    
    // Check that the values are calculated correctly
    expect(result.baseScore).toBe(80); // 80 * 1.0 (beginner) * 1.0 (easy)
    expect(result.firstAttemptBonus).toBe(10);
    expect(result.timeBonus).toBeGreaterThan(0); // Should have time bonus for completing under 60s
    expect(result.accuracyRating).toBe('good');
  });
  
  test('calculateScore returns correct score for hard mode advanced challenge', () => {
    const params = {
      mode: 'hard',
      difficultyLevel: 'advanced',
      accuracyPercentage: 90,
      timeTaken: 100,
      isFirstAttempt: true
    };
    
    const result = ScoringService.calculateScore(params);
    
    // Check that the values are calculated correctly
    expect(result.baseScore).toBe(270); // 90 * 2.0 (advanced) * 1.5 (hard)
    expect(result.firstAttemptBonus).toBe(10);
    expect(result.accuracyRating).toBe('excellent');
  });
  
  test('calculateScore handles non-first attempts correctly', () => {
    const params = {
      mode: 'easy',
      difficultyLevel: 'beginner',
      accuracyPercentage: 80,
      timeTaken: 45,
      isFirstAttempt: false
    };
    
    const result = ScoringService.calculateScore(params);
    
    // Check that there's no first attempt bonus
    expect(result.firstAttemptBonus).toBe(0);
  });
  
  test('calculateLevel returns correct level information', () => {
    const xpPoints = 250;
    
    const result = ScoringService.calculateLevel(xpPoints);
    
    expect(result.level).toBe(3); // 250 / 100 = 2.5, floor + 1 = 3
    expect(result.xpForCurrentLevel).toBe(50); // 250 % 100 = 50
    expect(result.progressPercentage).toBe(50); // (50 / 100) * 100 = 50
    expect(result.xpToNextLevel).toBe(50); // 100 - 50 = 50
  });
});
