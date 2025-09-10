document.addEventListener('DOMContentLoaded', () => {
    const saffronBtn = document.getElementById('saffron-btn');
    const whiteBtn = document.getElementById('white-btn');
    const greenBtn = document.getElementById('green-btn');

    const fetchLatestContent = async () => {
        return [
            { date: '2025-08-25', title: 'Content for August 25' },
            { date: '2025-08-22', title: 'Content for August 22' },
            { date: '2025-08-18', title: 'Content for August 18' }
        ];
    };

    const renderLatestContent = async () => {
        const content = await fetchLatestContent();
        if (content.length >= 3) {
            const [first, second, third] = content;
            saffronBtn.textContent = new Date(first.date).toLocaleDateString('en-US', { day: 'numeric', month: 'short' });
            saffronBtn.setAttribute('data-date', first.date);
            whiteBtn.textContent = new Date(second.date).toLocaleDateString('en-US', { day: 'numeric', month: 'short' });
            whiteBtn.setAttribute('data-date', second.date);
            greenBtn.textContent = new Date(third.date).toLocaleDateString('en-US', { day: 'numeric', month: 'short' });
            greenBtn.setAttribute('data-date', third.date);
        }
        [saffronBtn, whiteBtn, greenBtn].forEach(btn => {
            btn.addEventListener('click', () => {
                console.log(`Navigating to content for date: ${btn.getAttribute('data-date')}`);
            });
        });
    };
    renderLatestContent();

    // Last 7 Days
    const lastSevenDaysContainer = document.getElementById('last-seven-days-container');
    const renderLastSevenDays = () => {
        lastSevenDaysContainer.innerHTML = '';
        for (let i = 0; i < 7; i++) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            const fullDate = `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')}`;
            const btn = document.createElement('button');
            btn.className = 'day-btn';
            btn.textContent = date.getDate();
            btn.setAttribute('data-date', fullDate);
            btn.addEventListener('click', () => {
                console.log(`Navigating to content for date: ${fullDate}`);
            });
            lastSevenDaysContainer.appendChild(btn);
        }
    };
    renderLastSevenDays();

    // Calendar
    const calendarGrid = document.getElementById('calendar-grid');
    const currentMonthYearEl = document.getElementById('current-month-year');
    const prevMonthBtn = document.getElementById('prev-month');
    const nextMonthBtn = document.getElementById('next-month');
    const calendarToggleBtn = document.getElementById('calendar-toggle-btn');
    const calendarContainer = document.getElementById('calendar-container');
    let currentDate = new Date();
    const contentDates = ['2025-08-01','2025-08-05','2025-08-12','2025-08-18','2025-08-22','2025-08-25'];

    const renderCalendar = (date) => {
        const year = date.getFullYear();
        const month = date.getMonth();
        currentMonthYearEl.textContent = `${date.toLocaleString('en-US',{month:'long'})} ${year}`;
        calendarGrid.innerHTML = '';
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month+1, 0);
        for (let i=0;i<firstDay.getDay();i++){
            const empty = document.createElement('div');
            calendarGrid.appendChild(empty);
        }
        for (let d=1; d<=lastDay.getDate(); d++) {
            const dayCell = document.createElement('div');
            dayCell.className = 'day-cell';
            dayCell.textContent = d;
            const fullDate = `${year}-${String(month+1).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
            if (contentDates.includes(fullDate)) {
                dayCell.classList.add('day-active');
                dayCell.addEventListener('click', () => console.log(`Navigating to content for date: ${fullDate}`));
            }
            calendarGrid.appendChild(dayCell);
        }
    };
    prevMonthBtn.addEventListener('click', () => {
        currentDate.setMonth(currentDate.getMonth()-1);
        renderCalendar(currentDate);
    });
    nextMonthBtn.addEventListener('click', () => {
        currentDate.setMonth(currentDate.getMonth()+1);
        renderCalendar(currentDate);
    });
    calendarToggleBtn.addEventListener('click', () => {
        calendarContainer.classList.toggle('hidden');
        renderCalendar(currentDate);
    });
});