//Renders calendar for a full year
document.addEventListener("DOMContentLoaded", () => {
    const calendarContainer = document.getElementById("yearCalendar");
    const currentYear = 2025;
    const today = new Date();
    let currentMonth = new Date().getMonth();
    const monthNames = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    //Events booked appear on calendar
    const bookedTickets = JSON.parse(localStorage.getItem("allTickets")) || [];
    function renderCalendar(monthIndex) {
        calendarContainer.innerHTML = "";
        const monthDiv = document.createElement("div");
        monthDiv.className = "month";

        const monthHeader = document.createElement("div");
        monthHeader.className = "month-header";
        monthHeader.innerHTML = `
<button class="nav-arrow" id="prevMonth"><i class="fas fa-chevron-left"></i></button>
<span class="month-title">${monthNames[monthIndex]} ${currentYear}</span>
<button class="nav-arrow" id="nextMonth"><i class="fas fa-chevron-right"></i></button>
`;
        monthDiv.appendChild(monthHeader);
        const grid = document.createElement("div");
        grid.className = "month-grid";
        // Days labels
        const days = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
        days.forEach(day => {
            const dayLabel = document.createElement("div");
            dayLabel.className = "day-label";
            dayLabel.textContent = day;
            grid.appendChild(dayLabel);
        });
        const firstDay = new Date(currentYear, monthIndex, 1).getDay();
        const totalDays = new Date(currentYear, monthIndex + 1, 0).getDate();
        for (let i = 0; i < firstDay; i++) {
            const empty = document.createElement("div");
            empty.className = "empty-day";
            grid.appendChild(empty);
        }
        // Day cells
        for (let d = 1; d <= totalDays; d++) {
            const dayCell = document.createElement("div");
            dayCell.className = "day-cell";
            dayCell.textContent = d.toString();
            const dateStr = `${currentYear}-${String(monthIndex + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
            dayCell.setAttribute("data-date", dateStr);
            const isToday =
                today.getFullYear() === currentYear &&
                today.getMonth() === monthIndex &&
                today.getDate() === d;
            if (isToday) {
                dayCell.classList.add("today");
            }

            //Events booked by user highlighted
            const event = bookedTickets.find(ticket => ticket.date === dateStr);
            if (event) {
                dayCell.classList.add("booked");
                dayCell.title = event.title;
                const img = document.createElement("img");
                img.src = event.image;
                img.alt = event.title || "Event preview";
                img.className = "event-img-circle";
                dayCell.appendChild(img);
                dayCell.addEventListener("click", () => {
                    const popup = document.createElement("div");
                    popup.className = "calendar-popup";
                    popup.innerHTML = `
<div class="popup-content">
<img src="${event.image}" alt="${event.title}" />
<h4><strong>${event.title}</strong></h4>
<p><strong>Location: ${event.location}</strong></p>
<button class="close-popup">Close</button>
</div>`;
                    document.body.appendChild(popup);
                    popup.querySelector(".close-popup").onclick = () => {
                        popup.remove();
                    };
                });
            }
            grid.appendChild(dayCell);
        }
        monthDiv.appendChild(grid);
        calendarContainer.appendChild(monthDiv);
        document.getElementById("prevMonth").onclick = () => {
            currentMonth = (currentMonth - 1 + 12) % 12;
            renderCalendar(currentMonth);
        };
        document.getElementById("nextMonth").onclick = () => {
            currentMonth = (currentMonth + 1) % 12;
            renderCalendar(currentMonth);
        };
    }
    renderCalendar(currentMonth);
    document.getElementById("toggleSheet").addEventListener("click", (e) => {
        e.stopPropagation();
        const sheet = document.getElementById("bottomSheet");
        if (sheet.classList.contains("expanded")) {
            renderEventCards();
        }
    });
    //Close the toggle when clicking outside it
    const toggle = document.getElementById("toggleSheet");
    toggle.addEventListener("click", (e) => {
        e.stopPropagation();
        const sheet = document.getElementById("bottomSheet");
        const isExpanded = sheet.classList.toggle("expanded");
        if (isExpanded) renderEventCards();
    });

    document.addEventListener("click", (e) => {
        const sheet = document.getElementById("bottomSheet");
        const toggle = document.getElementById("toggleSheet");
        if (!sheet.contains(e.target) && !toggle.contains(e.target)) {
            sheet.classList.remove("expanded");
        }
    });

    const eventsList = document.getElementById("eventsList");
    function renderEventCards() {
        const allTickets = JSON.parse(localStorage.getItem("allTickets")) || [];
        const savedEvents = JSON.parse(localStorage.getItem("savedEvents")) || [];
        eventsList.innerHTML = "";
        //Merge booked and saved events(favourites), avoiding duplicates
        const combinedMap = new Map();

        allTickets.forEach(ticket => {
            combinedMap.set(ticket.title, ticket);
        });
        savedEvents.forEach((event) => {
            if (!combinedMap.has(event.title)) {
                combinedMap.set(event.title, {
                    ...event,
                    image: event.image || "images/default.jpg"
                });
            }
        });
        const combinedEvents = Array.from(combinedMap.values());
        if (combinedEvents.length === 0) {
            eventsList.innerHTML = "<p>No upcoming events found.</p>";
            return;
        }
        combinedEvents.forEach((event) => {
            const imgSrc = event.image || "images/default.jpg";
            const card = document.createElement("div");
            card.className = "event-card";
            card.innerHTML = `
<img src="${imgSrc}" alt="${event.title}" />
<p>${event.title}</p>`;
            card.style.cursor = "pointer";
            card.addEventListener("click", () => {
                localStorage.setItem("selectedEvent", event.title);
                localStorage.setItem("backDestination", "calendar.html");
                window.location.href = "event-details.html";
            });
            eventsList.appendChild(card);
        });
    }
    renderEventCards();
});