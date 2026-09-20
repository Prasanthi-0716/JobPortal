const user = JSON.parse(localStorage.getItem("user"));


// Check whether user is logged in
if (!user) {

    window.location.href = "login.html";

}


// Only companies can post jobs
if (user.role !== "company") {

    window.location.href = "student-dashboard.html";

}


const jobForm = document.getElementById("jobForm");


jobForm.addEventListener("submit", async function(event) {

    event.preventDefault();


    const title = document.getElementById("title").value;

    const company = document.getElementById("company").value;

    const location = document.getElementById("location").value;

    const salary = document.getElementById("salary").value;

    const skills = document.getElementById("skills").value;

    const description =
        document.getElementById("description").value;


    const jobData = {

        companyId: user.id,

        title: title,

        company: company,

        location: location,

        salary: salary,

        skills: skills,

        description: description

    };


    try {

        const response = await fetch("/api/jobs", {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify(jobData)

        });


        const result = await response.json();


        document.getElementById("message").textContent =
            result.message;


        if (response.ok) {

            jobForm.reset();

        }


    } catch (error) {

        console.error(error);

        document.getElementById("message").textContent =
            "Something went wrong.";

    }

});