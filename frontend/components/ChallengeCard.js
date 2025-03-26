import React from 'react';
import Link from 'next/link';

const ChallengeCard = ({ challenge }) => {
  const { id, title, description, difficultyLevel, mode, strategy } = challenge;
  
  // Map difficulty level to appropriate color
  const difficultyColor = {
    beginner: 'bg-green-100 text-green-800',
    intermediate: 'bg-yellow-100 text-yellow-800',
    advanced: 'bg-red-100 text-red-800'
  };
  
  // Map mode to appropriate color
  const modeColor = {
    easy: 'bg-blue-100 text-blue-800',
    hard: 'bg-purple-100 text-purple-800'
  };
  
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden challenge-card">
      <div className="h-40 bg-gray-200 relative">
        <img 
          src={challenge.chartUrl || '/images/default-chart.jpg'} 
          alt={title}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-2 left-2 flex space-x-2">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${difficultyColor[difficultyLevel]}`}>
            {difficultyLevel.charAt(0).toUpperCase() + difficultyLevel.slice(1)}
          </span>
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${modeColor[mode]}`}>
            {mode.charAt(0).toUpperCase() + mode.slice(1)} Mode
          </span>
        </div>
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold mb-1">{title}</h3>
        <p className="text-sm text-gray-500 mb-2">{strategy?.name || 'General Strategy'}</p>
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">{description}</p>
        <div className="flex justify-between items-center">
          <Link href={`/challenges/${id}`}>
            <span className="text-blue-600 hover:text-blue-800 text-sm font-medium">
              Start Challenge &rarr;
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ChallengeCard;
