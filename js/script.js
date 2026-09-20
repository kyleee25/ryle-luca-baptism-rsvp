const button = document.getElementById("openInvitation");

button.addEventListener("click", () => {

    document
        .getElementById("welcome")
        .scrollIntoView({

            behavior: "smooth"

        });

});

/* =========================
   COUNTDOWN
========================= */

const eventDate = new Date("October 17, 2026 00:00:00").getTime();

function updateCountdown() {

    const now = new Date().getTime();

    const distance = eventDate - now;

    if (distance <= 0) {

        document.getElementById("days").textContent = "0";
        document.getElementById("hours").textContent = "0";
        document.getElementById("minutes").textContent = "0";
        document.getElementById("seconds").textContent = "0";

        return;
    }

    const days = Math.floor(
        distance / (1000 * 60 * 60 * 24)
    );

    const hours = Math.floor(
        (distance / (1000 * 60 * 60)) % 24
    );

    const minutes = Math.floor(
        (distance / (1000 * 60)) % 60
    );

    const seconds = Math.floor(
        (distance / 1000) % 60
    );

    document.getElementById("days").textContent = days;

    document.getElementById("hours").textContent =
        String(hours).padStart(2, "0");

    document.getElementById("minutes").textContent =
        String(minutes).padStart(2, "0");

    document.getElementById("seconds").textContent =
        String(seconds).padStart(2, "0");
}

updateCountdown();

setInterval(updateCountdown, 1000);