//Save user profile
function saveUserProfile ({name, email, password, birthday, phone, preferences}) {
    localStorage.setItem("name", name);
    localStorage.setItem("email", email);
    localStorage.setItem("password", password);
    localStorage.setItem("birthday", birthday);
    localStorage.setItem("phone", phone);
    localStorage.setItem("preferences", preferences.join(", "));
    localStorage.setItem("isLoggedIn", "true");
}
function loadUserProfile () {
    return {
        name: localStorage.getItem("name") || "Your Name",
        email: localStorage.getItem("email") || "-",
        birthday: localStorage.getItem("birthday") || "-",
        phone: localStorage.getItem("phone") || "-",
        preferences: localStorage.getItem("preferences") || "None",
    };
}
function registerUser() {
    const name = document.getElementById("regName").value.trim();
    const email = document.getElementById("regEmail").value.trim();
    const password = document.getElementById("regPassword").value;
    const birthday = document.getElementById("regBirthday").value;
    const phone = document.getElementById("regPhone").value.trim();
    const preferences = Array.from(document.querySelectorAll("input[name='preferences']:checked")).map(p => p.value);

    // Save to localStorage
    saveUserProfile({name, email, password, birthday, phone, preferences});
    // Redirect to homepage
    window.location.href = "index.html";
}


//Save event
function saveEvent(title) {
    const saved = JSON.parse(localStorage.getItem("savedEvents")) || [];
    const fullEvent = events.find(e => e.title === title);
    const alreadySaved = saved.find(e => e.title === title);
    if (!fullEvent) {
        alert("No events found.");
        return;
    }
    if (alreadySaved) {
        alert(`${title} is already in your favourites.`);
        return;
    }
    saved.push({
        title: fullEvent.title,
        date: fullEvent.date,
        location: fullEvent.location,
        description: fullEvent.description,
        image: fullEvent.img,
    });
    localStorage.setItem("savedEvents", JSON.stringify(saved));
    alert(`${title} saved successfully to your favourites.`);
}
document.addEventListener("click", function (e) {
    if (e.target.classList.contains("save-btn")) {
        const info = e.target.closest(".event-info");
        if (info) {
            const titleElement = info.querySelector("h3");
            if (titleElement) {
                const title = titleElement.innerText;
                saveEvent(title);
            }
        }
    }
});

//Book ticket
function bookTicket(title) {
    localStorage.setItem("selectedEvent", title);
    localStorage.setItem("backDestination", location.pathname);
    window.location.href = "payment.html";
}