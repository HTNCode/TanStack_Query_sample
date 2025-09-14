import React, { useState } from 'react';
import { testDataURIVulnerability } from './utils/vulnerabilityTest';

const SecurityTest: React.FC = () => {
  const [testResults, setTestResults] = useState<string>('');
  const [isRunning, setIsRunning] = useState(false);

  const runSecurityTest = async () => {
    setIsRunning(true);
    setTestResults('Running security tests...\n');
    
    // Capture console output
    const originalConsoleLog = console.log;
    let output = '';
    
    console.log = (...args) => {
      output += args.join(' ') + '\n';
      originalConsoleLog(...args);
    };

    try {
      await testDataURIVulnerability();
      setTestResults(output);
    } catch (error) {
      setTestResults(output + `\nError: ${error}`);
    } finally {
      console.log = originalConsoleLog;
      setIsRunning(false);
    }
  };

  return (
    <div style={{ padding: '20px', border: '1px solid #ccc', margin: '10px' }}>
      <h2>Axios Data URI Vulnerability Test</h2>
      <p>This component tests the security fix for the axios data URI vulnerability.</p>
      
      <button 
        onClick={runSecurityTest} 
        disabled={isRunning}
        style={{ 
          padding: '10px 20px', 
          backgroundColor: isRunning ? '#ccc' : '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: isRunning ? 'not-allowed' : 'pointer'
        }}
      >
        {isRunning ? 'Running Tests...' : 'Run Security Test'}
      </button>

      {testResults && (
        <div style={{ 
          marginTop: '20px', 
          padding: '10px', 
          backgroundColor: '#f8f9fa', 
          border: '1px solid #dee2e6',
          borderRadius: '4px',
          fontFamily: 'monospace',
          whiteSpace: 'pre-wrap',
          fontSize: '12px'
        }}>
          <h3>Test Results:</h3>
          {testResults}
        </div>
      )}
    </div>
  );
};

export default SecurityTest;