import React, { useState, useEffect } from 'react';
import TradingViewChartLibrary from './TradingViewChartLibrary';
import ChartOverlaySystem from './ChartOverlaySystem';

const HardModeChallenge = ({
  challenge,
  onSubmit,
  onComplete
}) => {
  const [drawings, setDrawings] = useState([]);
  const [showFeedback, setShowFeedback] = useState(false);
  const [result, setResult] = useState(null);
  const [startTime, setStartTime] = useState(null);
  const [activeDrawingTool, setActiveDrawingTool] = useState('rectangle');
  
  useEffect(() => {
    // Record start time when component mounts
    setStartTime(Date.now());
  }, []);
  
  const handleDrawingComplete = (newDrawings) => {
    setDrawings(newDrawings);
  };
  
  const handleToolChange = (tool) => {
    setActiveDrawingTool(tool);
  };
  
  const handleClearDrawings = () => {
    setDrawings([]);
  };
  
  const handleSubmit = () => {
    if (drawings.length === 0) return;
    
    const endTime = Date.now();
    const timeTaken = Math.round((endTime - startTime) / 1000); // in seconds
    
    // Show feedback
    setShowFeedback(true);
  };
  
  const handleScoreCalculated = (scoreData) => {
    const { score, accuracy, feedback } = scoreData;
    
    // Prepare result data
    const resultData = {
      challengeId: challenge.id,
      score,
      accuracyPercentage: accuracy,
      timeTaken: Math.round((Date.now() - startTime) / 1000),
      mode: 'hard',
      feedback
    };
    
    setResult(resultData);
    
    // Notify parent component
    if (onSubmit) {
      onSubmit(resultData);
    }
  };
  
  const handleNextChallenge = () => {
    setDrawings([]);
    setShowFeedback(false);
    setResult(null);
    setStartTime(Date.now());
    
    if (onComplete) {
      onComplete();
    }
  };
  
  if (!challenge) {
    return <div className="p-4 text-center">Loading challenge...</div>;
  }
  
  return (
    <div className="hard-mode-challenge">
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-4 bg-blue-50 border-b">
          <h2 className="text-xl font-semibold">{challenge.title}</h2>
          <p className="text-gray-600">{challenge.description}</p>
        </div>
        
        <div className="p-4">
          <div className="mb-4">
            <h3 className="text-lg font-medium mb-3">{challenge.correctAnswerData.instructions}</h3>
            
            {!showFeedback && (
              <div className="flex space-x-2 mb-4">
                <button 
                  className={`px-3 py-1 rounded text-sm ${
                    activeDrawingTool === 'rectangle' 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                  onClick={() => handleToolChange('rectangle')}
                >
                  Rectangle
                </button>
                <button 
                  className={`px-3 py-1 rounded text-sm ${
                    activeDrawingTool === 'line' 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                  onClick={() => handleToolChange('line')}
                >
                  Line
                </button>
                <button 
                  className={`px-3 py-1 rounded text-sm ${
                    activeDrawingTool === 'text' 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                  onClick={() => handleToolChange('text')}
                >
                  Text
                </button>
                <button 
                  className="px-3 py-1 rounded text-sm bg-red-100 text-red-700 hover:bg-red-200 ml-auto"
                  onClick={handleClearDrawings}
                >
                  Clear All
                </button>
              </div>
            )}
          </div>
          
          <div className="chart-container mb-6">
            <ChartOverlaySystem
              chartId={`challenge-${challenge.id}`}
              symbol={challenge.chartSymbol || 'NASDAQ:AAPL'}
              interval={challenge.chartInterval || 'D'}
              correctAreas={challenge.correctAnswerData.correctAreas}
              userDrawings={drawings}
              showCorrectOverlay={showFeedback}
              onScoreCalculated={handleScoreCalculated}
              height="450px"
            />
          </div>
          
          {!showFeedback ? (
            <button 
              className={`w-full py-2 rounded-md font-medium ${
                drawings.length > 0
                  ? 'bg-blue-600 text-white hover:bg-blue-700'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
              onClick={handleSubmit}
              disabled={drawings.length === 0}
            >
              Submit Analysis
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

export default HardModeChallenge;
