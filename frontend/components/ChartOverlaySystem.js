import React, { useState, useEffect } from 'react';
import TradingViewChartLibrary from './TradingViewChartLibrary';

const ChartOverlaySystem = ({
  chartId,
  symbol,
  interval,
  correctAreas,
  userDrawings,
  showCorrectOverlay,
  onScoreCalculated,
  width = '100%',
  height = '500px'
}) => {
  const [score, setScore] = useState(null);
  const [accuracy, setAccuracy] = useState(null);
  const [feedback, setFeedback] = useState([]);

  useEffect(() => {
    if (showCorrectOverlay && userDrawings && correctAreas) {
      calculateScore();
    }
  }, [showCorrectOverlay, userDrawings, correctAreas]);

  // Calculate score based on user drawings compared to correct areas
  const calculateScore = () => {
    // This is a simplified scoring algorithm
    // In a real implementation, this would be more sophisticated
    
    if (!userDrawings || !correctAreas || userDrawings.length === 0 || correctAreas.length === 0) {
      setScore(0);
      setAccuracy(0);
      setFeedback(['No drawings to evaluate']);
      return;
    }
    
    let totalScore = 0;
    let totalAccuracy = 0;
    const feedbackMessages = [];
    
    // For each correct area, find the best matching user drawing
    correctAreas.forEach((correctArea, index) => {
      let bestMatch = null;
      let bestMatchScore = 0;
      let bestMatchAccuracy = 0;
      
      userDrawings.forEach(userDrawing => {
        // In a real implementation, this would compare the actual coordinates and shapes
        // For now, we'll use a simplified approach
        
        const matchScore = calculateMatchScore(correctArea, userDrawing);
        const matchAccuracy = calculateMatchAccuracy(correctArea, userDrawing);
        
        if (matchScore > bestMatchScore) {
          bestMatch = userDrawing;
          bestMatchScore = matchScore;
          bestMatchAccuracy = matchAccuracy;
        }
      });
      
      totalScore += bestMatchScore;
      totalAccuracy += bestMatchAccuracy;
      
      // Generate feedback
      if (bestMatchScore > 80) {
        feedbackMessages.push(`Great job identifying ${correctArea.label || `pattern ${index + 1}`}!`);
      } else if (bestMatchScore > 50) {
        feedbackMessages.push(`Good attempt on ${correctArea.label || `pattern ${index + 1}`}, but could be more precise.`);
      } else if (bestMatch) {
        feedbackMessages.push(`Your drawing for ${correctArea.label || `pattern ${index + 1}`} needs improvement.`);
      } else {
        feedbackMessages.push(`You missed ${correctArea.label || `pattern ${index + 1}`}.`);
      }
    });
    
    // Check for extra user drawings that don't match any correct areas
    if (userDrawings.length > correctAreas.length) {
      feedbackMessages.push('You have some extra drawings that aren\'t needed.');
    }
    
    // Calculate final score and accuracy
    const finalScore = Math.round((totalScore / correctAreas.length) * 100);
    const finalAccuracy = Math.round((totalAccuracy / correctAreas.length) * 100);
    
    setScore(finalScore);
    setAccuracy(finalAccuracy);
    setFeedback(feedbackMessages);
    
    // Notify parent component
    if (onScoreCalculated) {
      onScoreCalculated({
        score: finalScore,
        accuracy: finalAccuracy,
        feedback: feedbackMessages
      });
    }
  };
  
  // Helper function to calculate match score between correct area and user drawing
  const calculateMatchScore = (correctArea, userDrawing) => {
    // In a real implementation, this would compare the actual coordinates and shapes
    // For now, return a random score for demonstration
    return Math.floor(Math.random() * 100);
  };
  
  // Helper function to calculate accuracy between correct area and user drawing
  const calculateMatchAccuracy = (correctArea, userDrawing) => {
    // In a real implementation, this would calculate the actual accuracy
    // For now, return a random accuracy for demonstration
    return Math.floor(Math.random() * 100);
  };

  return (
    <div className="chart-overlay-system">
      <TradingViewChartLibrary
        containerId={chartId}
        symbol={symbol}
        interval={interval}
        allowDrawing={!showCorrectOverlay}
        initialDrawings={userDrawings}
        correctOverlay={showCorrectOverlay ? correctAreas : null}
        width={width}
        height={height}
      />
      
      {showCorrectOverlay && score !== null && (
        <div className="overlay-results mt-4 p-4 bg-gray-50 rounded-md">
          <h3 className="text-lg font-semibold mb-2">Analysis Results</h3>
          <div className="flex justify-between mb-3">
            <div>
              <span className="text-gray-600">Score:</span>
              <span className="ml-2 font-bold">{score}/100</span>
            </div>
            <div>
              <span className="text-gray-600">Accuracy:</span>
              <span className="ml-2 font-bold">{accuracy}%</span>
            </div>
          </div>
          
          <h4 className="font-medium mb-2">Feedback:</h4>
          <ul className="list-disc pl-5 space-y-1">
            {feedback.map((message, index) => (
              <li key={index} className="text-sm text-gray-700">{message}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ChartOverlaySystem;
