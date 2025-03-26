import React from 'react';
import Link from 'next/link';

const StrategyPathsVisualization = ({ strategies, userProgress }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-6">Strategy Paths</h2>
      
      <div className="space-y-8">
        {strategies?.map((strategy, index) => (
          <div key={index} className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                  <img 
                    src={strategy.imageUrl || '/images/default-strategy.jpg'} 
                    alt={strategy.name}
                    className="w-8 h-8"
                  />
                </div>
                <div>
                  <h3 className="font-bold text-lg">{strategy.name}</h3>
                  <p className="text-sm text-gray-600">{strategy.description}</p>
                </div>
              </div>
              
              <div className="text-right">
                <div className="text-sm font-medium text-gray-600 mb-1">
                  Progress: {userProgress?.[strategy.id]?.completedCount || 0}/{strategy.challengeCount || 0}
                </div>
                <div className="w-32 bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full" 
                    style={{ 
                      width: `${userProgress?.[strategy.id]?.completedCount 
                        ? (userProgress[strategy.id].completedCount / strategy.challengeCount) * 100 
                        : 0}%` 
                    }}
                  ></div>
                </div>
              </div>
            </div>
            
            <div className="relative">
              <div className="absolute top-1/2 left-0 right-0 h-1 bg-gray-200 -translate-y-1/2"></div>
              <div className="flex justify-between relative z-10">
                {Array.from({ length: strategy.challengeCount || 5 }).map((_, i) => {
                  const isCompleted = userProgress?.[strategy.id]?.completedChallenges?.includes(i);
                  const isCurrent = userProgress?.[strategy.id]?.completedCount === i;
                  
                  return (
                    <Link key={i} href={`/challenges/${strategy.id}-${i}`}>
                      <div className="flex flex-col items-center cursor-pointer">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center mb-2 ${
                          isCompleted 
                            ? 'bg-green-500 text-white' 
                            : isCurrent 
                              ? 'bg-blue-500 text-white' 
                              : 'bg-white border-2 border-gray-300'
                        }`}>
                          {isCompleted ? '✓' : i + 1}
                        </div>
                        <span className="text-xs font-medium">
                          {isCompleted ? 'Completed' : isCurrent ? 'Current' : 'Locked'}
                        </span>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
            
            <div className="mt-6 flex justify-end">
              <Link href={`/strategies/${strategy.id}`}>
                <span className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                  View All Challenges &rarr;
                </span>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StrategyPathsVisualization;
