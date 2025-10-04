import React from 'react';
import { Toaster } from 'react-hot-toast';
import WatermarkRemover from './components/WatermarkRemover';
import './App.css';

function App() {
  return (
    <div className="App">
      <Toaster 
        position="top-center"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#2d2d2d',
            color: '#fff',
            border: '1px solid rgba(123, 104, 238, 0.3)',
            borderRadius: '12px',
            padding: '16px',
          },
        }}
      />
      <WatermarkRemover />
    </div>
  );
}

export default App;