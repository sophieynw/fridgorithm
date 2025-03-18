import React, { useState } from 'react';

const ImageAnalysisTest = () => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    const fileInput = document.getElementById('imageInput');
    const file = fileInput.files[0];
    
    if (!file) {
      setError('Please select an image file');
      setLoading(false);
      return;
    }
    
    const formData = new FormData();
    formData.append('image', file);
    
    try {
      const response = await fetch('http://localhost:3000/api/vision/analyze', {
        method: 'POST',
        body: formData,
        credentials: 'include'
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Analysis results:', data);
      setResults(data.tags || []);
    } catch (error) {
      console.error('Error:', error);
      setError('Failed to analyze image: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Test Image Analysis</h1>
      
      <form onSubmit={handleSubmit} className="mb-6">
        <div className="mb-4">
          <label htmlFor="imageInput" className="block mb-2">Select an image:</label>
          <input 
            type="file" 
            id="imageInput" 
            accept="image/*"
            className="border p-2 w-full"
          />
        </div>
        <button 
          type="submit" 
          className="bg-blue-500 text-white py-2 px-4 rounded"
          disabled={loading}
        >
          {loading ? 'Analyzing...' : 'Analyze Image'}
        </button>
      </form>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 p-3 rounded mb-4">
          {error}
        </div>
      )}
      
      {results.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold mb-2">Detected Items:</h2>
          <ul className="list-disc pl-5">
            {results.map((tag, index) => (
              <li key={index}>
                {tag.name} ({(tag.confidence * 100).toFixed(2)}%)
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ImageAnalysisTest;