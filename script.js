tailwind.config = {
    theme: {
        extend: {
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
            },
            colors: {
                brand: {
                    50: '#f0fdfa',
                    100: '#ccfbf1',
                    500: '#14b8a6',
                    600: '#0d9488',
                    900: '#134e4a',
                }
            }
        }
    }
};

let currentDate = new Date();
let selectedDate = new Date();
const locale = 'sv-SE';

const mockEvents = {
    default: [
        { time: '07:00', title: 'Morgonrutin', icon: 'coffee', color: 'text-amber-300' },
        { time: '18:00', title: 'Tänd fasadbelysning', icon: 'lightbulb', color: 'text-yellow-300' }
    ],
    weekend: [
        { time: '09:00', title: 'Robotdammsugare startar', icon: 'bot', color: 'text-blue-300' },
        { time: '20:00', title: 'Filmkväll (Dämpa ljus)', icon: 'tv', color: 'text-purple-300' }
    ]
};

function init() {
    updateClock();
    setInterval(updateClock, 1000);
    renderCalendar();
    updateEventsPanel();
    lucide.createIcons();
}

function updateClock() {
    const now = new Date();
    const timeString = now.toLocaleTimeString(locale, { hour: '2-digit', minute: '2-digit' });
    document.getElementById('clockTime').textContent = timeString;
}

function renderCalendar() {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const monthYearFormatter = new Intl.DateTimeFormat(locale, { month: 'long', year: 'numeric' });
    document.getElementById('monthYearDisplay').textContent = monthYearFormatter.format(currentDate);

    const sidebarDateFormatter = new Intl.DateTimeFormat(locale, { weekday: 'long', day: 'numeric', month: 'long' });
    document.getElementById('sidebarDateStr').textContent = capitalize(sidebarDateFormatter.format(selectedDate));

    const grid = document.getElementById('calendarGrid');
    grid.innerHTML = '';

    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0);

    let firstDayIndex = firstDayOfMonth.getDay() - 1;
    if (firstDayIndex === -1) firstDayIndex = 6;

    const today = new Date();

    const prevMonthLastDay = new Date(year, month, 0).getDate();
    for (let i = firstDayIndex; i > 0; i--) {
        grid.appendChild(createDayCell(prevMonthLastDay - i + 1, year, month - 1, true));
    }

    for (let i = 1; i <= lastDayOfMonth.getDate(); i++) {
        const isToday = i === today.getDate() && month === today.getMonth() && year === today.getFullYear();
        const isSelected = i === selectedDate.getDate() && month === selectedDate.getMonth() && year === selectedDate.getFullYear();
        grid.appendChild(createDayCell(i, year, month, false, isToday, isSelected));
    }

    const totalCells = firstDayIndex + lastDayOfMonth.getDate();
    const remainingCells = 42 - totalCells;
    for (let i = 1; i <= remainingCells; i++) {
        grid.appendChild(createDayCell(i, year, month + 1, true));
    }
}

function createDayCell(day, year, month, isFiller, isToday = false, isSelected = false) {
    const cell = document.createElement('button');
    const targetDate = new Date(year, month, day);
    const isWeekend = targetDate.getDay() === 0 || targetDate.getDay() === 6;

    cell.className = `
        aspect-square flex flex-col items-center justify-center rounded-xl sm:rounded-2xl 
        transition-all duration-200 relative group w-full p-1 sm:p-2 border border-transparent
    `;

    const textSpan = document.createElement('span');
    textSpan.textContent = day;
    textSpan.className = 'text-sm sm:text-base font-medium z-10 relative';

    if (isFiller) {
        cell.classList.add('text-slate-300', 'hover:bg-slate-50', 'hover:text-slate-500');
    } else {
        if (isToday && isSelected) {
            cell.classList.add('bg-brand-600', 'text-white', 'shadow-lg', 'shadow-brand-500/40', 'scale-105');
        } else if (isToday) {
            cell.classList.add('bg-brand-100', 'text-brand-700', 'border-brand-200');
        } else if (isSelected) {
            cell.classList.add('bg-slate-800', 'text-white', 'shadow-lg', 'scale-105');
        } else {
            cell.classList.add('hover:bg-slate-100', 'active:scale-95');
            if (isWeekend) cell.classList.add('text-slate-500');
            else cell.classList.add('text-slate-700');
        }

        cell.addEventListener('click', () => {
            selectedDate = targetDate;
            currentDate = new Date(year, month, 1);
            renderCalendar();
            updateEventsPanel();
        });

        if (day % 3 === 0 && !isFiller) {
            const dot = document.createElement('div');
            dot.className = `w-1.5 h-1.5 rounded-full absolute bottom-1.5 sm:bottom-2 ${isToday && isSelected ? 'bg-white' : 'bg-brand-400'}`;
            cell.appendChild(dot);
        }
    }

    cell.appendChild(textSpan);
    return cell;
}

function updateEventsPanel() {
    const eventsList = document.getElementById('eventsList');
    eventsList.innerHTML = '';

    const isWeekend = selectedDate.getDay() === 0 || selectedDate.getDay() === 6;
    const events = isWeekend ? mockEvents.weekend : mockEvents.default;

    events.forEach(evt => {
        const item = document.createElement('div');
        item.className = 'flex items-start gap-4 p-3 rounded-xl bg-white/10 hover:bg-white/20 transition-colors border border-white/5';

        item.innerHTML = `
            <div class="mt-0.5 ${evt.color}">
                <i data-lucide="${evt.icon}" class="w-5 h-5"></i>
            </div>
            <div>
                <p class="text-xs font-semibold text-brand-200 mb-0.5">${evt.time}</p>
                <p class="text-sm font-medium text-white">${evt.title}</p>
            </div>
        `;
        eventsList.appendChild(item);
    });

    lucide.createIcons();
}

function changeMonth(offset) {
    currentDate.setMonth(currentDate.getMonth() + offset);
    renderCalendar();
}

function goToToday() {
    currentDate = new Date();
    selectedDate = new Date();
    renderCalendar();
    updateEventsPanel();
}

function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

window.addEventListener('DOMContentLoaded', init);