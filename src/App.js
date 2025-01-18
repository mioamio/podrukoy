import React, { useState } from 'react';
import Home from './pages/Home';
import './styles/themes.css';

function App() {
  const [theme, setTheme] = useState('light');

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
    document.getElementById('favicon').href = newTheme === 'light' ? 'banana-light.ico' : 'banana-night.ico';
  };

  return (
    <div className={`app ${theme}`}>
      <Home toggleTheme={toggleTheme} theme={theme} />
    </div>
  );
}

export default App;
