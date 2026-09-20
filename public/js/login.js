const loginForm = document.getElementById("loginForm");

loginForm.addEventListener("submit", async function(event) {

    event.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    try {

        const response = await fetch("/api/login", {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                email: email,
                password: password
            })

        });

        const result = await response.json();

        if (response.ok) {

            // Store logged-in user
            localStorage.setItem(
                "user",
                JSON.stringify(result.user)
            );

            // Redirect according to role
            if (result.user.role === "student") {

                window.location.href = "student-dashboard.html";

            } else if (result.user.role === "company") {

                window.location.href = "company-dashboard.html";

            }

        } else {

            document.getElementById("message").textContent =
                result.message;

        }

    } catch (error) {

        console.error(error);

        document.getElementById("message").textContent =
            "Something went wrong.";

    }

});