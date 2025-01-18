import React from 'react';
import Calendar from '../components/Calendar';
import Stats from '../components/Stats';
import ThemeToggle from '../components/ThemeToggle';

const Home = ({ toggleTheme, theme }) => {
  return (
    <div className="home">
      <h1 className="slogan">Под рукой — мастерство в каждом движении</h1>
      <ThemeToggle toggleTheme={toggleTheme} theme={theme} />
      <Calendar />
      <Stats />
    </div>
  );
};

export default Home;
