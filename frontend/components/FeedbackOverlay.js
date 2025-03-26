import React from 'react';

const FeedbackOverlay = ({ isCorrect, correctAnswer, userAnswer, score, explanation }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full">
        <div className={`text-center mb-4 ${isCorrect ? 'text-green-600' : 'text-red-600'}`}>
          <div className="text-5xl mb-2">
            {isCorrect ? '✓' : '✗'}
          </div>
          <h3 className="text-2xl font-bold">
            {isCorrect ? 'Correct!' : 'Incorrect'}
          </h3>
        </div>
        
        <div className="mb-4">
          <p className="text-gray-700 mb-2">
            <span className="font-semibold">Your answer:</span> {userAnswer}
          </p>
          {!isCorrect && (
            <p className="text-gray-700 mb-2">
              <span className="font-semibold">Correct answer:</span> {correctAnswer}
            </p>
          )}
          <p className="text-gray-700 mb-2">
            <span className="font-semibold">Score:</span> {score} points
          </p>
        </div>
        
        {explanation && (
          <div className="bg-gray-50 p-3 rounded-md mb-4">
            <p className="text-sm text-gray-700">{explanation}</p>
          </div>
        )}
        
        <div className="flex justify-center space-x-3">
          <button 
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            onClick={() => window.location.reload()}
          >
            Try Again
          </button>
          <button 
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            Next Challenge
          </button>
        </div>
      </div>
    </div>
  );
};

export default FeedbackOverlay;
