const jobDetails =
  document.getElementById("jobDetails");


// Get job ID from URL
const urlParams =
  new URLSearchParams(window.location.search);

const jobId =
  parseInt(urlParams.get("id"));


// Load job details
async function loadJobDetails() {

  try {

    const response =
      await fetch("/api/jobs");

    const jobs =
      await response.json();


    const job =
      jobs.find(job => job.id === jobId);


    // Job not found
    if (!job) {

      jobDetails.innerHTML = `
        <div class="dashboard-card">

          <h2>Job Not Found</h2>

          <p>
            The requested job does not exist.
          </p>

          <a href="jobs.html">
            <button>
              Back to Jobs
            </button>
          </a>

        </div>
      `;

      return;
    }


    // Display job
    jobDetails.innerHTML = `

      <div class="dashboard-card">

        <h1>${job.title}</h1>

        <h2>
          🏢 ${job.company}
        </h2>

        <hr>

        <p>
          <strong>📍 Location:</strong>
          ${job.location}
        </p>

        <p>
          <strong>💰 Salary:</strong>
          ${job.salary}
        </p>

        <p>
          <strong>🛠️ Skills:</strong>
          ${job.skills}
        </p>

        <hr>

        <h2>
          Job Description
        </h2>

        <p>
          ${job.description}
        </p>

        <br>

        <button onclick="applyForJob(${job.id})">
          Apply for this Job
        </button>

        <a href="jobs.html">
          <button>
            Back to Jobs
          </button>
        </a>

      </div>

    `;

  }

  catch (error) {

    console.error(error);

    jobDetails.innerHTML = `
      <p>
        Unable to load job details.
      </p>
    `;

  }

}


// Apply for job
async function applyForJob(jobId) {

  const user =
    JSON.parse(
      localStorage.getItem("user")
    );


  if (!user) {

    alert(
      "Please login as a student to apply."
    );

    window.location.href =
      "login.html";

    return;
  }


  if (user.role !== "student") {

    alert(
      "Only students can apply for jobs."
    );

    return;
  }


  try {

    const response =
      await fetch(
        "/api/applications",
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json"
          },

          body: JSON.stringify({

            studentId: user.id,

            jobId: jobId

          })

        }
      );


    const data =
      await response.json();


    alert(data.message);


  }

  catch (error) {

    console.error(error);

    alert(
      "Something went wrong while applying."
    );

  }

}


// Start
loadJobDetails();