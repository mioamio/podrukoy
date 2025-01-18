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
const registerBtn = document.getElementById('registerBtn');
const usernameInput = document.getElementById('username');
const passwordInput = document.getElementById('password');

// Регистрация нового пользователя
registerBtn.addEventListener('click', () => {
  const username = usernameInput.value;
  const password = passwordInput.value;

  if (username && password) {
    const user = { username, password };
    localStorage.setItem('user', JSON.stringify(user));
    showNotification('Регистрация успешна! Теперь вы можете войти.');
  } else {
    showNotification('Пожалуйста, заполните все поля.');
  }
});

// Вход пользователя
loginForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const username = usernameInput.value;
  const password = passwordInput.value;

  const savedUser = JSON.parse(localStorage.getItem('user'));

  if (savedUser && savedUser.username === username && savedUser.password === password) {
    user = { id: username, name: username };
    localStorage.setItem('currentUser', JSON.stringify(user));
    checkAuth();
    showNotification('Вход выполнен успешно!');
  } else {
    showNotification('Неверный логин или пароль.');
  }
});

// Проверка авторизации при загрузке страницы
function checkAuth() {
  const savedUser = JSON.parse(localStorage.getItem('currentUser'));
  if (savedUser) {
    user = savedUser;
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
  localStorage.removeItem('currentUser');
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
  const notification = document.createElement('div');
  notification.className = 'notification';
  notification.textContent = message;
  document.body.appendChild(notification);
  setTimeout(() => {
    notification.remove();
  }, 3000);
}

// Загрузка темы
const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'dark') {
  document.body.classList.add('dark-theme');
}

// Инициализация при загрузке страницы
window.addEventListener('load', () => {
  checkAuth();
});
