document.addEventListener('DOMContentLoaded', () => {
    const localStorageKey = 'myRhythmData_v1';
    const genderKey = 'myRhythmGender_v1';
    const themeKey = 'myRhythmTheme_v1';
    const bodyEl = document.body;
    const welcomeMessageEl = document.getElementById('welcomeMessage');
    const nicknameInputEl = document.getElementById('nicknameInput');
    const saveNicknameBtn = document.getElementById('saveNicknameBtn');
    const addSessionBtn = document.getElementById('addSessionBtn');
    const sessionCountInputEl = document.getElementById('sessionCountInput');
    const sessionNotesInputEl = document.getElementById('sessionNotesInput');
    const feedbackMessageEl = document.getElementById('feedbackMessage');
    const todayCountEl = document.getElementById('todayCount');
    const totalCountEl = document.getElementById('totalCount');
    const averagePerDayEl = document.getElementById('averagePerDay');
    const heatmapCalendarEl = document.getElementById('heatmapCalendar');
    const legendContainerEl = document.querySelector('.legend');
    const tipsContainerEl = document.getElementById('tipsContainer');
    const resetDataBtn = document.getElementById('resetDataBtn');
    const genderModalEl = document.getElementById('genderModal');
    const selectMaleBtn = document.getElementById('selectMale');
    const selectFemaleBtn = document.getElementById('selectFemale');
    const themeToggleBtn = document.getElementById('themeToggleBtn');
    const themeIconEl = document.getElementById('themeIcon');
    const selectedDateInputEl = document.getElementById('selectedDateInput');
    const selectedDateInfoEl = document.getElementById('selectedDateInfo');
    const selectedDateCountEl = document.getElementById('selectedDateCount');
    const selectedDateNotesEl = document.getElementById('selectedDateNotes');
    const noNotesMessageEl = selectedDateNotesEl ? selectedDateNotesEl.querySelector('.no-notes') : null;
    let appData = { nickname: null, sessions: [] };
    let currentGender = localStorage.getItem(genderKey);
    let currentTheme = localStorage.getItem(themeKey) || 'light';
    const tips = [
        { title: "Прислушивайтесь к себе", text: "Обращайте внимание на свои ощущения и желания. Это ключ к самопознанию и глубокому удовольствию." },
        { title: "Без осуждения, с наслаждением", text: "Принимайте свою сексуальность как естественную и прекрасную часть жизни. Эта статистика — ваш личный дневник страсти." },
        { title: "Ритуалы и атмосфера", text: "Создайте особое настроение. Свечи, музыка, ароматы – все, что помогает вам раскрыться и почувствовать момент." },
        { title: "Исследуйте свои фантазии", text: "Не бойтесь мечтать и воплощать. Ваши самые смелые мысли могут стать источником невероятных ощущений." },
        { title: "Мастурбация как искусство", text: "Это не просто физиология, это танец с собственным телом. Изучайте его, любите его, наслаждайтесь каждым движением." },
        { title: "Энергия страсти", text: "Направьте эту мощную энергию не только на удовольствие, но и на творчество, на достижение целей. Почувствуйте ее силу." },
        { title: "Ваше тело – ваш храм", text: "Относитесь к нему с любовью и уважением. Забота о себе усиливает каждое прикосновение, каждое ощущение." }
    ];
    function applyThemeAndGender() {
        if (!bodyEl) return;
        bodyEl.classList.remove('light-theme', 'dark-theme', 'male-theme-base', 'female-theme-base');
        bodyEl.classList.add(currentTheme + '-theme');
        if (currentGender) {
            bodyEl.classList.add(currentGender + '-theme-base');
        }
        if (themeIconEl) {
            themeIconEl.src = currentTheme === 'light' ? 'banana-light.ico' : 'banana-night.ico';
            themeIconEl.alt = currentTheme === 'light' ? 'Светлая тема' : 'Темная тема';
        }
        renderLegend();
        renderHeatmap();
    }
    function handleGenderSelection(gender) {
        currentGender = gender;
        localStorage.setItem(genderKey, gender);
        if (genderModalEl) genderModalEl.style.display = 'none';
        applyThemeAndGender();
        updateUI();
    }
    function toggleTheme() {
        currentTheme = currentTheme === 'light' ? 'dark' : 'light';
        localStorage.setItem(themeKey, currentTheme);
        applyThemeAndGender();
    }
    function loadData() {
        const storedData = localStorage.getItem(localStorageKey);
        if (storedData) {
            try {
                appData = JSON.parse(storedData);
                if (!appData.sessions) appData.sessions = [];
                if (appData.nickname === undefined) appData.nickname = null;
            } catch (e) {
                appData = { nickname: null, sessions: [] };
            }
        }
    }
    function saveData() {
        try {
            localStorage.setItem(localStorageKey, JSON.stringify(appData));
        } catch (e) {
            showFeedback("Не удалось сохранить данные. Хранилище может быть переполнено.", "error");
        }
    }
    function getTodayDateString() { return new Date().toISOString().split('T')[0]; }
    function addSession() {
        if (!sessionCountInputEl || !sessionNotesInputEl) return;
        const todayStr = getTodayDateString();
        const count = parseInt(sessionCountInputEl.value) || 1;
        const note = sessionNotesInputEl.value.trim();
        if (count < 1) { showFeedback("Количество должно быть не меньше 1.", "error"); return; }
        let sessionForToday = appData.sessions.find(s => s.date === todayStr);
        if (sessionForToday) {
            sessionForToday.count += count;
            if (note) {
                if (!sessionForToday.notes) sessionForToday.notes = [];
                sessionForToday.notes.push(note);
            }
        } else {
            appData.sessions.push({ date: todayStr, count: count, notes: note ? [note] : [] });
        }
        appData.sessions.sort((a, b) => new Date(a.date) - new Date(b.date));
        saveData();
        updateUI();
        showFeedback(`Сессия (${count} раз(а)) добавлена! Наслаждайтесь моментом.`, "success");
        sessionCountInputEl.value = "1";
        sessionNotesInputEl.value = "";
    }
    function updateStats() {
        if (!todayCountEl || !totalCountEl || !averagePerDayEl) return;
        const todayStr = getTodayDateString();
        const todaySession = appData.sessions.find(s => s.date === todayStr);
        todayCountEl.textContent = todaySession ? todaySession.count : 0;
        const totalSessionsCount = appData.sessions.reduce((sum, s) => sum + s.count, 0);
        totalCountEl.textContent = totalSessionsCount;
        if (appData.sessions.length > 0) {
            const firstDate = new Date(appData.sessions[0].date);
            let lastDateConsidered = new Date(appData.sessions[appData.sessions.length - 1].date);
            if (todaySession && new Date(todayStr) > lastDateConsidered) { lastDateConsidered = new Date(todayStr); }
            const diffTime = Math.max(lastDateConsidered - firstDate, 0);
            const diffDays = Math.max(Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1, 1);
            averagePerDayEl.textContent = (totalSessionsCount / diffDays).toFixed(1);
        } else {
            averagePerDayEl.textContent = "0.0";
        }
    }
    function displayDataForDate(dateString) {
        if (!selectedDateInfoEl || !selectedDateCountEl || !selectedDateNotesEl || !noNotesMessageEl) return;
        const sessionForDate = appData.sessions.find(s => s.date === dateString);
        selectedDateInfoEl.style.display = 'block';
        if (sessionForDate) {
            selectedDateCountEl.textContent = sessionForDate.count;
            selectedDateNotesEl.innerHTML = '';
            if (sessionForDate.notes && sessionForDate.notes.length > 0) {
                noNotesMessageEl.style.display = 'none';
                sessionForDate.notes.forEach(noteText => {
                    const li = document.createElement('li');
                    li.textContent = noteText;
                    selectedDateNotesEl.appendChild(li);
                });
            } else {
                noNotesMessageEl.style.display = 'block';
            }
        } else {
            selectedDateCountEl.textContent = 0;
            selectedDateNotesEl.innerHTML = '';
            noNotesMessageEl.style.display = 'block';
        }
    }
    function renderHeatmap() {
        if (!heatmapCalendarEl) return;
        heatmapCalendarEl.innerHTML = '';
        const daysToShow = 91;
        const today = new Date();
        let startDate = new Date(today);
        startDate.setDate(today.getDate() - daysToShow + 1);
        const dayOfWeek = startDate.getDay();
        const offset = (dayOfWeek === 0) ? 6 : dayOfWeek - 1;
        startDate.setDate(startDate.getDate() - offset);
        const endDate = new Date(today);
        let currentDateIter = new Date(startDate);
        let cellCount = 0;
        const maxCells = daysToShow * 1.5;
        while (currentDateIter <= endDate && cellCount < maxCells) {
            const dateStr = currentDateIter.toISOString().split('T')[0];
            const session = appData.sessions.find(s => s.date === dateStr);
            const count = session ? session.count : 0;
            const dayEl = document.createElement('div');
            dayEl.classList.add('heatmap-day');
            if (currentDateIter <= today) {
                dayEl.title = `${dateStr}: ${count} сессий`;
                if (count > 0 && count <= 1) dayEl.classList.add('level-1');
                else if (count > 1 && count <= 2) dayEl.classList.add('level-2');
                else if (count > 2 && count <= 4) dayEl.classList.add('level-3');
                else if (count > 4) dayEl.classList.add('level-4');
                dayEl.setAttribute('tabindex', '0'); // Make it focusable
                dayEl.setAttribute('role', 'button');
                dayEl.setAttribute('aria-label', `Данные за ${dateStr}: ${count} сессий`);
                dayEl.addEventListener('click', () => {
                    if (selectedDateInputEl) {
                        selectedDateInputEl.value = dateStr;
                        displayDataForDate(dateStr);
                    }
                });
                 dayEl.addEventListener('keydown', (e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        if (selectedDateInputEl) {
                            selectedDateInputEl.value = dateStr;
                            displayDataForDate(dateStr);
                            selectedDateInputEl.focus(); // Focus on the date input after selection
                        }
                    }
                });
            } else {
                 dayEl.style.visibility = "hidden";
            }
            heatmapCalendarEl.appendChild(dayEl);
            currentDateIter.setDate(currentDateIter.getDate() + 1);
            cellCount++;
        }
    }
    function renderLegend() {
        if (!legendContainerEl || !bodyEl) return;
        legendContainerEl.innerHTML = '';
        const legendData = [
            { label: 'Нет', class: '', varNameBase: '--current-heatmap-base' },
            { label: 'Мало', class: 'level-1', varNameBase: '--current-heatmap-l1' },
            { label: 'Средне', class: 'level-2', varNameBase: '--current-heatmap-l2' },
            { label: 'Много', class: 'level-3', varNameBase: '--current-heatmap-l3' },
            { label: 'Очень много', class: 'level-4', varNameBase: '--current-heatmap-l4' }
        ];
        const bodyStyles = window.getComputedStyle(bodyEl);
        legendData.forEach(item => {
            const legendItemEl = document.createElement('span');
            legendItemEl.classList.add('legend-item');
            legendItemEl.textContent = item.label;
            const color = bodyStyles.getPropertyValue(item.varNameBase).trim() || '#ccc';
            legendItemEl.style.setProperty('--color', color);
            legendContainerEl.appendChild(legendItemEl);
        });
    }
    function renderTips() {
        if (!tipsContainerEl) return;
        tipsContainerEl.innerHTML = '';
        tips.forEach(tip => {
            const tipEl = document.createElement('div');
            tipEl.classList.add('tip-card');
            tipEl.innerHTML = `<h4>${tip.title}</h4><p>${tip.text}</p>`;
            tipsContainerEl.appendChild(tipEl);
        });
    }
    function updateWelcomeMessage() {
        if (!welcomeMessageEl) return;
        if (appData.nickname) {
            welcomeMessageEl.textContent = `Твой личный ритм, ${appData.nickname}!`;
            if (nicknameInputEl) nicknameInputEl.value = appData.nickname;
        } else {
            welcomeMessageEl.textContent = "Анализируйте свой личный ритм.";
        }
    }
    function saveNickname() {
        if (!nicknameInputEl) return;
        const newNickname = nicknameInputEl.value.trim();
        appData.nickname = newNickname ? newNickname : null;
        saveData();
        updateWelcomeMessage();
        showFeedback(newNickname ? "Псевдоним сохранен!" : "Псевдоним сброшен.", "success");
    }
    function resetData() {
        if (confirm("Вы уверены, что хотите удалить всю статистику? Это действие необратимо.")) {
            appData = { nickname: null, sessions: [] };
            saveData();
            if (nicknameInputEl) nicknameInputEl.value = "";
            if (selectedDateInputEl) selectedDateInputEl.value = "";
            if (selectedDateInfoEl) selectedDateInfoEl.style.display = 'none';
            updateUI();
            showFeedback("Все данные сброшены. Начните новую главу.", "success");
        }
    }
    function showFeedback(message, type = "success") {
        if (!feedbackMessageEl || !bodyEl) return;
        feedbackMessageEl.textContent = message;
        const bodyStyles = window.getComputedStyle(bodyEl);
        const successColor = bodyStyles.getPropertyValue('--current-primary-grad-end').trim() || 'green';
        const errorColor = '#e74c3c';
        feedbackMessageEl.style.color = type === "success" ? successColor : errorColor;
        setTimeout(() => { if (feedbackMessageEl) feedbackMessageEl.textContent = ""; }, 4000);
    }
    function updateUI() {
        updateWelcomeMessage();
        updateStats();
        renderHeatmap();
    }
    function init() {
        loadData();
        applyThemeAndGender();
        if (!currentGender && genderModalEl) {
            genderModalEl.style.display = 'flex';
        } else {
            updateUI();
        }
        renderTips();
        if (selectedDateInputEl) {
             selectedDateInputEl.addEventListener('change', (event) => {
                displayDataForDate(event.target.value);
            });
        }
        if (selectMaleBtn) selectMaleBtn.addEventListener('click', () => handleGenderSelection('male'));
        if (selectFemaleBtn) selectFemaleBtn.addEventListener('click', () => handleGenderSelection('female'));
        if (themeToggleBtn) themeToggleBtn.addEventListener('click', toggleTheme);
        if (addSessionBtn) addSessionBtn.addEventListener('click', addSession);
        if (resetDataBtn) resetDataBtn.addEventListener('click', resetData);
        if (saveNicknameBtn) saveNicknameBtn.addEventListener('click', saveNickname);
        if (nicknameInputEl) nicknameInputEl.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') saveNickname();
        });
    }
    init();
});
