const user = JSON.parse(localStorage.getItem("user"));

if (!user) {
  window.location.href = "login.html";
}

if (user.role !== "company") {
  window.location.href = "login.html";
}


const urlParams = new URLSearchParams(window.location.search);

const jobId = parseInt(urlParams.get("id"));


if (!jobId) {

  alert("Invalid Job ID.");

  window.location.href = "company-dashboard.html";
}


// Load existing job
async function loadJob() {

  try {

    const response = await fetch("/api/jobs");

    const jobs = await response.json();

    const job = jobs.find(
      job => job.id === jobId
    );

    if (!job) {

      alert("Job not found.");

      window.location.href =
        "company-dashboard.html";

      return;
    }


    // Make sure company owns this job
    if (job.companyId !== user.id) {

      alert("You can only edit your own jobs.");

      window.location.href =
        "company-dashboard.html";

      return;
    }


    document.getElementById("title").value =
      job.title;

    document.getElementById("company").value =
      job.company;

    document.getElementById("location").value =
      job.location;

    document.getElementById("salary").value =
      job.salary;

    document.getElementById("skills").value =
      job.skills;

    document.getElementById("description").value =
      job.description;


  } catch (error) {

    console.error(error);

    alert("Unable to load job.");

  }
}


// Update job
document
  .getElementById("editJobForm")
  .addEventListener("submit", async function(event) {

    event.preventDefault();


    const updatedJob = {

      title:
        document.getElementById("title").value,

      company:
        document.getElementById("company").value,

      location:
        document.getElementById("location").value,

      salary:
        document.getElementById("salary").value,

      skills:
        document.getElementById("skills").value,

      description:
        document.getElementById("description").value

    };


    try {

      const response = await fetch(
        `/api/jobs/${jobId}`,
        {
          method: "PUT",

          headers: {
            "Content-Type": "application/json"
          },

          body: JSON.stringify(updatedJob)
        }
      );


      const data = await response.json();


      document.getElementById("message")
        .textContent = data.message;


      if (response.ok) {

        setTimeout(() => {

          window.location.href =
            "company-dashboard.html";

        }, 1000);

      }


    } catch (error) {

      console.error(error);

      document.getElementById("message")
        .textContent =
        "Unable to update job.";

    }

  });


loadJob();