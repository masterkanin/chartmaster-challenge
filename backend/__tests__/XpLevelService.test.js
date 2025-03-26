import React from 'react';

// Mock test for the XpLevelService
describe('XpLevelService', () => {
  // Import the service
  const XpLevelService = require('../services/XpLevelService');
  
  test('calculateLevelDetails returns correct level information', () => {
    const xpPoints = 250;
    
    const result = XpLevelService.calculateLevelDetails(xpPoints);
    
    expect(result.level).toBe(3); // 250 / 100 = 2.5, floor + 1 = 3
    expect(result.xpForCurrentLevel).toBe(50); // 250 % 100 = 50
    expect(result.progressPercentage).toBe(50); // (50 / 100) * 100 = 50
    expect(result.xpToNextLevel).toBe(50); // 100 - 50 = 50
    expect(result.totalXp).toBe(250);
    expect(result.isMaxLevel).toBe(false);
  });
  
  test('calculateLevelDetails handles max level correctly', () => {
    const xpPoints = 5000; // Well above max level threshold
    
    const result = XpLevelService.calculateLevelDetails(xpPoints);
    
    expect(result.level).toBe(XpLevelService.MAX_LEVEL);
    expect(result.isMaxLevel).toBe(true);
    expect(result.xpToNextLevel).toBe(0); // No more levels to gain
  });
  
  test('calculateXpGain returns correct XP for challenge completion', () => {
    const challengeResult = {
      score: 100,
      accuracyPercentage: 90,
      difficultyLevel: 'intermediate',
      mode: 'hard',
      isFirstAttempt: true
    };
    
    const xpGained = XpLevelService.calculateXpGain(challengeResult);
    
    // Base XP from score: 100 * 0.1 = 10
    // Accuracy bonus for 90%: 3
    // Difficulty bonus for intermediate: 2
    // Mode bonus for hard: 3
    // First attempt bonus: 2
    // Total: 10 + 3 + 2 + 3 + 2 = 20
    expect(xpGained).toBe(20);
  });
  
  test('calculateXpGain handles non-first attempts correctly', () => {
    const challengeResult = {
      score: 100,
      accuracyPercentage: 90,
      difficultyLevel: 'intermediate',
      mode: 'hard',
      isFirstAttempt: false
    };
    
    const xpGained = XpLevelService.calculateXpGain(challengeResult);
    
    // Same as above but without first attempt bonus (2)
    // Total: 10 + 3 + 2 + 3 = 18
    expect(xpGained).toBe(18);
  });
  
  test('checkLevelUp correctly identifies level ups', () => {
    const oldXp = 95;
    const newXp = 105;
    
    const result = XpLevelService.checkLevelUp(oldXp, newXp);
    
    expect(result.hasLeveledUp).toBe(true);
    expect(result.levelsGained).toBe(1);
    expect(result.oldLevel).toBe(1);
    expect(result.newLevel).toBe(2);
  });
  
  test('checkLevelUp handles multiple level ups', () => {
    const oldXp = 95;
    const newXp = 215;
    
    const result = XpLevelService.checkLevelUp(oldXp, newXp);
    
    expect(result.hasLeveledUp).toBe(true);
    expect(result.levelsGained).toBe(2);
    expect(result.oldLevel).toBe(1);
    expect(result.newLevel).toBe(3);
  });
  
  test('checkLevelUp returns false when no level up occurs', () => {
    const oldXp = 50;
    const newXp = 95;
    
    const result = XpLevelService.checkLevelUp(oldXp, newXp);
    
    expect(result.hasLeveledUp).toBe(false);
    expect(result.levelsGained).toBe(0);
    expect(result.oldLevel).toBe(1);
    expect(result.newLevel).toBe(1);
  });
  
  test('getLevelRewards returns correct rewards for specific levels', () => {
    const level5Rewards = XpLevelService.getLevelRewards(5);
    const level10Rewards = XpLevelService.getLevelRewards(10);
    
    expect(level5Rewards.length).toBeGreaterThan(0);
    expect(level10Rewards.length).toBeGreaterThan(0);
    
    // Check level 5 rewards
    expect(level5Rewards[0].type).toBe('feature_unlock');
    expect(level5Rewards[0].name).toBe('Strategy Comparison');
    
    // Check level 10 rewards
    expect(level10Rewards[0].type).toBe('feature_unlock');
    expect(level10Rewards[0].name).toBe('Advanced Chart Tools');
  });
  
  test('getLevelTitle returns appropriate title for user level', () => {
    expect(XpLevelService.getLevelTitle(1)).toBe('Trading Novice');
    expect(XpLevelService.getLevelTitle(7)).toBe('Trading Apprentice');
    expect(XpLevelService.getLevelTitle(12)).toBe('Trading Enthusiast');
    expect(XpLevelService.getLevelTitle(18)).toBe('Trading Adept');
    expect(XpLevelService.getLevelTitle(25)).toBe('Trading Professional');
    expect(XpLevelService.getLevelTitle(35)).toBe('Trading Expert');
    expect(XpLevelService.getLevelTitle(45)).toBe('Trading Master');
    expect(XpLevelService.getLevelTitle(50)).toBe('Trading Legend');
  });
});
