let count = 0;
let user = null;
let currentDate = new Date();
let selectedDate = currentDate;
let dailyData = {};
let dailyDataWithTime = {};
let isLicenseAccepted = localStorage.getItem('licenseAccepted') === 'true';

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

// Обработчики для модального окна
const acceptLicense = document.getElementById('acceptLicense');
acceptLicense.addEventListener('click', () => {
  licenseModal.style.display = 'none';
  localStorage.setItem('licenseAccepted', 'true');
});

const declineLicense = document.getElementById('declineLicense');
declineLicense.addEventListener('click', () => {
  licenseModal.style.display = 'none';
});

const licenseModal = document.getElementById('licenseModal');
const showLicense = document.getElementById('showLicense');
showLicense.addEventListener('click', () => {
  licenseModal.style.display = 'flex';
});

// Обработчик для входа через VK
vkLoginBtn.addEventListener('click', () => {
  const vkAuthUrl = `https://oauth.vk.com/authorize?client_id=52967003&display=page&redirect_uri=https://podrukoy.xyz/&scope=email&response_type=token&v=5.131&state=123456`;
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
    fetch(`https://api.vk.com/method/users.get?user_ids=${userId}&fields=first_name,last_name&access_token=${accessToken}&v=5.131`)
      .then(response => response.json())
      .then(data => {
        const user = data.response[0];
        const fullName = `${user.first_name} ${user.last_name}`;

        const userData = {
          name: fullName,
          sub: userId,
          email: email || 'no-email@vk.com'
        };

        localStorage.setItem('currentUser', JSON.stringify(userData));
        updateUIAfterLogin(userData);
      })
      .catch(error => {
        console.error('Ошибка при получении данных пользователя:', error);
      });
  }
}

// Обновление интерфейса после входа
function updateUIAfterLogin(user) {
  document.getElementById('userNameSpan').textContent = user.name;
  document.getElementById('userIdSpan').textContent = user.sub;
  document.getElementById('loginSection').style.display = 'none'; // Скрываем секцию авторизации
  document.getElementById('appSection').style.display = 'block'; // Показываем секцию приложения
}

// Проверка авторизации при загрузке страницы
function checkAuth() {
  const savedUser = localStorage.getItem('currentUser');
  if (savedUser) {
    const user = JSON.parse(savedUser);
    updateUIAfterLogin(user);
  } else {
    // Если пользователь не авторизован, показываем секцию авторизации
    document.getElementById('loginSection').style.display = 'block';
    document.getElementById('appSection').style.display = 'none';
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
