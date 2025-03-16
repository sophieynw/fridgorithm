import React, { useState } from 'react';
import axios from 'axios';

const DebugPanel = () => {
  const [results, setResults] = useState({});

  const testEndpoint = async (name, url, withCredentials = true) => {
    try {
      const response = await axios.get(url, { withCredentials });
      setResults((prev) => ({
        ...prev,
        [name]: { success: true, data: response.data },
      }));
    } catch (error) {
      setResults((prev) => ({
        ...prev,
        [name]: { success: false, error: error.message },
      }));
    }
  };

  return (
    <div style={{ margin: '20px', padding: '10px', border: '1px solid #ccc' }}>
      <h3>API Testing Panel</h3>

      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
        <button onClick={() => testEndpoint('session', '/api/auth/session')}>
          Test Session (with credentials)
        </button>

        <button
          onClick={() =>
            testEndpoint('token', '/api/speech/get-speech-token', false)
          }
        >
          Test Speech Token (no credentials)
        </button>

        <button
          onClick={() =>
            testEndpoint('tokenWithCreds', '/api/speech/get-speech-token', true)
          }
        >
          Test Speech Token (with credentials)
        </button>

        <button onClick={() => testEndpoint('test', '/api/test')}>
          Test Basic API
        </button>
      </div>

      <div>
        <h4>Results:</h4>
        <pre>{JSON.stringify(results, null, 2)}</pre>
      </div>
    </div>
  );
};

export default DebugPanel;
