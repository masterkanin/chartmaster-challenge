import React from 'react';
import Link from 'next/link';

const StrategyCard = ({ strategy }) => {
  const { id, name, description, difficultyLevel, imageUrl } = strategy;
  
  // Map difficulty level to appropriate color
  const difficultyColor = {
    beginner: 'bg-green-100 text-green-800',
    intermediate: 'bg-yellow-100 text-yellow-800',
    advanced: 'bg-red-100 text-red-800'
  };
  
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden challenge-card">
      <div className="h-40 bg-gray-200 relative">
        <img 
          src={imageUrl || '/images/default-strategy.jpg'} 
          alt={name}
          className="w-full h-full object-cover"
        />
        <div className={`absolute top-2 right-2 px-2 py-1 rounded-full text-xs font-medium ${difficultyColor[difficultyLevel]}`}>
          {difficultyLevel.charAt(0).toUpperCase() + difficultyLevel.slice(1)}
        </div>
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold mb-2">{name}</h3>
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">{description}</p>
        <Link href={`/strategies/${id}`}>
          <span className="text-blue-600 hover:text-blue-800 text-sm font-medium">
            View Strategy &rarr;
          </span>
        </Link>
      </div>
    </div>
  );
};

export default StrategyCard;
