//Avatar dropdown
document.addEventListener('DOMContentLoaded', function () {
    const avatar = document.querySelector(".avatar");
    const dropdown = document.getElementById("avatarDropdown");

    if (avatar && dropdown) {
        avatar.addEventListener("click", (e) => {
            e.stopPropagation(); //prevent closing immediately
            dropdown.classList.toggle("visible");

            const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
            const userName = localStorage.getItem("name") || "User";
            dropdown.innerHTML = isLoggedIn
                ? `<p class="dropdown-name">Hi, ${userName}</p>
<button onclick="location.href='profile.html'">Profile</button>
<button onclick="location.href='saved-events.html'">Favorites</button>
<button onclick="location.href='event-recommendations.html'">Recommendations</button>
<button onclick="location.href='my-tickets.html'">Tickets</button>
<button onclick="logout()">Logout</button>` :
                ` <button onclick="location.href='register.html'">Login</button> 
`;
        });
        // Hide dropdown when clicking outside
        document.addEventListener("click", function (e) {
            if (!dropdown.contains(e.target) && !avatar.contains(e.target)) {
                dropdown.classList.remove("visible");
            }
        });
    }
});