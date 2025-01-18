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

// Переключение между формами входа и регистрации
toggleRegister.addEventListener('click', (e) => {
  e.preventDefault();
  loginForm.style.display = 'none';
  registerForm.style.display = 'block';
});

toggleLogin.addEventListener('click', (e) => {
  e.preventDefault();
  registerForm.style.display = 'none';
  loginForm.style.display = 'block';
});

// Вход через email и пароль
loginBtn.addEventListener('click', () => {
  const email = loginEmail.value;
  const password = loginPassword.value;

  // Простая проверка (в реальном проекте нужно использовать серверную аутентификацию)
  if (email && password) {
    user = { id: email, name: email };
    localStorage.setItem('user', JSON.stringify(user));
    checkAuth();
    showNotification(`Вход выполнен!`);
  } else {
    showNotification(`Пожалуйста, заполните все поля.`);
  }
});

// Регистрация через email и пароль
registerBtn.addEventListener('click', () => {
  const name = registerName.value;
  const email = registerEmail.value;
  const password = registerPassword.value;

  // Простая проверка (в реальном проекте нужно использовать серверную аутентификацию)
  if (name && email && password) {
    user = { id: email, name: name };
    localStorage.setItem('user', JSON.stringify(user));
    checkAuth();
    showNotification(`Регистрация успешна!`);
  } else {
    showNotification(`Пожалуйста, заполните все поля.`);
  }
});

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
  const notification = document.createElement('div');
  notification.className = 'notification';
  notification.textContent = message;
  document.body.appendChild(notification);
  setTimeout(() => {
    notification.remove();
  }, 3000);
}

// Инициализация VK Widget
function initVKAuth() {
  VK.init({
    apiId: YOUR_VK_APP_ID // Замените на ваш App ID
  });

  VK.Widgets.Auth('vk_auth', {
    onAuth: function (data) {
      const userName = `${data.first_name} ${data.last_name}`;
      user = { id: data.uid, name: userName };
      localStorage.setItem('user', JSON.stringify(user));
      checkAuth();
      showNotification(`Вход через ВКонтакте выполнен!`);
    }
  });
}

// Загрузка страницы
window.addEventListener('load', () => {
  initVKAuth();
  checkAuth();
});
