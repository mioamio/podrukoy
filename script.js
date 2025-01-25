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
const userNameSpan = document.getElementById('userNameSpan');
const userIdSpan = document.getElementById('userIdSpan');
const vkLoginBtn = document.getElementById('vkLoginBtn');

// Добавляем обработчик для кнопки "Принять"
const acceptLicense = document.getElementById('acceptLicense');
acceptLicense.addEventListener('click', () => {
  licenseModal.style.display = 'none'; // Скрываем модальное окно
  localStorage.setItem('licenseAccepted', 'true'); // Сохраняем согласие
});

// Добавляем обработчик для кнопки "Отклонить"
const declineLicense = document.getElementById('declineLicense');
declineLicense.addEventListener('click', () => {
  licenseModal.style.display = 'none'; // Скрываем модальное окно
});

// Модальное окно с пользовательским соглашением
const licenseModal = document.getElementById('licenseModal');
const showLicense = document.getElementById('showLicense');

// Обработчик для показа модального окна с соглашением
showLicense.addEventListener('click', () => {
  licenseModal.style.display = 'flex';
});

// Обработчик для входа через VK
vkLoginBtn.addEventListener('click', () => {
  const vkAuthUrl = `https://oauth.vk.com/authorize?client_id=YOUR_VK_APP_ID&display=page&redirect_uri=YOUR_REDIRECT_URI&scope=email&response_type=token&v=5.131&state=123456`;
  window.location.href = vkAuthUrl;
});

// Обработка ответа от VK
function handleVKResponse() {
  const hash = window.location.hash.substring(1);
  const params = new URLSearchParams(hash);
  const accessToken = params.get('access_token');
  const userId = params.get('user_id');
  const email = params.get('email');

  if (accessToken && userId) {
    const user = {
      name: 'Пользователь VK', // Имя можно получить через API VK
      sub: userId,
      email: email || 'no-email@vk.com'
    };

    localStorage.setItem('currentUser', JSON.stringify(user));
    updateUIAfterLogin(user);
  }
}

// Обновление интерфейса после входа
function updateUIAfterLogin(user) {
  document.getElementById('userNameSpan').textContent = user.name;
  document.getElementById('userIdSpan').textContent = user.sub;
  document.getElementById('loginSection').style.display = 'none';
  document.getElementById('appSection').style.display = 'block';
}

// Логика для счетчика нажатий
startBtn.addEventListener('click', () => {
  count++;
  counterElement.textContent = `Количество: ${count}`;
  updateComment();
  saveDailyData();
});

resetBtn.addEventListener('click', () => {
  count = 0;
  counterElement.textContent = `Количество: ${count}`;
  updateComment();
  saveDailyData();
});

function updateComment() {
  if (count < 10) {
    commentElement.textContent = 'Ты начинающий';
  } else if (count < 20) {
    commentElement.textContent = 'Ты продвинутый';
  } else {
    commentElement.textContent = 'Ты мастер!';
  }
}

// Логика для календаря
function renderCalendar(date) {
  const year = date.getFullYear();
  const month = date.getMonth();
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const daysInMonth = lastDay.getDate();
  const startingDay = firstDay.getDay();

  currentMonthElement.textContent = `${date.toLocaleString('ru', { month: 'long' })} ${year}`;

  let calendarHTML = '';
  for (let i = 0; i < startingDay; i++) {
    calendarHTML += `<div class="day"></div>`;
  }

  for (let i = 1; i <= daysInMonth; i++) {
    const dayDate = new Date(year, month, i);
    const isToday = dayDate.toDateString() === new Date().toDateString();
    const isActive = dailyData[dayDate.toDateString()] !== undefined;
    calendarHTML += `<div class="day ${isToday ? 'today' : ''} ${isActive ? 'active' : ''}" data-date="${dayDate.toDateString()}">${i}</div>`;
  }

  calendarGrid.innerHTML = calendarHTML;
}

prevMonthBtn.addEventListener('click', () => {
  currentDate.setMonth(currentDate.getMonth() - 1);
  renderCalendar(currentDate);
});

nextMonthBtn.addEventListener('click', () => {
  currentDate.setMonth(currentDate.getMonth() + 1);
  renderCalendar(currentDate);
});

function saveDailyData() {
  const today = new Date().toDateString();
  dailyData[today] = count;
  localStorage.setItem('dailyData', JSON.stringify(dailyData));
}

function loadDailyData() {
  const savedData = localStorage.getItem('dailyData');
  if (savedData) {
    dailyData = JSON.parse(savedData);
  }
}

// Инициализация календаря и счетчика
loadDailyData();
renderCalendar(currentDate);

// Проверка авторизации при загрузке страницы
function checkAuth() {
  const savedUser = localStorage.getItem('currentUser');
  if (savedUser) {
    const user = JSON.parse(savedUser);
    updateUIAfterLogin(user);
  }
}

// Выход из системы
logoutBtn.addEventListener('click', () => {
  localStorage.removeItem('currentUser');
  document.getElementById('loginSection').style.display = 'block';
  document.getElementById('appSection').style.display = 'none';
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

// Инициализация Google Sign-In
window.onload = function () {
  handleVKResponse(); // Проверка авторизации через VK
  checkAuth(); // Проверка авторизации через Google

  try {
    google.accounts.id.initialize({
      client_id: '432626767315-fddir63v48gd3p1fmttng9us3d7jet9o.apps.googleusercontent.com',
      callback: handleCredentialResponse,
      auto_select: false,
      cancel_on_tap_outside: true,
      prompt_parent_id: "loginSection",
      context: 'signin'
    });

    // Отображаем кнопку входа через Google
    google.accounts.id.renderButton(
      document.getElementById("loginSection"),
      { 
        type: "standard",
        theme: "outline",
        size: "large",
        text: "signin_with",
        shape: "rectangular",
        logo_alignment: "left",
        width: 250
      }
    );
  } catch (error) {
    console.error('Ошибка при инициализации Google Sign-In:', error);
  }
};

// Обработка ответа от Google Sign-In
function handleCredentialResponse(response) {
  if (!response || !response.credential) {
    console.error('Неверный ответ от Google Sign-In');
    return;
  }

  try {
    const idToken = response.credential;
    const decodedToken = parseJwt(idToken);
    
    if (!decodedToken) {
      console.error('Ошибка при декодировании токена');
      return;
    }

    const user = {
      name: decodedToken.name || decodedToken.given_name || 'Аноним',
      sub: decodedToken.sub,
      email: decodedToken.email,
      picture: decodedToken.picture
    };

    localStorage.setItem('currentUser', JSON.stringify(user));
    updateUIAfterLogin(user);
  } catch (error) {
    console.error('Ошибка при обработке входа:', error);
  }
}

// Парсинг JWT токена
function parseJwt(token) {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('Ошибка при парсинге JWT:', error);
    return null;
  }
}
