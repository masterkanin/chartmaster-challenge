import React, { useState, useEffect } from 'react';
import TradingViewWidget from './TradingViewWidget';

const EasyModeChallenge = ({
  challenge,
  onSubmit,
  onComplete
}) => {
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [startTime, setStartTime] = useState(null);
  
  useEffect(() => {
    // Record start time when component mounts
    setStartTime(Date.now());
  }, []);
  
  const handleAnswerSelect = (index) => {
    setSelectedAnswer(index);
  };
  
  const handleSubmit = () => {
    if (selectedAnswer === null) return;
    
    const endTime = Date.now();
    const timeTaken = Math.round((endTime - startTime) / 1000); // in seconds
    
    // Check if answer is correct
    const isCorrect = selectedAnswer === challenge.correctAnswerData.correctOptionIndex;
    
    // Calculate score based on correctness and time
    const baseScore = isCorrect ? 100 : 0;
    const timeBonus = isCorrect ? Math.max(0, 30 - Math.floor(timeTaken / 10)) : 0;
    const totalScore = baseScore + timeBonus;
    
    // Show feedback
    setShowFeedback(true);
    
    // Prepare result data
    const result = {
      challengeId: challenge.id,
      isCorrect,
      selectedAnswer,
      correctAnswer: challenge.correctAnswerData.correctOptionIndex,
      score: totalScore,
      accuracyPercentage: isCorrect ? 100 : 0,
      timeTaken,
      mode: 'easy'
    };
    
    // Notify parent component
    if (onSubmit) {
      onSubmit(result);
    }
  };
  
  const handleNextChallenge = () => {
    setSelectedAnswer(null);
    setShowFeedback(false);
    setStartTime(Date.now());
    
    if (onComplete) {
      onComplete();
    }
  };
  
  if (!challenge) {
    return <div className="p-4 text-center">Loading challenge...</div>;
  }
  
  return (
    <div className="easy-mode-challenge">
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-4 bg-blue-50 border-b">
          <h2 className="text-xl font-semibold">{challenge.title}</h2>
          <p className="text-gray-600">{challenge.description}</p>
        </div>
        
        <div className="p-4">
          <div className="chart-container mb-6">
            <TradingViewWidget 
              symbol={challenge.chartSymbol || 'NASDAQ:AAPL'}
              interval={challenge.chartInterval || '1D'}
              readOnly={true}
              height="400px"
            />
          </div>
          
          <div className="mb-6">
            <h3 className="text-lg font-medium mb-3">{challenge.correctAnswerData.question}</h3>
            <div className="space-y-3">
              {challenge.correctAnswerData.options.map((option, index) => (
                <div 
                  key={index}
                  className={`p-3 border rounded-md cursor-pointer transition-colors ${
                    showFeedback && index === challenge.correctAnswerData.correctOptionIndex
                      ? 'border-green-500 bg-green-50'
                      : showFeedback && index === selectedAnswer && index !== challenge.correctAnswerData.correctOptionIndex
                        ? 'border-red-500 bg-red-50'
                        : selectedAnswer === index
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-300 hover:border-blue-300'
                  }`}
                  onClick={() => !showFeedback && handleAnswerSelect(index)}
                >
                  <div className="flex items-center">
                    <div className={`w-5 h-5 rounded-full border flex items-center justify-center mr-3 ${
                      showFeedback && index === challenge.correctAnswerData.correctOptionIndex
                        ? 'border-green-500 bg-green-500'
                        : showFeedback && index === selectedAnswer && index !== challenge.correctAnswerData.correctOptionIndex
                          ? 'border-red-500 bg-red-500'
                          : selectedAnswer === index
                            ? 'border-blue-500 bg-blue-500'
                            : 'border-gray-400'
                    }`}>
                      {showFeedback && index === challenge.correctAnswerData.correctOptionIndex && (
                        <div className="w-2 h-2 rounded-full bg-white"></div>
                      )}
                      {selectedAnswer === index && !showFeedback && (
                        <div className="w-2 h-2 rounded-full bg-white"></div>
                      )}
                    </div>
                    <span>{option}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {showFeedback ? (
            <div className="bg-gray-50 p-4 rounded-md mb-4">
              <h4 className="font-medium mb-2">Explanation:</h4>
              <p className="text-gray-700">{challenge.correctAnswerData.explanation}</p>
            </div>
          ) : null}
          
          {!showFeedback ? (
            <button 
              className={`w-full py-2 rounded-md font-medium ${
                selectedAnswer !== null
                  ? 'bg-blue-600 text-white hover:bg-blue-700'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
              onClick={handleSubmit}
              disabled={selectedAnswer === null}
            >
              Submit Answer
            </button>
          ) : (
            <button 
              className="w-full py-2 rounded-md font-medium bg-green-600 text-white hover:bg-green-700"
              onClick={handleNextChallenge}
            >
              Next Challenge
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default EasyModeChallenge;
