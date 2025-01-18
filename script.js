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
const progressChart = document.getElementById('progressChart').getContext('2d');
const insightText = document.getElementById('insightText');
const googleLoginBtn = document.getElementById('googleLoginBtn');
const yandexLoginBtn = document.getElementById('yandexLoginBtn');
const vkLoginBtn = document.getElementById('vkLoginBtn');
const userGreeting = document.getElementById('userGreeting');
const themeBtn = document.getElementById('themeBtn');
const themeIcon = document.getElementById('themeIcon');
const notification = document.getElementById('notification');

// Константы для OAuth
const googleClientId = 'YOUR_GOOGLE_CLIENT_ID';
const yandexClientId = 'YOUR_YANDEX_CLIENT_ID';
const vkClientId = 'YOUR_VK_CLIENT_ID';

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
  const redirectUri = window.location.origin;
  const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${googleClientId}&redirect_uri=${redirectUri}&response_type=token&scope=profile`;

  window.location.href = authUrl;
});

// Вход через Яндекс
yandexLoginBtn.addEventListener('click', () => {
  const redirectUri = window.location.origin;
  const authUrl = `https://oauth.yandex.ru/authorize?client_id=${yandexClientId}&redirect_uri=${redirectUri}&response_type=token`;

  window.location.href = authUrl;
});

// Вход через ВКонтакте
vkLoginBtn.addEventListener('click', () => {
  const redirectUri = window.location.origin;
  const authUrl = `https://oauth.vk.com/authorize?client_id=${vkClientId}&redirect_uri=${redirectUri}&response_type=token&scope=email`;

  window.location.href = authUrl;
});

// Обработка ответа от OAuth
window.addEventListener('load', () => {
  const hash = window.location.hash;
  if (hash) {
    const params = new URLSearchParams(hash.substring(1));
    const accessToken = params.get('access_token');
    const provider = params.get('provider');

    if (accessToken && provider) {
      switch (provider) {
        case 'google':
          fetch(`https://www.googleapis.com/oauth2/v1/userinfo?access_token=${accessToken}`)
            .then(response => response.json())
            .then(data => {
              user = { id: data.id, name: data.name };
              localStorage.setItem('user', JSON.stringify(user));
              checkAuth();
              showNotification(`Вход через Google выполнен!`);
            })
            .catch(error => console.error('Ошибка при получении данных пользователя:', error));
          break;

        case 'yandex':
          fetch(`https://login.yandex.ru/info?format=json&oauth_token=${accessToken}`)
            .then(response => response.json())
            .then(data => {
              user = { id: data.id, name: data.display_name };
              localStorage.setItem('user', JSON.stringify(user));
              checkAuth();
              showNotification(`Вход через Яндекс выполнен!`);
            })
            .catch(error => console.error('Ошибка при получении данных пользователя:', error));
          break;

        case 'vk':
          const userId = params.get('user_id');
          if (userId) {
            fetch(`https://api.vk.com/method/users.get?user_ids=${userId}&access_token=${accessToken}&v=5.131`)
              .then(response => response.json())
              .then(data => {
                const userData = data.response[0];
                user = { id: userData.id, name: `${userData.first_name} ${userData.last_name}` };
                localStorage.setItem('user', JSON.stringify(user));
                checkAuth();
                showNotification(`Вход через ВКонтакте выполнен!`);
              })
              .catch(error => console.error('Ошибка при получении данных пользователя:', error));
          }
          break;

        default:
          console.error('Неизвестный провайдер:', provider);
      }
    }
  }
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
