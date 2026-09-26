const RSVP_API_URL =
    "https://script.google.com/macros/s/AKfycbyaT1lYV5AL3RXtPsEMDS0l4vMny24OGpdcOize_JjcVHhFat5emk4Q5Zd7oJKoFJEbQQ/exec";

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

const eventDate =
    new Date("October 17, 2026 00:00:00").getTime();


function updateCountdown() {

    const now =
        new Date().getTime();

    const distance =
        eventDate - now;


    if (distance <= 0) {

        document.getElementById("days").textContent = "0";
        document.getElementById("hours").textContent = "0";
        document.getElementById("minutes").textContent = "0";
        document.getElementById("seconds").textContent = "0";

        return;

    }


    const days =
        Math.floor(
            distance /
            (1000 * 60 * 60 * 24)
        );


    const hours =
        Math.floor(
            (distance /
                (1000 * 60 * 60)) % 24
        );


    const minutes =
        Math.floor(
            (distance /
                (1000 * 60)) % 60
        );


    const seconds =
        Math.floor(
            (distance / 1000) % 60
        );


    document.getElementById("days").textContent =
        days;


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

const galleryCards =
    document.querySelectorAll(".gallery-card");

const galleryDots =
    document.querySelectorAll(".gallery-dot");

const galleryPrev =
    document.getElementById("galleryPrev");

const galleryNext =
    document.getElementById("galleryNext");


let currentGalleryIndex = 1;


/* =========================
   UPDATE GALLERY
========================= */

function updateGallery() {

    const totalImages =
        galleryCards.length;


    galleryCards.forEach((card, index) => {

        card.classList.remove(
            "active",
            "prev",
            "next",
            "hidden"
        );


        const previousIndex =
            (
                currentGalleryIndex -
                1 +
                totalImages
            ) % totalImages;


        const nextIndex =
            (
                currentGalleryIndex +
                1
            ) % totalImages;


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
        (
            currentGalleryIndex +
            1
        ) % galleryCards.length;


    updateGallery();

}


/* =========================
   PREVIOUS PHOTO
========================= */

function showPreviousGalleryImage() {

    currentGalleryIndex =
        (
            currentGalleryIndex -
            1 +
            galleryCards.length
        ) % galleryCards.length;


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

    dot.addEventListener(
        "click",
        () => {

            currentGalleryIndex =
                Number(dot.dataset.index);

            updateGallery();

        }
    );

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
    {
        passive: true
    }
);


galleryStage.addEventListener(
    "touchend",
    (event) => {

        touchEndX =
            event.changedTouches[0].screenX;

        handleGallerySwipe();

    },
    {
        passive: true
    }
);


function handleGallerySwipe() {

    const swipeDistance =
        touchEndX - touchStartX;


    const minimumSwipeDistance = 50;


    if (
        Math.abs(swipeDistance) <
        minimumSwipeDistance
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
   INITIALIZE GALLERY
========================= */

updateGallery();


/* =========================
   RSVP
========================= */

const invitationCodeInput =
    document.getElementById("invitationCode");


const lookupInvitationButton =
    document.getElementById("lookupInvitation");


const rsvpLookupError =
    document.getElementById("rsvpLookupError");


const rsvpFormContainer =
    document.getElementById("rsvpFormContainer");


const guestName =
    document.getElementById("guestName");


const rsvpForm =
    document.getElementById("rsvpForm");


const guestMessage =
    document.getElementById("guestMessage");


const rsvpSubmit =
    document.getElementById("rsvpSubmit");


const existingRsvp =
    document.getElementById("existingRsvp");


const changeRsvp =
    document.getElementById("changeRsvp");


const rsvpSuccess =
    document.getElementById("rsvpSuccess");


const rsvpSuccessMessage =
    document.getElementById("rsvpSuccessMessage");


let currentGuest = null;


/* =========================
   LOOK UP INVITATION
========================= */

async function lookupInvitation() {

    const token =
        invitationCodeInput.value.trim();


    if (!token) {

        showRsvpError(
            "Please enter your invitation code."
        );

        return;

    }


    clearRsvpError();


    lookupInvitationButton.disabled = true;

    lookupInvitationButton.textContent =
        "Checking...";


    try {

        const response =
            await fetch(
                `${RSVP_API_URL}?token=${encodeURIComponent(token)}`
            );


        const data =
            await response.json();


        if (!data.success) {

            showRsvpError(
                data.message ||
                "Invitation code not found."
            );

            return;

        }


        currentGuest =
            data.guest;


        console.log(
            "Guest loaded:",
            currentGuest
        );


        displayGuest(
            data.guest
        );


    } catch (error) {

        console.error(error);


        showRsvpError(
            "Unable to connect to the RSVP service. Please try again."
        );

    } finally {

        lookupInvitationButton.disabled = false;

        lookupInvitationButton.textContent =
            "Continue";

    }

}


/* =========================
   DISPLAY GUEST
========================= */

function displayGuest(guest) {

    guestName.textContent =
        guest.displayName;


    rsvpFormContainer.hidden =
        false;


    rsvpSuccess.hidden =
        true;


    /*
     * Reset form
     */

    rsvpForm.reset();


    /*
     * Existing RSVP
     *
     * "Pending" means the guest
     * has not submitted yet.
     */

    const rsvpStatus =
        String(guest.rsvp || "").trim();


    if (
        rsvpStatus &&
        rsvpStatus !== "Pending"
    ) {

        const existingOption =
            document.querySelector(
                `input[name="rsvp"][value="${rsvpStatus}"]`
            );


        if (existingOption) {

            existingOption.checked =
                true;

        }


        guestMessage.value =
            guest.message || "";


        /*
         * Guest has already submitted.
         * Hide the RSVP form and show
         * the existing RSVP message.
         */

        rsvpForm.hidden =
            true;


        existingRsvp.hidden =
            false;

    } else {

        /*
         * Guest has not submitted yet.
         * Show the RSVP form and hide
         * the existing RSVP message.
         */

        rsvpForm.hidden =
            false;


        existingRsvp.hidden =
            true;

    }


    /*
     * Scroll to RSVP form
     */

    setTimeout(() => {

        rsvpFormContainer.scrollIntoView({
            behavior: "smooth",
            block: "center"
        });

    }, 100);

}


/* =========================
   SUBMIT RSVP
========================= */

rsvpForm.addEventListener(
    "submit",
    async (event) => {

        event.preventDefault();


        if (!currentGuest) {

            console.error(
                "No current guest found."
            );

            return;

        }


        const selectedRsvp =
            document.querySelector(
                'input[name="rsvp"]:checked'
            );


        if (!selectedRsvp) {

            console.error(
                "No RSVP option selected."
            );

            return;

        }


        const message =
            guestMessage.value.trim();


        rsvpSubmit.disabled =
            true;


        rsvpSubmit.textContent =
            "Saving...";


        try {

            /* =========================
               CREATE REQUEST BODY
            ========================= */

            const requestBody = {

                token:
                    currentGuest.token,

                rsvp:
                    selectedRsvp.value,

                message:
                    message

            };


            /* =========================
               DEBUG REQUEST
            ========================= */

            console.log(
                "Sending RSVP:",
                requestBody
            );


            console.log(
                "Token:",
                currentGuest.token
            );


            console.log(
                "RSVP:",
                selectedRsvp.value
            );


            console.log(
                "Message:",
                message
            );


            /* =========================
               SEND RSVP
            ========================= */

            const response =
                await fetch(
                    RSVP_API_URL,
                    {
                        method: "POST",

                        headers: {
                            "Content-Type":
                                "text/plain;charset=utf-8"
                        },

                        body:
                            JSON.stringify(
                                requestBody
                            )

                    }
                );


            console.log(
                "POST response status:",
                response.status
            );


            const data =
                await response.json();


            console.log(
                "POST response:",
                data
            );


            /* =========================
               HANDLE ERROR
            ========================= */

            if (!data.success) {

                alert(
                    data.message ||
                    "Unable to save your RSVP."
                );

                return;

            }


            /* =========================
               UPDATE LOCAL DATA
            ========================= */

            currentGuest.rsvp =
                selectedRsvp.value;


            currentGuest.message =
                message;


            /* =========================
               SHOW SUCCESS
            ========================= */

            rsvpForm.hidden =
                true;


            existingRsvp.hidden =
                true;


            rsvpSuccess.hidden =
                false;


            rsvpSuccessMessage.textContent =
                selectedRsvp.value === "Attending"

                    ? "We can't wait to celebrate with you!"

                    : "Thank you for letting us know. You will be missed!";


        } catch (error) {

            console.error(
                "RSVP submission error:",
                error
            );


            alert(
                "Unable to save your RSVP. Please try again."
            );

        } finally {

            rsvpSubmit.disabled =
                false;


            rsvpSubmit.textContent =
                "Submit RSVP";

        }

    }
);


/* =========================
   CHANGE RSVP
========================= */

changeRsvp.addEventListener(
    "click",
    () => {

        rsvpForm.reset();


        rsvpForm.hidden =
            false;


        rsvpSuccess.hidden =
            true;


        existingRsvp.hidden =
            true;


        rsvpForm.scrollIntoView({
            behavior: "smooth",
            block: "center"
        });

    }
);


/* =========================
   LOOKUP BUTTON
========================= */

lookupInvitationButton.addEventListener(
    "click",
    lookupInvitation
);


/* =========================
   ENTER KEY
========================= */

invitationCodeInput.addEventListener(
    "keydown",
    (event) => {

        if (event.key === "Enter") {

            event.preventDefault();

            lookupInvitation();

        }

    }
);


/* =========================
   ERROR HELPERS
========================= */

function showRsvpError(message) {

    rsvpLookupError.textContent =
        message;

}


function clearRsvpError() {

    rsvpLookupError.textContent =
        "";

}