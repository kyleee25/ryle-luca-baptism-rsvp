const button = document.getElementById("openInvitation");

button.addEventListener("click", () => {

    document
        .getElementById("welcome")
        .scrollIntoView({

            behavior: "smooth"

        });

});