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

/* =========================
   GALLERY CAROUSEL
========================= */

const galleryCards = document.querySelectorAll(".gallery-card");
const galleryDots = document.querySelectorAll(".gallery-dot");

const galleryPrev = document.getElementById("galleryPrev");
const galleryNext = document.getElementById("galleryNext");

let currentGalleryIndex = 1;


/* =========================
   UPDATE GALLERY
========================= */

function updateGallery() {

    const totalImages = galleryCards.length;

    galleryCards.forEach((card, index) => {

        card.classList.remove(
            "active",
            "prev",
            "next",
            "hidden"
        );

        const previousIndex =
            (currentGalleryIndex - 1 + totalImages) % totalImages;

        const nextIndex =
            (currentGalleryIndex + 1) % totalImages;


        if (index === currentGalleryIndex) {

            card.classList.add("active");

        } else if (index === previousIndex) {

            card.classList.add("prev");

        } else if (index === nextIndex) {

            card.classList.add("next");

        } else {

            card.classList.add("hidden");

        }

    });


    /* Update dots */

    galleryDots.forEach((dot, index) => {

        dot.classList.toggle(
            "active",
            index === currentGalleryIndex
        );

    });

}


/* =========================
   NEXT PHOTO
========================= */

function showNextGalleryImage() {

    currentGalleryIndex =
        (currentGalleryIndex + 1) % galleryCards.length;

    updateGallery();

}


/* =========================
   PREVIOUS PHOTO
========================= */

function showPreviousGalleryImage() {

    currentGalleryIndex =
        (currentGalleryIndex - 1 + galleryCards.length)
        % galleryCards.length;

    updateGallery();

}


/* =========================
   BUTTON EVENTS
========================= */

galleryNext.addEventListener(
    "click",
    showNextGalleryImage
);

galleryPrev.addEventListener(
    "click",
    showPreviousGalleryImage
);


/* =========================
   DOT EVENTS
========================= */

galleryDots.forEach((dot) => {

    dot.addEventListener("click", () => {

        currentGalleryIndex =
            Number(dot.dataset.index);

        updateGallery();

    });

});


/* =========================
   TOUCH / SWIPE
========================= */

let touchStartX = 0;
let touchEndX = 0;

const galleryStage =
    document.querySelector(".gallery-stage");


galleryStage.addEventListener(
    "touchstart",
    (event) => {

        touchStartX =
            event.changedTouches[0].screenX;

    },
    { passive: true }
);


galleryStage.addEventListener(
    "touchend",
    (event) => {

        touchEndX =
            event.changedTouches[0].screenX;

        handleGallerySwipe();

    },
    { passive: true }
);


function handleGallerySwipe() {

    const swipeDistance =
        touchEndX - touchStartX;

    const minimumSwipeDistance = 50;


    if (
        Math.abs(swipeDistance)
        < minimumSwipeDistance
    ) {
        return;
    }


    if (swipeDistance < 0) {

        showNextGalleryImage();

    } else {

        showPreviousGalleryImage();

    }

}


/* =========================
   INITIALIZE
========================= */

updateGallery();