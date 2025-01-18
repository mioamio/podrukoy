import React from 'react';

const ThemeToggle = ({ toggleTheme, theme }) => {
  return (
    <button onClick={toggleTheme}>
      Переключить на {theme === 'light' ? 'темную' : 'светлую'} тему
    </button>
  );
};

export default ThemeToggle;
