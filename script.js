let count = 0;
let user = null;
let currentDate = new Date();
let selectedDate = currentDate;
let dailyData = {}; // Данные за каждый день
let dailyDataWithTime = {}; // Данные с временем
let isLicenseAccepted = localStorage.getItem('licenseAccepted') === 'true'; // Проверка принятия соглашения
let selectedGender = localStorage.getItem('selectedGender'); // Выбранный пол

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
const invitedByCodeDisplay = document.getElementById('invitedByCodeDisplay');
const userNameInput = document.getElementById('userNameInput');
const userNameSpan = document.getElementById('userNameSpan');
const generateInviteBtn = document.getElementById('generateInviteBtn'); // Кнопка генерации кода для суперпользователя
const copyInviteCodeBtn = document.getElementById('copyInviteCodeBtn'); // Кнопка копирования промокода

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

// Инициализация пользователей
function initializeUsers() {
  let users = JSON.parse(localStorage.getItem('users')) || {};
  if (!users['superuser']) {
    users['superuser'] = {
      id: 'superuser',
      inviteCode: null,
      name: 'Администратор',
      invitedBy: null,
    };
    localStorage.setItem('users', JSON.stringify(users));
  }
  return users;
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
    inviteCodeDisplay.textContent = user.inviteCode || 'Нет кода'; // У суперпользователя нет кода
    invitedByCodeDisplay.textContent = user.invitedBy || 'Нет кода'; // Код, по которому пригласили
    userNameSpan.textContent = user.name || 'Аноним';
    updateUIForSuperuser(); // Обновляем интерфейс для суперпользователя
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

  const users = initializeUsers(); // Инициализируем пользователей

  // Суперпользователь всегда может войти с кодом 001
  if (inviteCode === '001' && userName === '001') {
    user = {
      id: 'superuser',
      inviteCode: null,
      name: 'Администратор',
      invitedBy: null,
    };
    localStorage.setItem('user', JSON.stringify(user));
    checkAuth();
    alert('Вы вошли как суперпользователь.');
    return;
  }

  if (users[inviteCode]) {
    const newInviteCodeForNewUser = generateInviteCode();
    user = {
      id: `user_${Date.now()}`,
      inviteCode: newInviteCodeForNewUser,
      name: userName,
      invitedBy: inviteCode,
    };
    users[newInviteCodeForNewUser] = user;
    localStorage.setItem('users', JSON.stringify(users));
    localStorage.setItem('user', JSON.stringify(user));
    checkAuth();
    alert(`Ваш новый пригласительный код: ${newInviteCodeForNewUser}`);
  } else {
    alert('Неверный пригласительный код. Пожалуйста, используйте действительный код.');
    return;
  }

  await saveUsersToGist(users);
});

// Обработчик кнопки генерации пригласительного кода для суперпользователя
generateInviteBtn.addEventListener('click', () => {
  const newInviteCode = generateInviteCode(); // Генерируем новый код
  alert(`Новый пригласительный код: ${newInviteCode}`); // Показываем код пользователю

  // Сохраняем новый код в список пользователей
  const users = JSON.parse(localStorage.getItem('users')) || {};
  users[newInviteCode] = {
    id: `user_${Date.now()}`, // Уникальный ID для нового пользователя
    inviteCode: newInviteCode,
    name: 'Новый пользователь', // Имя по умолчанию
    invitedBy: 'superuser', // Приглашен суперпользователем
  };
  localStorage.setItem('users', JSON.stringify(users));

  // Сохраняем данные в GitHub Gist
  saveUsersToGist(users);
});

// Кнопка для копирования пригласительного кода
copyInviteCodeBtn.addEventListener('click', () => {
  const inviteCode = inviteCodeDisplay.textContent;
  if (inviteCode && inviteCode !== 'Нет кода') {
    navigator.clipboard.writeText(inviteCode)
      .then(() => {
        alert('Промокод скопирован в буфер обмена: ' + inviteCode);
      })
      .catch(() => {
        alert('Не удалось скопировать промокод. Скопируйте его вручную.');
      });
  } else {
    alert('Нет доступного промокода для копирования.');
  }
});

// Показываем кнопку генерации пригласительного кода только для суперпользователя
function updateUIForSuperuser() {
  if (user && user.id === 'superuser') {
    generateInviteBtn.style.display = 'block'; // Показываем кнопку
    inviteCodeDisplay.textContent = 'Нет кода'; // У суперпользователя нет кода
    invitedByCodeDisplay.textContent = 'Нет кода'; // Суперпользователь никого не приглашал
  } else {
    generateInviteBtn.style.display = 'none'; // Скрываем кнопку для обычных пользователей
  }
}

// Сохранение данных о пользователях в GitHub Gist
async function saveUsersToGist(users) {
  const data = JSON.stringify(users, null, 2);
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

// Инициализация пользователей при загрузке страницы
initializeUsers();

// Загрузка данных о пользователях из Gist при загрузке страницы
loadUsersFromGist();

// Обновление видимости кнопок социальной авторизации при загрузке
updateUIAfterLicenseAcceptance();

// Выбор пола при первом входе
if (!selectedGender) {
  showGenderSelection();
} else {
  applyGenderTheme(selectedGender);
}

// Функция для отображения выбора пола
function showGenderSelection() {
  const genderSelection = document.createElement('div');
  genderSelection.style.position = 'fixed';
  genderSelection.style.top = '0';
  genderSelection.style.left = '0';
  genderSelection.style.width = '100%';
  genderSelection.style.height = '100%';
  genderSelection.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
  genderSelection.style.display = 'flex';
  genderSelection.style.justifyContent = 'center';
  genderSelection.style.alignItems = 'center';
  genderSelection.style.zIndex = '1000';

  const maleButton = document.createElement('button');
  maleButton.innerHTML = '<img src="banana-light.ico" alt="Мужской" style="width: 100px; height: 100px;">';
  maleButton.style.margin = '20px';
  maleButton.style.cursor = 'pointer';
  maleButton.addEventListener('click', () => {
    selectedGender = 'male';
    localStorage.setItem('selectedGender', 'male');
    applyGenderTheme('male');
    genderSelection.remove();
  });

  const femaleButton = document.createElement('button');
  femaleButton.innerHTML = '<img src="banana-night.ico" alt="Женский" style="width: 100px; height: 100px;">';
  femaleButton.style.margin = '20px';
  femaleButton.style.cursor = 'pointer';
  femaleButton.addEventListener('click', () => {
    selectedGender = 'female';
    localStorage.setItem('selectedGender', 'female');
    applyGenderTheme('female');
    genderSelection.remove();
  });

  genderSelection.appendChild(maleButton);
  genderSelection.appendChild(femaleButton);
  document.body.appendChild(genderSelection);
}

// Применение темы в зависимости от выбранного пола
function applyGenderTheme(gender) {
  if (gender === 'male') {
    body.style.background = 'linear-gradient(135deg, #6a82fb, #fc5c7d)';
  } else if (gender === 'female') {
    body.style.background = 'linear-gradient(135deg, #ff9a9e, #fad0c4)';
  }
}

// Добавляем кнопку для смены пола
const changeGenderBtn = document.createElement('button');
changeGenderBtn.textContent = 'Сменить пол';
changeGenderBtn.style.position = 'fixed';
changeGenderBtn.style.bottom = '20px';
changeGenderBtn.style.right = '20px';
changeGenderBtn.style.zIndex = '1000';
changeGenderBtn.style.padding = '10px 20px';
changeGenderBtn.style.borderRadius = '12px';
changeGenderBtn.style.backgroundColor = '#6a82fb';
changeGenderBtn.style.color = 'white';
changeGenderBtn.style.border = 'none';
changeGenderBtn.style.cursor = 'pointer';
changeGenderBtn.addEventListener('click', () => {
  showGenderSelection();
});

document.body.appendChild(changeGenderBtn);
