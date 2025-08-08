// Event-specific JavaScript for events.html
let currentDate = new Date();
let currentMonth = currentDate.getMonth();
let currentYear = currentDate.getFullYear();

// Event data
const eventData = {
    'youth-camp': {
        title: 'Youth Summer Camp Registration',
        date: '2023-07-15',
        description: 'Three days of powerful worship, inspiring teachings, and outdoor activities.'
    },
    'prayer-meeting': {
        title: 'Prayer & Fasting Registration',
        date: '2023-08-02',
        description: 'Monthly prayer and fasting session for spiritual breakthrough.'
    },
    'couples-retreat': {
        title: 'Couples Retreat Registration',
        date: '2023-08-05',
        description: 'Strengthen your marriage through biblical principles and fellowship.'
    },
    'sunday-service': {
        title: 'Sunday Service Registration',
        date: 'weekly',
        description: 'Join us for weekly worship, preaching, and fellowship.'
    }
};

// Countdown timer for featured event
function updateCountdown() {
    const eventDate = new Date('2023-07-15T00:00:00').getTime();
    const now = new Date().getTime();
    const distance = eventDate - now;
    
    if (distance > 0) {
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);
        
        const daysEl = document.getElementById('days');
        const hoursEl = document.getElementById('hours');
        const minutesEl = document.getElementById('minutes');
        const secondsEl = document.getElementById('seconds');
        
        if (daysEl) daysEl.textContent = days.toString().padStart(2, '0');
        if (hoursEl) hoursEl.textContent = hours.toString().padStart(2, '0');
        if (minutesEl) minutesEl.textContent = minutes.toString().padStart(2, '0');
        if (secondsEl) secondsEl.textContent = seconds.toString().padStart(2, '0');
    } else {
        const countdownEl = document.getElementById('camp-countdown');
        if (countdownEl) {
            countdownEl.innerHTML = '<p class="text-center text-xl font-bold">Event has started!</p>';
        }
    }
}

// Update countdown every second
setInterval(updateCountdown, 1000);
updateCountdown();

// Calendar functions
function generateCalendar(month, year) {
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const today = new Date();
    
    let calendarHTML = '';
    let currentRow = '<div class="calendar-days-row" style="display: flex; margin-bottom: 5px;">';
    let dayCounter = 0;
    
    // Empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
        currentRow += '<div class="calendar-day" style="flex: 1; min-width: 40px; height: 40px; display: flex; align-items: center; justify-content: center;"></div>';
        dayCounter++;
    }
    
    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
        const isToday = today.getDate() === day && today.getMonth() === month && today.getFullYear() === year;
        const hasEvent = hasEventOnDay(day, month, year);
        
        let classes = 'calendar-day';
        if (isToday) classes += ' today';
        if (hasEvent) classes += ' has-event';
        
        currentRow += `<div class="${classes}" style="flex: 1; min-width: 40px; height: 40px; display: flex; align-items: center; justify-content: center;" onclick="selectDate(${day}, ${month}, ${year})">${day}</div>`;
        dayCounter++;
        
        // Start a new row after Saturday (or when we reach the end of the month)
        if (dayCounter % 7 === 0 || day === daysInMonth) {
            currentRow += '</div>';
            calendarHTML += currentRow;
            currentRow = '<div class="calendar-days-row" style="display: flex; margin-bottom: 5px;">';
        }
    }
    
    const calendarDaysEl = document.getElementById('calendar-days');
    if (calendarDaysEl) {
        calendarDaysEl.innerHTML = calendarHTML;
    }
    
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'];
    const monthYearEl = document.getElementById('calendar-month-year');
    if (monthYearEl) {
        monthYearEl.textContent = `${monthNames[month]} ${year}`;
    }
}

function hasEventOnDay(day, month, year) {
    // Sample event dates - in a real app, this would come from a database
    const eventDates = [
        { day: 15, month: 6, year: 2023 }, // July 15 (month is 0-indexed)
        { day: 2, month: 7, year: 2023 },  // August 2
        { day: 5, month: 7, year: 2023 },  // August 5
        { day: 12, month: 7, year: 2023 }, // August 12
        { day: 19, month: 7, year: 2023 }, // August 19
        { day: 26, month: 7, year: 2023 }  // August 26
    ];
    
    return eventDates.some(event => 
        event.day === day && event.month === month && event.year === year
    );
}

function previousMonth() {
    currentMonth--;
    if (currentMonth < 0) {
        currentMonth = 11;
        currentYear--;
    }
    generateCalendar(currentMonth, currentYear);
}

function nextMonth() {
    currentMonth++;
    if (currentMonth > 11) {
        currentMonth = 0;
        currentYear++;
    }
    generateCalendar(currentMonth, currentYear);
}

function selectDate(day, month, year) {
    if (hasEventOnDay(day, month, year)) {
        alert(`Events on ${day}/${month + 1}/${year}:\n- Check the events list for details`);
    }
}

// Registration modal functions
function openRegistrationModal(eventId) {
    const modal = document.getElementById('registration-modal');
    const modalTitle = document.getElementById('modal-title');
    const eventIdInput = document.getElementById('event-id');
    
    const event = eventData[eventId];
    if (event && modalTitle && eventIdInput) {
        modalTitle.textContent = event.title;
        eventIdInput.value = eventId;
    }
    
    if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

function closeRegistrationModal() {
    const modal = document.getElementById('registration-modal');
    const form = document.getElementById('event-registration-form');
    
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
    
    if (form) {
        form.reset();
    }
}

function shareEvent(eventId) {
    if (navigator.share) {
        navigator.share({
            title: 'Join us for this event!',
            text: 'I thought you might be interested in this church event.',
            url: window.location.href
        });
    } else {
        const url = window.location.href;
        navigator.clipboard.writeText(url).then(() => {
            alert('Event link copied to clipboard!');
        }).catch(() => {
            alert('Unable to copy link. Please copy the URL manually.');
        });
    }
}

function addToCalendar(eventId) {
    // This would generate a calendar file or link
    alert('Add to calendar functionality would be implemented here for event: ' + eventId);
}

function viewEventDetails(eventId) {
    alert('Event details modal would open here for: ' + eventId);
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize calendar
    generateCalendar(currentMonth, currentYear);
    
    // Event filter functionality
    const filterButtons = document.querySelectorAll('.filter-btn');
    const eventCards = document.querySelectorAll('.event-card');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            const filter = button.dataset.filter;
            
            eventCards.forEach(card => {
                if (filter === 'all' || card.dataset.category.includes(filter)) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });
    
    // Quick registration form
    const quickForm = document.getElementById('quick-registration-form');
    if (quickForm) {
        quickForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const formData = new FormData(e.target);
            const data = Object.fromEntries(formData);
            
            // Simulate form submission
            alert('Registration submitted successfully! We will contact you with more details.');
            e.target.reset();
        });
    }
    
    // Event registration form
    const eventForm = document.getElementById('event-registration-form');
    if (eventForm) {
        eventForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const formData = new FormData(e.target);
            const data = Object.fromEntries(formData);
            
            // Simulate form submission
            alert('Registration completed successfully! You will receive a confirmation email shortly.');
            closeRegistrationModal();
        });
    }
    
    // Close modal when clicking outside
    const modal = document.getElementById('registration-modal');
    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal-overlay')) {
                closeRegistrationModal();
            }
        });
    }
});