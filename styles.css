/* Общие стили */
body {
  font-family: 'Nunito', sans-serif;
  background: linear-gradient(135deg, #f5f5f5, #e0e0e0);
  color: #333;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  transition: background 0.3s ease, color 0.3s ease;
}

body.dark-theme {
  background: #000000;
  color: #ffffff;
}

.container {
  text-align: center;
  background: rgba(255, 255, 255, 0.95);
  padding: 30px;
  border-radius: 15px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  max-width: 800px;
  width: 90%;
  margin: 20px;
  transition: background 0.3s ease;
}

body.dark-theme .container {
  background: rgba(0, 0, 0, 0.95);
  border: 1px solid #333;
}

.header-text {
  text-align: center;
  margin-bottom: 30px;
}

#mainTitle {
  font-size: 3rem;
  margin: 0;
  font-weight: 700;
  background: linear-gradient(45deg, #6a82fb, #fc5c7d, #6a82fb);
  background-size: 200% 200%;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: gradientAnimation 6s ease infinite;
}

@keyframes gradientAnimation {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}

#slogan {
  font-size: 1.2rem;
  color: #555;
  font-style: italic;
  margin-top: 10px;
}

body.dark-theme #slogan {
  color: #ccc;
}

button {
  background: #6a82fb;
  color: white;
  border: none;
  padding: 12px 24px;
  margin: 10px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 16px;
  font-weight: 500;
  transition: background 0.3s ease, transform 0.2s ease;
}

button:hover {
  background: #5a6fdb;
  transform: translateY(-2px);
}

body.dark-theme button {
  background: #6a82fb;
  color: white;
}

body.dark-theme button:hover {
  background: #5a6fdb;
}

.social-btn {
  background: #444;
  display: block;
  width: 100%;
  margin: 10px 0;
}

.social-btn i {
  margin-right: 10px;
}

#counter {
  font-size: 24px;
  font-weight: 600;
  margin: 20px 0;
  color: #333;
}

body.dark-theme #counter {
  color: #ffffff;
}

#comment {
  font-size: 1.1rem;
  font-weight: 500;
  color: #6a82fb;
  margin: 10px 0;
}

body.dark-theme #comment {
  color: #8a9dfb;
}

#calendar {
  margin-top: 20px;
}

#calendarGrid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 5px;
  margin-top: 10px;
}

.day {
  padding: 10px;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 5px;
  text-align: center;
  color: #333;
  border: 1px solid #ddd;
  transition: background 0.3s ease, color 0.3s ease;
}

body.dark-theme .day {
  background: rgba(0, 0, 0, 0.95);
  color: #ffffff;
  border: 1px solid #333;
}

.day.active {
  background: #6a82fb;
  color: white;
}

#chart {
  margin-top: 20px;
  background: rgba(255, 255, 255, 0.95);
  padding: 20px;
  border-radius: 15px;
}

body.dark-theme #chart {
  background: rgba(0, 0, 0, 0.95);
  border: 1px solid #333;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

#userGreeting {
  font-size: 1.2rem;
  font-weight: 500;
}

body.dark-theme #userGreeting {
  color: #ffffff;
}

#logoutBtn {
  background: none;
  border: none;
  color: #333;
  font-size: 1.2rem;
  cursor: pointer;
  transition: color 0.3s ease;
}

body.dark-theme #logoutBtn {
  color: #ffffff;
}

#logoutBtn:hover {
  color: #fc5c7d;
}

.notification {
  position: fixed;
  bottom: 20px;
  right: 20px;
  background: #6a82fb;
  color: white;
  padding: 10px 20px;
  border-radius: 8px;
  display: none;
  animation: slideIn 0.5s ease;
}

@keyframes slideIn {
  from {
    transform: translateX(100%);
  }
  to {
    transform: translateX(0);
  }
}

.theme-toggle {
  position: fixed;
  top: 20px;
  right: 20px;
}

.theme-toggle button {
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
}

.theme-toggle img {
  width: 32px;
  height: 32px;
  transition: transform 0.3s ease;
  background: transparent;
}

body.dark-theme .theme-toggle img {
  background: transparent;
}

.theme-toggle button:hover img {
  transform: scale(1.1);
}

/* Адаптация для мобильных устройств */
@media (max-width: 600px) {
  .container {
    padding: 20px;
    border-radius: 10px;
  }

  h1 {
    font-size: 2rem;
  }

  button {
    padding: 10px 20px;
    font-size: 14px;
  }
}
