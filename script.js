let count = 0;
let user = null;

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

// Проверка авторизации при загрузке страницы
function checkAuth() {
  const savedUser = localStorage.getItem('user');
  if (savedUser) {
    user = JSON.parse(savedUser);
    count = parseInt(localStorage.getItem(`${user.id}_count`)) || 0;
    updateUI();
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

// Вход через Google
googleLoginBtn.addEventListener('click', () => {
  // Здесь будет код для входа через Google
  user = { id: 'google_user_id', name: 'Google User' };
  localStorage.setItem('user', JSON.stringify(user));
  checkAuth();
});

// Вход через Яндекс
yandexLoginBtn.addEventListener('click', () => {
  // Здесь будет код для входа через Яндекс
  user = { id: 'yandex_user_id', name: 'Yandex User' };
  localStorage.setItem('user', JSON.stringify(user));
  checkAuth();
});

// Вход через ВКонтакте
vkLoginBtn.addEventListener('click', () => {
  // Здесь будет код для входа через ВКонтакте
  user = { id: 'vk_user_id', name: 'VK User' };
  localStorage.setItem('user', JSON.stringify(user));
  checkAuth();
});

// Выход
logoutBtn.addEventListener('click', () => {
  localStorage.removeItem('user');
  user = null;
  loginSection.style.display = 'block';
  appSection.style.display = 'none';
});

// Обработчик кнопки "Начать"
startBtn.addEventListener('click', () => {
  count++;
  updateUI();
});

// Обработчик кнопки "Сбросить"
resetBtn.addEventListener('click', () => {
  count = 0;
  updateUI();
});

// Проверка авторизации при загрузке страницы
checkAuth();
