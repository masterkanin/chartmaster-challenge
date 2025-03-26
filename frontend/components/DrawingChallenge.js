import React, { useState } from 'react';

const DrawingChallenge = ({ chartData, instructions, onSubmit }) => {
  const [drawings, setDrawings] = useState([]);
  const [activeDrawingTool, setActiveDrawingTool] = useState('rectangle');
  
  // This is a placeholder for TradingView chart integration
  // In a real implementation, this would use the TradingView Charting Library
  
  const handleToolChange = (tool) => {
    setActiveDrawingTool(tool);
  };
  
  const handleClearDrawings = () => {
    setDrawings([]);
    // In real implementation, would clear drawings from TradingView chart
  };
  
  const handleSubmit = () => {
    // In real implementation, would collect drawing data from TradingView chart
    onSubmit(drawings);
  };
  
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-4 bg-gray-50 border-b">
        <h3 className="text-xl font-semibold mb-2">Drawing Challenge</h3>
        <p className="text-gray-600">{instructions}</p>
      </div>
      
      <div className="p-4">
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
        
        <div className="chart-container bg-gray-100 mb-4">
          {/* This div would be replaced with the TradingView chart */}
          <div className="w-full h-full flex items-center justify-center">
            <p className="text-gray-500">TradingView Chart will be integrated here</p>
          </div>
        </div>
        
        <div className="flex justify-end">
          <button 
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            onClick={handleSubmit}
          >
            Submit Analysis
          </button>
        </div>
      </div>
    </div>
  );
};

export default DrawingChallenge;
