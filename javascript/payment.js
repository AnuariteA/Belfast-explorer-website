/*global emailjs */
(function() {
    emailjs.init("7EeeO5wFKbdABqCEf");
})();

//Booking ticket
document.addEventListener("DOMContentLoaded", () => {
    const container = document.getElementById("bookingContainer");
    const selectedEventTitle = localStorage.getItem("selectedEvent");
    const event = events.find(e => e.title === selectedEventTitle);
    if (!event) return container.innerHTML = "<p>Event not found.</p>";

    // STEP 1: Seat selection
    let currentPage = 0;
    const seatsPerPage = 20;
    const totalSeats = event.seats && /^\d+/.test(event.seats) ? parseInt(event.seats.split(" ")[0]) : 0; // when no seat is available
    const totalPages = Math.ceil(totalSeats / seatsPerPage);

    //Select ticket type
    let selectedTicketType = null;
    let selectedMultiplier = null;

    function renderSeatGrid(page) {
        const grid = document.createElement("div");
        grid.className = "seat-grid-layout";
        const start = page * seatsPerPage + 1;
        const end = Math.min(start + seatsPerPage - 1, totalSeats);

        const reservedSeats = [1, 5, 10, 18, 55, 60, 80, 45, 78, 90];
        const allTickets = JSON.parse(localStorage.getItem("allTickets")) || [];
        const userEmail = localStorage.getItem("email");
        const userReservedSeats = allTickets.filter(t => t.title === event.title && t.guestEmail === userEmail)
            .map(t => parseInt(t.seat.replace("Seat", ""), 10));
        const combinedReservedSeats = [...new Set([...reservedSeats, ...userReservedSeats])];

        for (let i = start; i <= end; i++) {
            const seat = document.createElement("div");
            seat.className = "seat-icon available";
            seat.innerHTML = `<i class="fas fa-chair"></i>`;
            const isReserved = combinedReservedSeats.includes(i); // reserved seats
            if (isReserved) {
                seat.classList.remove("available");
                seat.classList.add("reserved");
            } else {
                seat.addEventListener("click", () => {
                    document.querySelectorAll(".seat-icon.selected").forEach(el => el.classList.remove("selected"));
                    seat.classList.add("selected");
                    document.getElementById("selectedSeatLabel").textContent = `Seat ${i}`;
                    seat.dataset.value = `Seat ${i}`;
                });
            }
            seat.setAttribute("data-seat-num", i.toString());
            grid.appendChild(seat);
        }
        const seatNav = `
<div class="seat-nav">
<button ${page === 0 ? 'disabled' : ''} onclick="changeSeatPage(${page - 1})">
<i class="fa-solid fa-chevron-left"></i>
</button>
<span> ${page + 1} of ${totalPages}</span>
<button ${page + 1 >= totalPages ? 'disabled' : ''} onclick="changeSeatPage(${page + 1})">
<i class="fa-solid fa-chevron-right"></i>
</button>
</div>
`;
        const seatLegend = `
<div class="seat-legend">
<span><i class="fa-solid fa-chair available"></i>Available</span>
<span><i class="fa-solid fa-chair selected"></i>Selected</span>
<span><i class="fa-solid fa-chair reserved"></i>Reserved</span>
</div>
`;
        const ticketOptionsHTML = `
<div class="ticket-type-section">
<div class="ticket-type-list">
<label class="ticket-row">
<input type="radio" name="ticketType" value="General" data-multiplier="1" required />
<span class="ticket-label-text">General Admission</span>
<span class="ticket-label-price">£${event.basePrice.toFixed(2)}</span>
</label>
<label class="ticket-row">
<input type="radio" name="ticketType" value="Student (+18) / NHS" data-multiplier="0.8" required />
<span class="ticket-label-text">Student (+18) / NHS</span>
<span class="ticket-label-price">£${(event.basePrice * 0.8).toFixed(2)}</span>
</label>
<label class="ticket-row">
<input type="radio" name="ticketType" value="Child" data-multiplier="0.6" />
<span class="ticket-label-text">Child (4 to 15)</span>
<span class="ticket-label-price">£${(event.basePrice * 0.6).toFixed(2)}</span>
</label>
</div>
</div>
`;
        container.innerHTML = `
<section class="booking-step">
<h2>${event.title}</h2>
<p><strong>Date & Time:</strong> ${event.date}</p>
<p><strong>Location:</strong> ${event.location}</p>
<h3>Select Your Seats</h3>
<div id="seatGridContainer"></div>
${seatNav}
${seatLegend}
${ticketOptionsHTML}
</section>
<footer class="booking-footer">
<div class="seat-number-display">
<span>Seat Number:</span>
<strong id="selectedSeatLabel">None</strong>
</div>
<button id="seatConfirmBtn" class="confirm-btn">CONFIRM</button>
</footer>           
`;

        document.getElementById("seatGridContainer").appendChild(grid);
        document.getElementById("selectedSeatLabel").textContent = "None";
        document.getElementById("seatConfirmBtn").onclick = () => {
            const selected = document.querySelector(".seat-icon.selected");
            if (!selected) return alert("Please select a seat.");

            const selectedTicketRadio = document.querySelector('input[name="ticketType"]:checked');
            if (!selectedTicketRadio) return alert("Please select a ticket");
            selectedTicketType = selectedTicketRadio.value;
            selectedMultiplier = parseFloat(selectedTicketRadio.dataset.multiplier);
            const ticketPrice = event.basePrice * selectedMultiplier;
            renderStep2(selected.dataset.value, ticketPrice);
        };
    }

    window.changeSeatPage = function (page) {
        currentPage = page;
        renderStep1();
    };

    function renderStandingTicketOptions() {
        container.innerHTML = `
<section class="booking-step">
<h2>${event.title}</h2>
<p><strong>Date & Time:</strong> ${event.date}</p>
<p><strong>Location:</strong> ${event.location}</p>
<h3>Standing Tickets</h3>
<div class="ticket-type-section">
<div class="ticket-type-list">
<label class="ticket-row">
<input type="radio" name="ticketType" value="General" data-multiplier="1" required />
<span class="ticket-label-text">General Admission</span>
<span class="ticket-label-price">£${event.basePrice.toFixed(2)}</span>
</label>
<label class="ticket-row">
<input type="radio" name="ticketType" value="Student (+18) / NHS" data-multiplier="0.8" required />
<span class="ticket-label-text">Student (+18) / NHS</span>
<span class="ticket-label-price">£${(event.basePrice * 0.8).toFixed(2)}</span>
</label>
<label class="ticket-row">
<input type="radio" name="ticketType" value="Child" data-multiplier="0.6" />
<span class="ticket-label-text">Child (4 to 15)</span>
<span class="ticket-label-price">£${(event.basePrice * 0.6).toFixed(2)}</span>
</label>
</div>
</div>
<footer class="booking-footer">
<div class="seat-number-display"></div>
<button id="confirmStandingBtn" class="confirm-btn">CONFIRM</button>
</footer>
</section>
`;
        document.getElementById("confirmStandingBtn").onclick = () => {
            const selectedRadio = document.querySelector('input[name="ticketType"]:checked');
            if (!selectedRadio) return alert("Please select a ticket!");
            selectedTicketType = selectedRadio.value;
            selectedMultiplier = parseFloat(selectedRadio.dataset.multiplier);
            const ticketPrice = event.basePrice * selectedMultiplier;
            renderStep2("Standing", ticketPrice);
        };
    }
    if (totalSeats === 0) {
        renderStandingTicketOptions();
    } else {
        renderSeatGrid(currentPage);
    }

    function parseEventDateString(humanDate) {
        const iso = Date.parse(humanDate);
        if (!isNaN(iso)) return new Date(iso);
        const daysOfWeek = {
            "Sunday": 0, "Monday": 1, "Tuesday": 2, "Wednesday": 3,
            "Thursday": 4, "Friday": 5, "Saturday": 6
        };

        const match = humanDate.match(/(Sunday|Monday|Tuesday|Wednesday|Thursday|Friday|Saturday).*?(\d{1,2})(:\d{2})?\s*(AM|PM)?/i);
        if (!match) return null;

        const dayName = match[1];
        let hour = parseInt(match[2]);
        const minute = match[3] ? parseInt(match[3].slice(1)) : 0;
        const ampm = match[4] || "PM";

        if (ampm.toUpperCase() === "PM" && hour < 12) hour += 12;
        if (ampm.toUpperCase() === "AM" && hour === 12) hour = 0;

        const today = new Date();
        const targetDay = daysOfWeek[dayName];
        let daysUntilEvent = (targetDay - today.getDay() + 7) % 7;
        if (daysUntilEvent === 0) daysUntilEvent = 7;

        const eventDate = new Date(today);
        eventDate.setDate(today.getDate() + daysUntilEvent);
        eventDate.setHours(hour, minute, 0, 0);

        return eventDate;
    }

    function renderStep1() {
        renderSeatGrid(currentPage);
    }

    // STEP 2: Payment Options
    function renderStep2(seat, ticketPrice) {
        const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
        container.innerHTML = `
<section class="booking-step">
<h2>${event.title}</h2>
<div class="ticket-preview">
<h2 class="price">£${ticketPrice.toFixed(2)}</h2>
<p class="vat-note">5% VAT included</p>
<p><strong>Seat:</strong> ${seat}</p>
<p><strong>Ticket type:</strong> ${selectedTicketType}</p>
</div>
<form id="paymentForm">
<h3>Payment Method</h3>
<div class="payment-method-row">
<label class="payment-option"><input type="radio" name="payment" value="Card"><img src="images/Mastercard_logo.png" alt="Card" /></label>
<label class="payment-option"><input type="radio" name="payment" value="Apple Pay"><img src="images/apple-pay.png" alt="Apple Pay" /></label>
<label class="payment-option"><input type="radio" name="payment" value="PayPal"><img src="images/paypal-logo.png" alt="PayPal" /></label>
<label class="payment-option"><input type="radio" name="payment" value="Voucher"><img src="images/giftvoucher.jpg" alt="Gift Voucher" /></label>
</div>

<div id="cardInputs">
<input type="text" id="cardName" placeholder="Name on Card" />
<input type="text" id="cardNumber" placeholder="Number on Card" maxlength="16" />
<input type="text" id="cardExpiry" placeholder="MM/YY" maxlength="5"/>
<input type="text" id="cardCVV" placeholder="CVV" maxlength="3"/>
</div>

<!--If user is  not logged in, show guest input form-->
${!isLoggedIn ? `
<div class="guest-information">
<input type="text" id="guestName" placeholder="Your Name" required />
<input type="email" id="guestEmail" placeholder="Your Email" required />
</div> ` : ""}
<input type="text" id="discountCode" placeholder="Discount code (optional)" />
<button type="submit" class="pay-button">Confirm Payment - £${ticketPrice.toFixed(2)}</button>
</form>
</section>
`;
        //Card expiry date format
        const expiryInput = document.getElementById("cardExpiry");
        expiryInput.addEventListener("input", (e) => {
            let raw = e.target.value;
            let digitsOnly = "";
            // Manually strip non-digit characters
            for (let i = 0; i < raw.length; i++) {
                if (raw[i] >= '0' && raw[i] <= '9') {
                    digitsOnly += raw[i];
                }
            }
            if (digitsOnly.length > 5) digitsOnly = digitsOnly.slice(0, 5);
            if (digitsOnly.length > 2) {
                digitsOnly = digitsOnly.slice(0, 2) + "/" + digitsOnly.slice(2);
            }
            e.target.value = digitsOnly;
        });

        //Card fields details
        const form = document.getElementById("paymentForm");

        form.onsubmit = e => {
            e.preventDefault();
            console.log("Form submitted");
            const selectedPayment = document.querySelector("input[name='payment']:checked");
            if (!selectedPayment) return alert("Please select a payment method");
            const method = selectedPayment.value;
            const discount = document.getElementById("discountCode").value.trim();
            const parsedDate = parseEventDateString(event.date);
            if (!parsedDate) return alert("Could not parse the event date.");

            //Only retrieve user guest info if applicable
            const guestName = document.getElementById("guestName")?.value || localStorage.getItem("name") || "";
            const guestEmail = document.getElementById("guestEmail")?.value || localStorage.getItem( "email") || "";

            //Paypal payment simulation
            if (method === "PayPal") {
                alert("This is a prototype, please return to booking page and select another payment option.");
                return ;
            }
            //Apple pay payment simulation
            if (method === "Apple Pay") {
                const applePayModal = document.createElement("div");
                applePayModal.className = "apple-pay-modal";
                applePayModal.id = "appleModal";
                applePayModal.innerHTML = `
<div class="apple-pay-content">
<img src="images/apple-pay.png" alt="Apple Pay" />
<p class="apple-pay-price">Total: <strong>£${ticketPrice.toFixed(2)}</strong></p>
<button class="apple-pay-button" id="appleConfirmBtn">CONFIRM</button>
</div>`;
                document.body.appendChild(applePayModal);
                //Directs to booking confirmation
                setTimeout(() => {
                    const confirmBtn = document.getElementById("appleConfirmBtn");
                    confirmBtn.addEventListener("click", () => {
                        applePayModal.remove();
                        renderStep3(seat, method, discount, parsedDate, selectedTicketType, ticketPrice, guestName, guestEmail);
                    });
                }, 0);
                return;
            }
            //Card validation
            if (method === "Card") {
                const cardName = document.getElementById("cardName").value.trim();
                const cardNumber = document.getElementById("cardNumber").value.trim();
                const cardExpiry = document.getElementById("cardExpiry").value.trim();
                const cardCVV = document.getElementById("cardCVV").value.trim();
                //Card input validation
                if (cardName.length < 3) return alert("Please enter your full name");
                if (cardNumber.length !== 16 || isNaN(cardNumber)) return alert("Card number must be exactly 16 digits");
                if (
                    cardExpiry.length !== 5 ||
                    cardExpiry.charAt(2) !== "/" ||
                    isNaN(Number(cardExpiry.slice(0, 2))) ||
                    isNaN(Number(cardExpiry.slice(3)))
                ) {
                    return alert("Expiry must be in MM/YY format");
                }
                if (cardCVV.length !== 3 || isNaN(cardCVV)) return alert("CVV must be 3 digits");
            }
            renderStep3(seat, method, discount, parsedDate, selectedTicketType, ticketPrice, guestName, guestEmail);
        };
        // Handle payment method selection and card fields
        setTimeout(() => {
            const radios = document.querySelectorAll('input[name="payment"]');
            radios.forEach(radio => {
                radio.addEventListener("change", () => {
                    document.querySelectorAll('.payment-option').forEach(opt => opt.classList.remove('selected'));
                    const label = radio.closest('.payment-option');
                    if (label) label.classList.add('selected');
                    // Show/hide card inputs
                    const selected = radio.value;
                    const cardInputs = document.getElementById("cardInputs");
                    cardInputs.style.display = selected === "Card" ? "block" : "none";
                    // Clear if not card
                    if (selected !== "Card") {
                        document.getElementById("cardName").value = "";
                        document.getElementById("cardNumber").value = "";
                        document.getElementById("cardExpiry").value = "";
                        document.getElementById("cardCVV").value = "";
                    }
                });
            });
        }, 0);
    }
    // STEP 3: Booking Confirmation
    function renderStep3(seat, method, discount, parsedDate, ticketType, ticketPrice, guestName, guestEmail) {
        console.log("Sending email to:", guestName, guestEmail);
        const ticketNum = Math.floor(100000 + Math.random() * 900000);
        const allTickets = JSON.parse(localStorage.getItem("allTickets")) || [];
        const seatDisplay = seat === "Standing" ? "Standing Only" : seat;
        const newTicket = {
            ticketType,
            ticketPrice,
            guestName,
            guestEmail,
            title: event.title,
            location: event.location,
            seat,
            date: parsedDate.toISOString().split("T")[0],
            dateISO: new Date().toISOString(),
            time: parsedDate.toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'}),
            formattedDate: parsedDate.toLocaleDateString('en-GB', { style: 'currency', currency: 'GBP' }),
            method,
            ticketNum,
            discount,
            image: event.img,
            confirmed: true
        };
        // After saving ticket , send to email confirmation with emailjs
        emailjs.send("service_7k4trpf", "template_2mkwmqu", {
            guest_name: guestName,
            guest_email: guestEmail,
            from_name: "Belfast Explorer",
            event_title: event.title,
            seat: seatDisplay,
            date: parsedDate.toLocaleDateString('en-GB', {weekday: 'long', day: 'numeric', month: 'short', year: 'numeric'}),
            time: parsedDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit'}),
            ticket_type: ticketType,
            ticket_price: `£${ticketPrice.toFixed(2)}`,
            ticket_num: ticketNum
        })
            .then(() => {
                console.log("Email sent successfully!");
            })
            .catch((error) => {
                console.error("EmailJS Error:", error);
            });
        allTickets.push(newTicket);
        localStorage.setItem("allTickets", JSON.stringify(allTickets));
        //Save ticket to localStorage
        localStorage.setItem("lastTicket", JSON.stringify(newTicket));

        container.innerHTML = `
<section class="ticket-confirmation">
<div class="ticket-header">
<i class="fa-solid fa-circle-check"></i>
<h2>Booking Confirmed!</h2>
<p>Booking Ref No:<strong>QBG${ticketNum}</strong></p>
<p class="email-confirmation-msg">
  A confirmation email has been sent to <strong>${guestEmail}</strong>.
</p>
</div>
<div class="ticket-card" id="ticketContent">
<div class="event-img-wrapper">
<img src="${event.img}" alt="Event image" class="ticket-event-img" />
</div>
<div class="ticket-body">
<h3>${event.title}</h3>
<p class="ticket-location">${event.location}</p>
<div class="ticket-info">
<div class="ticket-body-info">
<h4>Seat</h4>
<p>${seat === "Standing" ? "Standing Only" : seat}</p>
</div>
<div class="ticket-body-info">
<h4>Date & Time</h4>
<p>${newTicket.formattedDate}, ${newTicket.time}</p>
</div>
</div>
<p class="ticket-meta"><strong>Paid via:</strong> ${method}</p>
${discount ? `
<p class="ticket-meta"><strong>Discount:</strong> ${discount}</p>` : ""}
<p class="ticket-meta"><strong>Name:</strong> ${guestName}</p>
<p class="ticket-meta"><strong>Ticket #</strong> ${ticketNum}</p>
<div class="barcode"></div>
<div class="ticket-actions">
<button id="downloadBtn" class="action-btn"><i class="fa-solid fa-download"></i>Download</button>
<button id="shareBtn" class="action-btn"><i class="fa-regular fa-share"></i>Share</button>
</div>
<div id="toast" class="toast hidden">
<span id="toastMessage">Event added to calendar successfully!</span>
<button id="backHomeBtn" class="mini-nav-btn hidden">Back to Home</button>
</div>
<button id="calendarBtn" class="mini-nav-btn">Add to Calendar</button>
</div>
</div>
</section>
`;
        function showToast(message, showButton = false) {
            const toast = document.getElementById("toast");
            const toastMsg = document.getElementById("toastMessage");
            const backBtn = document.getElementById("backHomeBtn");
            if (!toast || !toastMsg) return;
            toastMsg.textContent = message;
            toast.classList.remove("hidden");
            toast.classList.add("show");
            if (showButton && backBtn) {
                backBtn.classList.remove("hidden");
                backBtn.onclick = () => {
                    window.location.href = "index.html";
                };
            }
            if (!showButton) {
                setTimeout(() => {
                    toast.classList.remove("show");
                    if (backBtn) backBtn.classList.add("hidden");
                    setTimeout(() => toast.classList.add("hidden"), 300);
                }, 3000);
            }
        }
        document.getElementById("downloadBtn").addEventListener("click", () => {
            const content = document.getElementById("ticketContent");
            if (!content) return;
            const printWindow = window.open('', '', 'width=500,height=320');
            const styleTag = document.querySelector('link[rel="stylesheet"]')?.outerHTML || "";
            printWindow.document.write('<!DOCTYPE html><html lang="en"><head><title>Download Ticket</title>');
            printWindow.document.write(styleTag);
            printWindow.document.write('<style>body {zoom: 0.75; }</style>');
            printWindow.document.write('</head><body>');
            printWindow.document.write(content.outerHTML);
            printWindow.document.write('</body></html>');
            printWindow.document.close();
            printWindow.focus();
            setTimeout(() => {
                printWindow.print();
            }, 500);
        });
        document.getElementById("shareBtn").addEventListener("click", async () => {
            if (navigator.share) {
                try {
                    await navigator.share({
                        title: 'Your Ticket for ' + event.title,
                        text: `I booked a ticket for ${event.title} at ${event.location} on ${newTicket.formattedDate}, seat ${seat}`,
                        url: window.location.href
                    });
                } catch (err) {
                    console.error("Share cancelled or failed:", err);
                }
            } else {
                alert("Sharing is not supported on this device.");
            }
        });
        document.getElementById("calendarBtn").addEventListener("click", () => {
            showToast("Event added to calendar successfully!", true);
        });
    }
    if (totalSeats > 0) {
        renderStep1();
    }
});
