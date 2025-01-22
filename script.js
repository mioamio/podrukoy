let count = 0;
let user = null;
let currentDate = new Date();
let selectedDate = currentDate;
let dailyData = {}; // Данные за каждый день
let dailyDataWithTime = {}; // Данные с временем
let isLicenseAccepted = localStorage.getItem('licenseAccepted') === 'true'; // Проверка принятия соглашения

// Элементы DOM
const counterElement = document.getElementById('counter');
const startBtn = document.getElementById('startBtn');
const resetBtn = document.getElementById('resetBtn');
const commentElement = document.getElementById('comment');
const loginSection = document.getElementById('loginSection');
const appSection = document.getElementById('appSection');
const logoutBtn = document.getElementById('logoutBtn');
const calendarGrid = document.getElementById('calendarGrid');
const currentMonthElement = document.getElementById('currentMonth');
const prevMonthBtn = document.getElementById('prevMonthBtn');
const nextMonthBtn = document.getElementById('nextMonthBtn');
const themeToggleBtn = document.getElementById('themeToggleBtn');
const themeIcon = document.getElementById('themeIcon');
const body = document.body;
const userNameInput = document.getElementById('userNameInput');
const userNameSpan = document.getElementById('userNameSpan');
const registerBtn = document.getElementById('registerBtn');
const loginBtn = document.getElementById('loginBtn');

// Модальное окно с пользовательским соглашением
const licenseModal = document.getElementById('licenseModal');
const showLicense = document.getElementById('showLicense');
const acceptLicense = document.getElementById('acceptLicense');
const declineLicense = document.getElementById('declineLicense');

// Открытие модального окна с соглашением
showLicense.addEventListener('click', (e) => {
  e.preventDefault();
  licenseModal.style.display = 'flex';
});

// Закрытие модального окна при клике вне его
licenseModal.addEventListener('click', (e) => {
  if (e.target === licenseModal) {
    licenseModal.style.display = 'none';
  }
});

// Принятие соглашения
acceptLicense.addEventListener('click', () => {
  isLicenseAccepted = true;
  localStorage.setItem('licenseAccepted', 'true');
  licenseModal.style.display = 'none';
  updateUIAfterLicenseAcceptance();
});

// Отклонение соглашения
declineLicense.addEventListener('click', () => {
  isLicenseAccepted = false;
  localStorage.setItem('licenseAccepted', 'false');
  licenseModal.style.display = 'none';
  updateUIAfterLicenseAcceptance();
});

// Обновление интерфейса после принятия/отклонения соглашения
function updateUIAfterLicenseAcceptance() {
  if (isLicenseAccepted) {
    registerBtn.disabled = false;
    loginBtn.disabled = false;
  } else {
    registerBtn.disabled = true;
    loginBtn.disabled = true;
  }
}

// Инициализация пользователей
function initializeUsers() {
  const users = JSON.parse(localStorage.getItem('users')) || [];
  if (users.length === 0) {
    // Создаем суперпользователя
    const superuser = {
      id: 1,
      name: 'Администратор',
      progress: {
        count: 0,
        dailyData: {},
        dailyDataWithTime: {},
      },
    };
    users.push(superuser);
    localStorage.setItem('users', JSON.stringify(users));
  }
  return users;
}

// Регистрация нового пользователя
function registerUser(name) {
  const users = JSON.parse(localStorage.getItem('users')) || [];
  const existingUser = users.find((u) => u.name === name);

  if (existingUser) {
    alert('Пользователь с таким именем уже существует. Войдите в систему.');
    return null;
  }

  const newUserId = users.length > 0 ? users[users.length - 1].id + 1 : 1;
  const user = {
    id: newUserId,
    name: name,
    progress: {
      count: 0,
      dailyData: {},
      dailyDataWithTime: {},
    },
  };
  users.push(user);
  localStorage.setItem('users', JSON.stringify(users));
  localStorage.setItem('currentUser', JSON.stringify(user)); // Сохраняем текущего пользователя
  return user;
}

// Вход пользователя
function loginUser(name) {
  const users = JSON.parse(localStorage.getItem('users')) || [];
  const user = users.find((u) => u.name === name);

  if (user) {
    localStorage.setItem('currentUser', JSON.stringify(user));
    return user;
  } else {
    alert('Пользователь не найден. Зарегистрируйтесь.');
    return null;
  }
}

// Проверка авторизации при загрузке страницы
function checkAuth() {
  const savedUser = localStorage.getItem('currentUser');
  if (savedUser) {
    user = JSON.parse(savedUser);
    count = user.progress.count || 0;
    dailyData = user.progress.dailyData || {};
    dailyDataWithTime = user.progress.dailyDataWithTime || {};
    updateUI();
    loginSection.style.display = 'none';
    appSection.style.display = 'block';
    userNameSpan.textContent = user.name || 'Аноним';
  }
}

// Обновление интерфейса
function updateUI() {
  counterElement.textContent = `Количество: ${count}`;
  updateComment();
  if (user) {
    user.progress.count = count;
    user.progress.dailyData = dailyData;
    user.progress.dailyDataWithTime = dailyDataWithTime;
    saveUserToLocalStorage(user);
  }
}

// Сохранение пользователя в localStorage
function saveUserToLocalStorage(user) {
  const users = JSON.parse(localStorage.getItem('users')) || [];
  const userIndex = users.findIndex((u) => u.id === user.id);
  if (userIndex !== -1) {
    users[userIndex] = user;
    localStorage.setItem('users', JSON.stringify(users));
  }
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

// Регистрация нового пользователя
registerBtn.addEventListener('click', () => {
  if (!isLicenseAccepted) return;

  const userName = userNameInput.value.trim() || 'Аноним';
  if (!userName) {
    alert('Введите имя.');
    return;
  }

  user = registerUser(userName);
  if (user) {
    checkAuth();
    alert(`Вы успешно зарегистрированы. Ваш ID: ${user.id}`);
  }
});

// Вход пользователя
loginBtn.addEventListener('click', () => {
  if (!isLicenseAccepted) return;

  const userName = userNameInput.value.trim();
  if (!userName) {
    alert('Введите имя.');
    return;
  }

  user = loginUser(userName);
  if (user) {
    checkAuth();
    alert(`Добро пожаловать, ${user.name}!`);
  }
});

// Выход
logoutBtn.addEventListener('click', () => {
  localStorage.removeItem('currentUser');
  user = null;
  loginSection.style.display = 'block';
  appSection.style.display = 'none';
});

// Обработчик кнопки "Начать"
startBtn.addEventListener('click', () => {
  count++;
  const today = new Date().toISOString().split('T')[0]; // Сегодняшняя дата в формате YYYY-MM-DD
  const now = new Date().toLocaleTimeString(); // Текущее время
  if (!dailyDataWithTime[today]) {
    dailyDataWithTime[today] = [];
  }
  dailyDataWithTime[today].push(now);
  dailyData[today] = (dailyData[today] || 0) + 1;
  updateUI();
  renderCalendar(currentDate);
});

// Обработчик кнопки "Сбросить"
resetBtn.addEventListener('click', () => {
  const today = new Date().toISOString().split('T')[0]; // Сегодняшняя дата в формате YYYY-MM-DD
  count -= dailyData[today] || 0; // Уменьшаем общее количество на сегодняшние данные
  dailyData[today] = 0; // Сбрасываем данные за сегодня
  dailyDataWithTime[today] = []; // Очищаем данные о времени
  updateUI();
  renderCalendar(currentDate);
});

// Смена темы
themeToggleBtn.addEventListener('click', () => {
  if (body.classList.contains('dark-theme')) {
    body.classList.remove('dark-theme');
    themeIcon.src = 'banana-light.ico';
    localStorage.setItem('theme', 'light');
  } else {
    body.classList.add('dark-theme');
    themeIcon.src = 'banana-night.ico';
    localStorage.setItem('theme', 'dark');
  }
});

// Проверка сохраненной темы при загрузке страницы
const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'dark') {
  body.classList.add('dark-theme');
  themeIcon.src = 'banana-night.ico';
} else {
  themeIcon.src = 'banana-light.ico';
}

// Календарь
function renderCalendar(date) {
  const year = date.getFullYear();
  const month = date.getMonth();
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const daysInMonth = lastDay.getDate();
  const startingDay = firstDay.getDay();

  currentMonthElement.textContent = new Intl.DateTimeFormat('ru-RU', { month: 'long', year: 'numeric' }).format(date);

  calendarGrid.innerHTML = '';

  for (let i = 0; i < startingDay; i++) {
    const emptyDay = document.createElement('div');
    emptyDay.classList.add('day', 'empty');
    calendarGrid.appendChild(emptyDay);
  }

  for (let i = 1; i <= daysInMonth; i++) {
    const day = document.createElement('div');
    day.classList.add('day');
    day.textContent = i;
    const dayDate = new Date(year, month, i).toISOString().split('T')[0];
    if (dailyData[dayDate]) {
      day.classList.add('active');
    }
    if (dayDate === new Date().toISOString().split('T')[0]) {
      day.classList.add('today');
    }
    day.addEventListener('click', () => {
      selectedDate = new Date(year, month, i);
      updateUIForSelectedDate();
      document.querySelectorAll('.day.selected').forEach(d => d.classList.remove('selected'));
      day.classList.add('selected');
    });
    calendarGrid.appendChild(day);
  }
}

function updateUIForSelectedDate() {
  const selectedDateStr = selectedDate.toISOString().split('T')[0];
  const selectedCount = dailyData[selectedDateStr] || 0;
  const selectedTimes = dailyDataWithTime[selectedDateStr] || [];
  commentElement.textContent = `На ${selectedDateStr}: ${selectedCount} действий. Время: ${selectedTimes.join(', ')}`;
}

fetch('https://mioamio.github.io/podrukoy/user-data.json')
  .then(response => response.json())
  .then(userData => {
    const user = userData.response[0];
    console.log('Данные пользователя:', user);
  })
  .catch(error => console.error('Ошибка при получении данных:', error));

prevMonthBtn.addEventListener('click', () => {
  currentDate.setMonth(currentDate.getMonth() - 1);
  renderCalendar(currentDate);
});

nextMonthBtn.addEventListener('click', () => {
  currentDate.setMonth(currentDate.getMonth() + 1);
  renderCalendar(currentDate);
});

// Инициализация календаря
renderCalendar(currentDate);

// Проверка авторизации при загрузке страницы
checkAuth();

// Инициализация пользователей при загрузке страницы
initializeUsers();

// Обновление видимости кнопок социальной авторизации при загрузке
updateUIAfterLicenseAcceptance();
