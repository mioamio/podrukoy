document.addEventListener('DOMContentLoaded', () => {
  let count = 0;
  let user = null;
  let chartInstance = null;

  // Элементы DOM
  const counterElement = document.getElementById('counter');
  const startBtn = document.getElementById('startBtn');
  const resetBtn = document.getElementById('resetBtn');
  const commentElement = document.getElementById('comment');
  const loginSection = document.getElementById('loginSection');
  const appSection = document.getElementById('appSection');
  const logoutBtn = document.getElementById('logoutBtn');
  const calendarGrid = document.getElementById('calendarGrid');
  const progressChart = document.getElementById('progressChart')?.getContext('2d');
  const insightText = document.getElementById('insightText');
  const googleLoginBtn = document.getElementById('googleLoginBtn');
  const yandexLoginBtn = document.getElementById('yandexLoginBtn');
  const vkLoginBtn = document.getElementById('vkLoginBtn');
  const userGreeting = document.getElementById('userGreeting');
  const themeBtn = document.getElementById('themeBtn');
  const themeIcon = document.getElementById('themeIcon');
  const notification = document.getElementById('notification');

  if (!counterElement || !startBtn || !resetBtn || !commentElement || !loginSection || !appSection || !logoutBtn || !calendarGrid || !progressChart || !insightText || !googleLoginBtn || !yandexLoginBtn || !vkLoginBtn || !userGreeting || !themeBtn || !themeIcon || !notification) {
    console.error('Один или несколько элементов DOM не найдены!');
    return;
  }

  // Проверка авторизации при загрузке страницы
  function checkAuth() {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      user = JSON.parse(savedUser);
      count = parseInt(localStorage.getItem(`${user.id}_count`)) || 0;
      updateUI();
      loadCalendar();
      renderChart();
      loginSection.style.display = 'none';
      appSection.style.display = 'block';
      userGreeting.textContent = `Привет, ${user.name}!`;
    }
  }

  // Обновление интерфейса
  function updateUI() {
    counterElement.textContent = `Количество: ${count}`;
    updateComment();
    updateInsights();
    localStorage.setItem(`${user.id}_count`, count);
  }

  // Обновление комментария
  function updateComment() {
    if (count < 10) {
      commentElement.textContent = 'Ты начинающий 😊';
    } else if (count >= 10 && count < 20) {
      commentElement.textContent = 'Ты в ударе! 🚀';
    } else {
      commentElement.textContent = 'Пора отдохнуть! 🛑';
    }
  }

  // Обновление аналитики
  function updateInsights() {
    const activeDays = JSON.parse(localStorage.getItem(`${user.id}_calendar`)) || [];
    const totalDays = activeDays.length;
    const last7Days = activeDays.slice(-7).filter(day => day).length;
    insightText.textContent = `Активных дней: ${totalDays}. За последнюю неделю: ${last7Days}.`;
  }

  // Вход через Google
  googleLoginBtn.addEventListener('click', () => {
    user = { id: 'google_user_id', name: 'Google User' };
    localStorage.setItem('user', JSON.stringify(user));
    checkAuth();
    showNotification(`Вход через Google выполнен!`);
  });

  // Вход через Яндекс
  yandexLoginBtn.addEventListener('click', () => {
    user = { id: 'yandex_user_id', name: 'Yandex User' };
    localStorage.setItem('user', JSON.stringify(user));
    checkAuth();
    showNotification(`Вход через Яндекс выполнен!`);
  });

  // Вход через ВКонтакте
  vkLoginBtn.addEventListener('click', () => {
    user = { id: 'vk_user_id', name: 'VK User' };
    localStorage.setItem('user', JSON.stringify(user));
    checkAuth();
    showNotification(`Вход через ВКонтакте выполнен!`);
  });

  // Выход
  logoutBtn.addEventListener('click', () => {
    localStorage.removeItem('user');
    user = null;
    loginSection.style.display = 'block';
    appSection.style.display = 'none';
  });

  // Обработчик кнопки "Отметить активность"
  startBtn.addEventListener('click', () => {
    count++;
    const now = new Date();
    const date = now.toISOString().split('T')[0];
    const time = now.toTimeString().split(' ')[0];

    const activities = JSON.parse(localStorage.getItem(`${user.id}_activities`)) || [];
    activities.push({ date, time });
    localStorage.setItem(`${user.id}_activities`, JSON.stringify(activities));

    updateUI();
    updateCalendar();
    showNotification(`Активность отмечена! 🎉`);
  });

  // Обработчик кнопки "Сбросить"
  resetBtn.addEventListener('click', () => {
    count = 0;
    updateUI();
    showNotification(`Прогресс сброшен. 🔄`);
  });

  // Календарь активности
  function loadCalendar() {
    const activeDays = JSON.parse(localStorage.getItem(`${user.id}_calendar`)) || [];
    const today = new Date().toISOString().split('T')[0];
    if (!activeDays.includes(today)) {
      activeDays.push(today);
      localStorage.setItem(`${user.id}_calendar`, JSON.stringify(activeDays));
    }
    renderCalendar(activeDays);
  }

  function renderCalendar(activeDays) {
    calendarGrid.innerHTML = '';
    const daysInMonth = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getDate();
    for (let i = 1; i <= daysInMonth; i++) {
      const day = document.createElement('div');
      day.classList.add('day');
      day.textContent = i;
      const date = new Date(new Date().getFullYear(), new Date().getMonth(), i).toISOString().split('T')[0];
      if (activeDays.includes(date)) {
        day.classList.add('active');
      }
      calendarGrid.appendChild(day);
    }
  }

  // График прогресса
  function renderChart() {
    if (chartInstance) {
      chartInstance.destroy();
    }
    const labels = [];
    const data = [];
    for (let i = 1; i <= 30; i++) {
      labels.push(`День ${i}`);
      data.push(localStorage.getItem(`${user.id}_day_${i}`) ? 1 : 0);
    }
    chartInstance = new Chart(progressChart, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [{
          label: 'Активность',
          data: data,
          borderColor: '#6a82fb',
          backgroundColor: 'rgba(106, 130, 251, 0.2)',
          fill: true,
        }]
      },
      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              stepSize: 1,
            }
          }
        }
      }
    });
  }

  // Обработчик клика по дню в календаре
  calendarGrid.addEventListener('click', (event) => {
    if (event.target.classList.contains('day')) {
      const day = event.target.textContent;
      const now = new Date();
      const year = now.getFullYear();
      const month = now.getMonth() + 1; // Месяцы начинаются с 0
      const date = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      updateChartForDate(date);
    }
  });

  // Функция для обновления графика за выбранную дату
  function updateChartForDate(date) {
    const activities = JSON.parse(localStorage.getItem(`${user.id}_activities`)) || [];
    const filteredActivities = activities.filter(activity => activity.date === date);

    if (filteredActivities.length > 0) {
      const labels = filteredActivities.map(activity => activity.time);
      const data = filteredActivities.map(() => 1); // Все активности равны 1 для графика

      if (chartInstance) {
        chartInstance.destroy();
      }

      chartInstance = new Chart(progressChart, {
        type: 'bar', // Используем столбчатую диаграмму для наглядности
        data: {
          labels: labels,
          datasets: [{
            label: 'Активность',
            data: data,
            backgroundColor: '#6a82fb',
            borderColor: '#6a82fb',
            borderWidth: 1,
          }]
        },
        options: {
          responsive: true,
          scales: {
            y: {
              beginAtZero: true,
              ticks: {
                stepSize: 1,
              }
            }
          }
        }
      });
    } else {
      if (chartInstance) {
        chartInstance.destroy();
      }
      chartInstance = new Chart(progressChart, {
        type: 'bar',
        data: {
          labels: ['Нет данных'],
          datasets: [{
            label: 'Активность',
            data: [0],
            backgroundColor: '#ff6f61',
            borderColor: '#ff6f61',
            borderWidth: 1,
          }]
        },
        options: {
          responsive: true,
          scales: {
            y: {
              beginAtZero: true,
              ticks: {
                stepSize: 1,
              }
            }
          }
        }
      });
    }
  }

  // Уведомления
  function showNotification(message) {
    notification.textContent = message;
    notification.style.display = 'block';
    setTimeout(() => {
      notification.style.display = 'none';
    }, 3000);
  }

  // Темная тема
  themeBtn.addEventListener('click', () => {
    document.body.classList.toggle('dark-theme');
    const isDarkTheme = document.body.classList.contains('dark-theme');
    localStorage.setItem('theme', isDarkTheme ? 'dark' : 'light');
    themeIcon.src = isDarkTheme ? 'banana-night.ico' : 'banana-light.ico';
    document.getElementById('favicon').href = 'icon.ico';
  });

  // Загрузка темы
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'dark') {
    document.body.classList.add('dark-theme');
    themeIcon.src = 'banana-night.ico';
  } else {
    themeIcon.src = 'banana-light.ico';
  }
  document.getElementById('favicon').href = 'icon.ico';

  // Проверка авторизации при загрузке страницы
  checkAuth();
});
