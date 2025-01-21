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
const inviteCodeInput = document.getElementById('inviteCodeInput');
const loginWithInviteBtn = document.getElementById('loginWithInviteBtn');
const inviteCodeDisplay = document.getElementById('inviteCodeDisplay');
const userNameInput = document.getElementById('userNameInput');
const userNameSpan = document.getElementById('userNameSpan');

// GitHub Gist
const GIST_ID = '95fe90fca947982ef31e7c82e087eb5f'; // Ваш Gist ID
const GITHUB_TOKEN = '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'; // Ваш GitHub Token

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
    inviteCodeInput.disabled = false;
    loginWithInviteBtn.disabled = false;
  } else {
    inviteCodeInput.disabled = true;
    loginWithInviteBtn.disabled = true;
  }
}

// Инициализация первого пригласительного кода
function initializeFirstInviteCode() {
  const users = JSON.parse(localStorage.getItem('users')) || {};
  if (Object.keys(users).length === 0) {
    const firstInviteCode = '001'; // Первый код всегда 001
    users[firstInviteCode] = {
      id: 'superuser', // ID суперпользователя
      inviteCode: firstInviteCode,
      name: 'Администратор', // Имя суперпользователя
    };
    localStorage.setItem('users', JSON.stringify(users));
    console.log('Первый пригласительный код создан:', firstInviteCode);
  }
}

// Генерация случайного пригласительного кода
function generateInviteCode() {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let code = '';
  for (let i = 0; i < 6; i++) { // Длина кода — 6 символов
    code += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return code;
}

// Проверка авторизации при загрузке страницы
function checkAuth() {
  const savedUser = localStorage.getItem('user');
  if (savedUser) {
    user = JSON.parse(savedUser);
    count = parseInt(localStorage.getItem(`${user.id}_count`)) || 0;
    dailyData = JSON.parse(localStorage.getItem(`${user.id}_dailyData`)) || {};
    dailyDataWithTime = JSON.parse(localStorage.getItem(`${user.id}_dailyDataWithTime`)) || {};
    updateUI();
    loginSection.style.display = 'none';
    appSection.style.display = 'block';
    inviteCodeDisplay.textContent = user.inviteCode;
    userNameSpan.textContent = user.name || 'Аноним';
  }
}

// Обновление интерфейса
function updateUI() {
  counterElement.textContent = `Количество: ${count}`;
  updateComment();
  localStorage.setItem(`${user.id}_count`, count);
  localStorage.setItem(`${user.id}_dailyData`, JSON.stringify(dailyData));
  localStorage.setItem(`${user.id}_dailyDataWithTime`, JSON.stringify(dailyDataWithTime));
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

// Вход по приглашению
loginWithInviteBtn.addEventListener('click', async () => {
  if (!isLicenseAccepted) return;

  const inviteCode = inviteCodeInput.value.trim();
  const userName = userNameInput.value.trim() || 'Аноним'; // Имя пользователя

  if (!inviteCode) {
    alert('Введите пригласительный код');
    return;
  }

  // Проверка, существует ли пользователь с таким кодом
  const users = JSON.parse(localStorage.getItem('users')) || {};

  // Суперпользователь всегда может войти с кодом 001
  if (inviteCode === '001') {
    user = {
      id: 'superuser',
      inviteCode: '001', // Код суперпользователя остается неизменным
      name: 'Администратор',
    };
    localStorage.setItem('user', JSON.stringify(user));
    checkAuth();
    alert('Вы вошли как суперпользователь.');
    return;
  }

  if (users[inviteCode]) {
    // Если код найден, входим в систему
    const existingUser = users[inviteCode];

    // Создаем нового пользователя для вошедшего
    const newInviteCodeForNewUser = generateInviteCode();
    user = {
      id: `user_${Date.now()}`, // Уникальный ID пользователя
      inviteCode: newInviteCodeForNewUser,
      name: userName, // Сохраняем имя пользователя
    };
    users[newInviteCodeForNewUser] = user; // Добавляем нового пользователя в список

    // Генерируем новый код для пользователя, который передал код
    if (existingUser.id !== 'superuser') { // Не меняем код суперпользователя
      const newInviteCodeForExistingUser = generateInviteCode();
      users[newInviteCodeForExistingUser] = existingUser;
      existingUser.inviteCode = newInviteCodeForExistingUser;
    }

    // Удаляем старый код
    delete users[inviteCode];

    // Сохраняем обновленные данные
    localStorage.setItem('users', JSON.stringify(users));
    localStorage.setItem('user', JSON.stringify(user));
    checkAuth();
    alert(`Ваш новый пригласительный код: ${newInviteCodeForNewUser}`);
  } else {
    // Если код не найден, сообщаем об ошибке
    alert('Неверный пригласительный код. Пожалуйста, используйте действительный код.');
    return;
  }

  // Сохраняем данные о пользователях в GitHub Gist
  await saveUsersToGist(users);
});

// Сохранение данных о пользователях в GitHub Gist
async function saveUsersToGist(users) {
  const data = JSON.stringify(users, null, 2); // Красивое форматирование JSON
  const response = await fetch(`https://api.github.com/gists/${GIST_ID}`, {
    method: 'PATCH',
    headers: {
      'Authorization': `token ${GITHUB_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      files: {
        'users.json': {
          content: data,
        },
      },
    }),
  });

  if (response.ok) {
    console.log('Данные о пользователях успешно сохранены в Gist.');
  } else {
    console.error('Ошибка при сохранении данных в Gist:', await response.text());
  }
}

// Загрузка данных о пользователях из GitHub Gist
async function loadUsersFromGist() {
  const response = await fetch(`https://api.github.com/gists/${GIST_ID}`, {
    headers: {
      'Authorization': `token ${GITHUB_TOKEN}`,
    },
  });

  if (response.ok) {
    const gist = await response.json();
    const users = JSON.parse(gist.files['users.json'].content);
    localStorage.setItem('users', JSON.stringify(users));
    console.log('Данные о пользователях успешно загружены из Gist.');
  } else {
    console.error('Ошибка при загрузке данных из Gist:', await response.text());
  }
}

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

// Инициализация первого кода при загрузке страницы
initializeFirstInviteCode();

// Загрузка данных о пользователях из Gist при загрузке страницы
loadUsersFromGist();

// Обновление видимости кнопок социальной авторизации при загрузке
updateUIAfterLicenseAcceptance();