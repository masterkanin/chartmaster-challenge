import React, { useState } from 'react';

const QuizQuestion = ({ question, options, onSubmit }) => {
  const [selectedOption, setSelectedOption] = useState(null);
  
  const handleOptionSelect = (index) => {
    setSelectedOption(index);
  };
  
  const handleSubmit = () => {
    if (selectedOption !== null) {
      onSubmit(selectedOption);
    }
  };
  
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-xl font-semibold mb-4">{question}</h3>
      
      <div className="space-y-3 mb-6">
        {options.map((option, index) => (
          <div 
            key={index}
            className={`p-3 border rounded-md cursor-pointer transition-colors ${
              selectedOption === index 
                ? 'border-blue-500 bg-blue-50' 
                : 'border-gray-300 hover:border-blue-300'
            }`}
            onClick={() => handleOptionSelect(index)}
          >
            <div className="flex items-center">
              <div className={`w-5 h-5 rounded-full border flex items-center justify-center mr-3 ${
                selectedOption === index 
                  ? 'border-blue-500 bg-blue-500' 
                  : 'border-gray-400'
              }`}>
                {selectedOption === index && (
                  <div className="w-2 h-2 rounded-full bg-white"></div>
                )}
              </div>
              <span>{option}</span>
            </div>
          </div>
        ))}
      </div>
      
      <button 
        className={`w-full py-2 rounded-md font-medium ${
          selectedOption !== null
            ? 'bg-blue-600 text-white hover:bg-blue-700'
            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
        }`}
        onClick={handleSubmit}
        disabled={selectedOption === null}
      >
        Submit Answer
      </button>
    </div>
  );
};

export default QuizQuestion;
