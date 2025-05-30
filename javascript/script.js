// Redirect to profile page after login
function goToHomePage() {
    localStorage.setItem("isLoggedIn", "true");
    window.location.href = 'index.html';
}
//User profile update
function userProfile() {
    const profile = loadUserProfile();
    //Update profile
    const nameHeader = document.getElementById("displayNameHeader");
    const nameField = document.getElementById("displayName");
    const emailField = document.getElementById("displayEmail");
    const phoneField = document.getElementById("displayPhone");
    const birthdayField = document.getElementById("displayBirthday");
    const prefsField = document.getElementById("displayPreferences");
    if (nameHeader) nameHeader.textContent = profile.name;
    if (nameField) nameField.textContent = profile.name;
    if (emailField) emailField.textContent = profile.email;
    if (phoneField) phoneField.textContent = profile.phone;
    if (birthdayField) {
        const raw = profile.birthday;
        if (raw.includes("-")) {
            const [yyyy, mm, dd] = raw.split("-");
            birthdayField.textContent = `${dd}/${mm}/${yyyy}`;
        } else {
            birthdayField.textContent = raw
        }
    }
    if (prefsField) prefsField.textContent = profile.preferences.trim();
}
// Update display with saved information
function updateDisplay() {
    const displayName = document.getElementById("displayName");
    const displayEmail = document.getElementById("displayEmail");
    const displayPrefs = document.getElementById("displayPrefs");

    if (displayName) displayName.innerText = localStorage.getItem("name") || "Ana Alb";
    if (displayEmail) displayEmail.innerText = localStorage.getItem("email") || "ana@gmail.com";
    if (displayPrefs) displayPrefs.innerText = localStorage.getItem("preferences") || "None";
}

// Logout user and clear localStorage
function logout() {
    localStorage.clear();
    alert("You have been logged out.");
    window.location.href = "index.html";
}
//View details logic
function viewDetails(title) {
    localStorage.setItem("selectedEvent", title);
    let currentPage;
    if (window.location.pathname.includes("all-events.html")) {
        currentPage = "all-events.html";
    } else if (window.location.pathname.includes("saved-events.html")) {
        currentPage = "saved-events.html";
    } else {
        currentPage = "event-recommendations.html";
    }
    localStorage.setItem("backDestination", currentPage);
    window.location.href = 'event-details.html';
}

//Notification bell logic
function checkNotifications() {
    const today = new Date();
    const tickets = JSON.parse(localStorage.getItem("allTickets")) || [];
    const dropdown = document.getElementById("notifDropdown");
    const notifCount = document.getElementById("notifCount");
    if (!dropdown || !notifCount) return;
    let notifications = JSON.parse(localStorage.getItem("notifications")) || [];

    tickets.forEach(ticket => {
        if (!ticket.dateISO) return;
        const eventDate = new Date(ticket.dateISO);
        const diffDays = Math.floor((eventDate - today) / (1000 * 60 * 60 * 24));
        const addUniqueNotification = (message) => {
            if (!notifications.some(n => n.message === message)) {
                notifications.push({message, read: false});
            }
        }
        //Notifications before or on the day of the event
        if (diffDays === 2) addUniqueNotification(`"${ticket.title}"is in 2 days.`);
        else if (diffDays === 1) addUniqueNotification(`"${ticket.title}"is tomorrow.`);
        else if (diffDays === 0) addUniqueNotification(`"${ticket.title}"is today!!`);
        //when a ticket is brought
        if (ticket.confirmed === true) {
            addUniqueNotification(`Your booking for "${ticket.title}" is confirmed!`);
        }
    });
    localStorage.setItem("notifications", JSON.stringify(notifications));
    const unreadCount = notifications.filter(n => !n.read).length;
    notifCount.innerText = unreadCount.toString();
    notifCount.style.display = unreadCount > 0 ? "inline-block" : "none";
    dropdown.innerHTML = notifications.length === 0
    ? "<p>No new notifications</p>" : "";

    notifications.forEach((note, index) => {
        const wrapper = document.createElement("div");
        wrapper.className = "notification-item";
        if (note.read) wrapper.classList.add("read");
        const p = document.createElement("p");
        p.innerText = note.message;
        p.onclick = () => {
            notifications[index].read = true;
            localStorage.setItem("notifications", JSON.stringify(notifications));
            checkNotifications(); // Refresh notifications
        };
        const removeBtn = document.createElement("span");
        removeBtn.innerText = "✕";
        removeBtn.className = "remove-notif";
        removeBtn.onclick = (e) => {
            e.stopPropagation();
            notifications = notifications.filter((_, i) => i !== index);
            localStorage.setItem("notifications", JSON.stringify(notifications));
            checkNotifications(); // Refresh
        };
        wrapper.appendChild(p);
        wrapper.appendChild(removeBtn);
        dropdown.appendChild(wrapper);
    });
}

document.addEventListener("DOMContentLoaded", () => {
    const bell = document.getElementById("notif-icon");
    const dropdown = document.getElementById("notifDropdown");
    const avatarDropdown = document.getElementById("avatarDropdown");
    const events = JSON.parse(localStorage.getItem("events")) || [];
    if (bell) {
        bell.addEventListener("click", (event) => {
            event.stopPropagation();
            dropdown.classList.toggle("visible");
            avatarDropdown.classList.remove("visible");
        });
    }
    document.addEventListener("click", (e) => {
        if (dropdown && (!bell || (!dropdown.contains(e.target) && !bell.contains(e.target)))) {
            dropdown.classList.remove("visible");
        }
        const avatar = document.querySelector(".avatar");
        if (avatarDropdown && !avatarDropdown.contains(e.target) && !avatar.contains(e.target)) {
            avatarDropdown.classList.remove("visible");
        }
    });
    updateDisplay();
    userProfile();
    checkNotifications();

    //Handles features button clicks
    document.querySelectorAll(".feature-btn").forEach(btn => {
        btn.addEventListener("click", () => {
            const selectedTag = btn.getAttribute("data-tag").toLowerCase().trim();
            if (selectedTag === "go-events") {
                window.location.href="all-events.html";
                return;
            }
            document.querySelectorAll(".feature-btn").forEach(b => b.classList.remove("active"));
            btn.classList.add("active");
            //Show/hide feature cards
            document.querySelectorAll(".feature-card").forEach(card => {
                const cardTag =card.getAttribute("data-tag").toLowerCase().trim();
                if (selectedTag === "all" || selectedTag === cardTag) {
                    card.style.display = "block";
                } else {
                    card.style.display = "none";
                }
            });
        });
    });
    //Show all features cards by default
    document.querySelectorAll(".feature-card").forEach(card => {
        card.style.display = "block";
    });
    //Images slideshow
    document.querySelectorAll(".feature-card").forEach(card => {
        const images = card.querySelectorAll(".slide-image");
        let current = 0;
        if (images.length > 0) {
            images[current].classList.add("active");
        }
        const updateSlide = (newIndex) => {
            images[current].classList.remove("active");
            current = (newIndex + images.length) % images.length;
            images[current].classList.add("active");
        };
        const prevBtn = card.querySelector(".arrow-prev");
        const nextBtn = card.querySelector(".arrow-next");

        if (prevBtn && nextBtn && images.length > 1) {
            prevBtn.addEventListener("click", (e) => {
                e.stopPropagation();
                updateSlide(current - 1);
            });
            nextBtn.addEventListener("click", (e) => {
                e.stopPropagation();
                updateSlide(current + 1);
            });
        }
    });

    //Recommendations
    const container = document.getElementById("recommendations");
    const prefsRaw = (localStorage.getItem("preferences") || "").split(",");

    if (container) {
        const showAll = window.location.pathname.includes("all-events.html");
        const savedprefs = prefsRaw.map(p => p.trim().toLowerCase());

        events.forEach((event) => {
            const match = event.tags.some(tag => savedprefs.includes(tag.toLowerCase()));
            if (!showAll && !match && savedprefs.length) return;

            const card = document.createElement("div");
            card.className = "event-card";
            card.setAttribute("data-tags", event.tags.join(",").toLowerCase());
            card.innerHTML = `
<img src="${event.img}" alt="${event.title}" />
<div class="event-info">
<h3>${event.title}</h3>
<p><strong>Date:</strong> ${event.date}</p>
<p><strong>Location:</strong> ${event.location}</p>
<div class="event-actions">
<button class="primary book-btn" data-tag="${event.title}">Book Ticket</button>
<button class="secondary" onclick="viewDetails('${event.title}')">View Details</button>
<button class="save-btn">Save Event</button>
</div>
</div>
`;
            container.appendChild(card);
        });
        localStorage.setItem("events", JSON.stringify(events));
        document.querySelectorAll('.book-btn').forEach(btn => {
            btn.addEventListener("click", () => {
                const title = btn.getAttribute('data-tag');
                localStorage.setItem("selectedEvent", title);
                window.location.href = "payment.html";
            });
        });
        const calendarContainer = document.getElementById("calendarEvents");
        if (calendarContainer) {
            const allTickets = JSON.parse(localStorage.getItem("allTickets")) || [];
            if (allTickets.length === 0) {
                calendarContainer.innerHTML = "<p>No booked events found.</p>";
            } else {
                allTickets.forEach(ticket => {
                    const card = document.createElement("div");
                    card.className = "event-card";
                    card.innerHTML = `
      <img src="${ticket.image}" alt="${ticket.title}" />
      <div class="event-info">
        <h3>${ticket.title}</h3>
        <p><strong>Date:</strong> ${ticket.date}</p>
        <p><strong>Location:</strong> ${ticket.location}</p>
        <p><strong>Seat:</strong> ${ticket.seat}</p>
      </div>
    `;
                    calendarContainer.appendChild(card);
                });
            }
        }
    }
});

