import React from 'react';

// Mock test for the LeaderboardService
describe('LeaderboardService', () => {
  // Import the service
  const LeaderboardService = require('../services/LeaderboardService');
  
  // Mock user data for testing
  const mockUsers = [
    {
      _id: 'user1',
      username: 'testuser1',
      profileImage: '/images/avatar1.jpg',
      level: 5,
      xpPoints: 450,
      progress: [
        {
          challenge: { strategy: 'order_block' },
          score: 100,
          accuracyPercentage: 85,
          completedAt: new Date('2025-03-20')
        },
        {
          challenge: { strategy: 'fair_value_gap' },
          score: 90,
          accuracyPercentage: 80,
          completedAt: new Date('2025-03-22')
        }
      ],
      stats: {
        totalScore: 190,
        averageScore: 95,
        averageAccuracy: 82.5,
        challengesCompleted: 2,
        easyModeCompleted: 1,
        hardModeCompleted: 1
      }
    },
    {
      _id: 'user2',
      username: 'testuser2',
      profileImage: '/images/avatar2.jpg',
      level: 3,
      xpPoints: 250,
      progress: [
        {
          challenge: { strategy: 'order_block' },
          score: 80,
          accuracyPercentage: 75,
          completedAt: new Date('2025-03-15')
        }
      ],
      stats: {
        totalScore: 80,
        averageScore: 80,
        averageAccuracy: 75,
        challengesCompleted: 1,
        easyModeCompleted: 1,
        hardModeCompleted: 0
      }
    },
    {
      _id: 'user3',
      username: 'testuser3',
      profileImage: '/images/avatar3.jpg',
      level: 8,
      xpPoints: 750,
      progress: [
        {
          challenge: { strategy: 'order_block' },
          score: 120,
          accuracyPercentage: 95,
          completedAt: new Date('2025-03-25')
        },
        {
          challenge: { strategy: 'liquidity_sweep' },
          score: 110,
          accuracyPercentage: 90,
          completedAt: new Date('2025-03-26')
        },
        {
          challenge: { strategy: 'fair_value_gap' },
          score: 100,
          accuracyPercentage: 85,
          completedAt: new Date('2025-03-24')
        }
      ],
      stats: {
        totalScore: 330,
        averageScore: 110,
        averageAccuracy: 90,
        challengesCompleted: 3,
        easyModeCompleted: 1,
        hardModeCompleted: 2
      }
    }
  ];
  
  test('generateGlobalLeaderboard returns sorted leaderboard by score', () => {
    const leaderboard = LeaderboardService.generateGlobalLeaderboard(mockUsers, { sortBy: 'score' });
    
    expect(leaderboard.length).toBe(3);
    expect(leaderboard[0].userId).toBe('user3'); // Highest score
    expect(leaderboard[1].userId).toBe('user1');
    expect(leaderboard[2].userId).toBe('user2'); // Lowest score
  });
  
  test('generateGlobalLeaderboard returns sorted leaderboard by accuracy', () => {
    const leaderboard = LeaderboardService.generateGlobalLeaderboard(mockUsers, { sortBy: 'accuracy' });
    
    expect(leaderboard.length).toBe(3);
    expect(leaderboard[0].userId).toBe('user3'); // Highest accuracy
    expect(leaderboard[1].userId).toBe('user1');
    expect(leaderboard[2].userId).toBe('user2'); // Lowest accuracy
  });
  
  test('generateGlobalLeaderboard returns sorted leaderboard by challenges completed', () => {
    const leaderboard = LeaderboardService.generateGlobalLeaderboard(mockUsers, { sortBy: 'challenges' });
    
    expect(leaderboard.length).toBe(3);
    expect(leaderboard[0].userId).toBe('user3'); // Most challenges
    expect(leaderboard[1].userId).toBe('user1');
    expect(leaderboard[2].userId).toBe('user2'); // Fewest challenges
  });
  
  test('generateGlobalLeaderboard respects limit parameter', () => {
    const leaderboard = LeaderboardService.generateGlobalLeaderboard(mockUsers, { limit: 2 });
    
    expect(leaderboard.length).toBe(2);
    expect(leaderboard[0].userId).toBe('user3');
    expect(leaderboard[1].userId).toBe('user1');
  });
  
  test('generateStrategyLeaderboard returns leaderboard for specific strategy', () => {
    const leaderboard = LeaderboardService.generateStrategyLeaderboard(mockUsers, 'order_block');
    
    expect(leaderboard.length).toBe(3); // All users have order_block progress
    expect(leaderboard[0].userId).toBe('user3'); // Highest score in order_block
  });
  
  test('getUserGlobalRank returns correct rank information', () => {
    const rankInfo = LeaderboardService.getUserGlobalRank('user1', mockUsers);
    
    expect(rankInfo.found).toBe(true);
    expect(rankInfo.rank).toBe(2); // Second place
    expect(rankInfo.totalUsers).toBe(3);
    expect(rankInfo.percentile).toBe(33); // Top 33%
  });
  
  test('getUserGlobalRank handles user not in leaderboard', () => {
    const rankInfo = LeaderboardService.getUserGlobalRank('nonexistent', mockUsers);
    
    expect(rankInfo.found).toBe(false);
    expect(rankInfo.rank).toBeNull();
    expect(rankInfo.totalUsers).toBe(3);
  });
  
  test('getCutoffDate returns correct date for time ranges', () => {
    const now = new Date('2025-03-26');
    const originalDateNow = Date.now;
    global.Date.now = jest.fn(() => now.getTime());
    
    const weekCutoff = LeaderboardService.getCutoffDate('week');
    const monthCutoff = LeaderboardService.getCutoffDate('month');
    const allTimeCutoff = LeaderboardService.getCutoffDate('all');
    
    expect(weekCutoff.getDate()).toBe(19); // 7 days before the 26th
    expect(monthCutoff.getMonth()).toBe(2); // March (0-indexed)
    expect(allTimeCutoff.getFullYear()).toBe(1970); // Beginning of time
    
    // Restore original Date.now
    global.Date.now = originalDateNow;
  });
});
