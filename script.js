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

// Модальное окно с пользовательским соглашением
const licenseModal = document.getElementById('licenseModal');
const showLicense = document.getElementById('showLicense');
const acceptLicense = document.getElementById('acceptLicense');
const declineLicense = document.getElementById('declineLicense');

// Обработка входа через Google
function handleCredentialResponse(response) {
  const idToken = response.credential;
  const user = parseJwt(idToken); // Распарсиваем JWT-токен

  // Сохраняем данные пользователя в localStorage
  localStorage.setItem('currentUser', JSON.stringify(user));
  checkAuth(); // Обновляем интерфейс
}

// Функция для распарсивания JWT-токена
function parseJwt(token) {
  const base64Url = token.split('.')[1];
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  return JSON.parse(atob(base64));
}

// Инициализация Google Sign-In
window.onload = function () {
  google.accounts.id.initialize({
    client_id: '432626767315-fddir63v48gd3p1fmttng9us3d7jet9o.apps.googleusercontent.com',
    callback: handleCredentialResponse,
  });

  // Проверка авторизации при загрузке страницы
  checkAuth();
};

// Проверка авторизации
function checkAuth() {
  const savedUser = localStorage.getItem('currentUser');
  if (savedUser) {
    const user = JSON.parse(savedUser);
    document.getElementById('userNameSpan').textContent = user.name || user.given_name || 'Аноним';
    document.getElementById('userIdSpan').textContent = user.sub; // ID пользователя
    document.getElementById('loginSection').style.display = 'none';
    document.getElementById('appSection').style.display = 'block';
  }
}

// Выход
logoutBtn.addEventListener('click', () => {
  localStorage.removeItem('currentUser');
  document.getElementById('loginSection').style.display = 'block';
  document.getElementById('appSection').style.display = 'none';
});

// Обновление интерфейса после принятия/отклонения соглашения
function updateUIAfterLicenseAcceptance() {
  const isLicenseAccepted = localStorage.getItem('licenseAccepted') === 'true';
  const registerBtn = document.getElementById('registerBtn');
  const loginBtn = document.getElementById('loginBtn');

  if (registerBtn && loginBtn) {
    registerBtn.disabled = !isLicenseAccepted;
    loginBtn.disabled = !isLicenseAccepted;
  }
}

// Инициализация календаря
renderCalendar(currentDate);

// Обновление видимости кнопок социальной авторизации при загрузке
updateUIAfterLicenseAcceptance();
