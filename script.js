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
const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');
const toggleRegister = document.getElementById('toggleRegister');
const toggleLogin = document.getElementById('toggleLogin');
const loginBtn = document.getElementById('loginBtn');
const registerBtn = document.getElementById('registerBtn');
const loginEmail = document.getElementById('loginEmail');
const loginPassword = document.getElementById('loginPassword');
const registerName = document.getElementById('registerName');
const registerEmail = document.getElementById('registerEmail');
const registerPassword = document.getElementById('registerPassword');
const themeBtn = document.getElementById('themeBtn');
const themeIcon = document.getElementById('themeIcon');
const notification = document.getElementById('notification');

// Инициализация VK Auth
function initVKAuth() {
  VK.init({
    apiId: 52936865, // Ваш App ID
  });

  document.getElementById('vkLoginBtn').addEventListener('click', () => {
    VK.Auth.login((response) => {
      if (response.session) {
        const user = {
          id: response.session.mid,
          name: `${response.session.user.first_name} ${response.session.user.last_name}`,
        };
        localStorage.setItem('user', JSON.stringify(user));
        checkAuth();
        showNotification(`Вход через ВКонтакте выполнен!`);
      } else {
        showNotification(`Авторизация отменена.`);
      }
    });
  });
}

// Инициализация Google Auth
function initGoogleAuth() {
  google.accounts.id.initialize({
    client_id: 'YOUR_GOOGLE_CLIENT_ID', // Замените на ваш Client ID
    callback: handleGoogleResponse,
  });

  google.accounts.id.renderButton(
    document.getElementById('googleLoginBtn'),
    { theme: 'outline', size: 'large' } // Настройки кнопки
  );
}

function handleGoogleResponse(response) {
  const user = parseJwt(response.credential);
  localStorage.setItem('user', JSON.stringify(user));
  checkAuth();
  showNotification(`Вход через Google выполнен!`);
}

function parseJwt(token) {
  const base64Url = token.split('.')[1];
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  const jsonPayload = decodeURIComponent(
    atob(base64)
      .split('')
      .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
      .join('')
  );
  return JSON.parse(jsonPayload);
}

// Инициализация Yandex Auth
function initYandexAuth() {
  document.getElementById('yandexLoginBtn').addEventListener('click', () => {
    const clientId = 'YOUR_YANDEX_CLIENT_ID'; // Замените на ваш Client ID
    const redirectUri = encodeURIComponent('http://localhost/callback'); // Укажите ваш callback URI
    window.location.href = `https://oauth.yandex.ru/authorize?response_type=code&client_id=${clientId}&redirect_uri=${redirectUri}`;
  });
}

function handleYandexCallback() {
  const urlParams = new URLSearchParams(window.location.search);
  const code = urlParams.get('code');
  if (code) {
    fetch('https://oauth.yandex.ru/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: `grant_type=authorization_code&code=${code}&client_id=YOUR_YANDEX_CLIENT_ID&client_secret=YOUR_YANDEX_CLIENT_SECRET`,
    })
      .then((response) => response.json())
      .then((data) => {
        const accessToken = data.access_token;
        fetch('https://login.yandex.ru/info?format=json', {
          headers: {
            Authorization: `OAuth ${accessToken}`,
          },
        })
          .then((response) => response.json())
          .then((userInfo) => {
            const user = { id: userInfo.id, name: userInfo.display_name };
            localStorage.setItem('user', JSON.stringify(user));
            checkAuth();
            showNotification(`Вход через Яндекс выполнен!`);
          });
      });
  }
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
  }
}

// Обновление интерфейса
function updateUI() {
  counterElement.textContent = `Количество: ${count}`;
  updateComment();
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

const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'dark') {
  document.body.classList.add('dark-theme');
  themeIcon.src = 'banana-night.ico';
} else {
  themeIcon.src = 'banana-light.ico';
}
document.getElementById('favicon').href = 'icon.ico';

// Инициализация при загрузке страницы
window.addEventListener('load', () => {
  initVKAuth();
  initGoogleAuth();
  initYandexAuth();
  handleYandexCallback();
  checkAuth();
});
