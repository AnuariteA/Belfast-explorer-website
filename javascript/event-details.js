//Event details displayed
document.addEventListener("DOMContentLoaded", function () {
    const backButton = document.querySelector(".back-button-container button");
    const backTo = localStorage.getItem("backDestination") || "event-recommendations.html";
    backButton.onclick = () => location.href = backTo;

    const eventDetailsContainer = document.getElementById("eventDetails");
    const selectedTitle = localStorage.getItem("selectedEvent");
    const event = events.find(e => e.title === selectedTitle);

    if (event && eventDetailsContainer) {
        document.getElementById("eventTitle").innerText = event.title;
        eventDetailsContainer.innerHTML = `
<div class="event-info-details">
<img src="${event.img}" alt="${event.title}" class="event-img-side" />
<div class="event-text-content">
<h3>${event.title}</h3>
<p><strong>Date:</strong> ${event.date}</p>
<p><strong>Location:</strong> ${event.location}</p>
<p><strong>Description:</strong> ${event.description}</p>
<p><strong>Price:</strong> ${event.price}</p>
<p><strong>Available Seats:</strong> ${event.seats}</p>
<div class="event-actions">
<button class="primary" onclick="bookTicket('${event.title}')">Book Ticket</button>
<button class="save-btn" onclick="saveEvent('${event.title}')">Save Event</button>
</div>
</div>
</div>`;
    } else {
        eventDetailsContainer.innerHTML = `<p>Event not found. Please go back and try again!</p>`;
    }
});