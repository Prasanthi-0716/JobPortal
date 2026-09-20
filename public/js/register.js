const registerForm = document.getElementById("registerForm");

registerForm.addEventListener("submit", async function(event) {

    event.preventDefault();

    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const role = document.getElementById("role").value;

    const userData = {
        name: name,
        email: email,
        password: password,
        role: role
    };

    try {

        const response = await fetch("/api/register", {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify(userData)

        });

        const result = await response.json();

        document.getElementById("message").textContent = result.message;

    } catch (error) {

        console.error(error);

        document.getElementById("message").textContent =
            "Something went wrong.";

    }

});