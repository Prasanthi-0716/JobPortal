const user = JSON.parse(localStorage.getItem("user"));


// =====================================================
// LOGIN CHECK
// =====================================================

if (!user) {
  window.location.href = "login.html";
}

if (user.role !== "company") {
  window.location.href = "login.html";
}


// =====================================================
// PROFILE INFORMATION
// =====================================================

document.getElementById("welcome").textContent =
  `Welcome, ${user.name}!`;

document.getElementById("profileName").textContent =
  user.name;

document.getElementById("profileEmail").textContent =
  user.email;

document.getElementById("profileRole").textContent =
  user.role;


// =====================================================
// LOAD DASHBOARD STATISTICS
// =====================================================

async function loadDashboardStats() {

  try {

    // Get company's jobs
    const jobsResponse = await fetch(
      `/api/jobs/company/${user.id}`
    );

    const jobs = await jobsResponse.json();


    // Get company's applicants
    const applicantsResponse = await fetch(
      `/api/applicants/company/${user.id}`
    );

    const applicants = await applicantsResponse.json();


    // ---------------------------------------------
    // Total Jobs
    // ---------------------------------------------

    document.getElementById("totalJobs").textContent =
      Array.isArray(jobs)
        ? jobs.length
        : 0;


    // ---------------------------------------------
    // Total Applicants
    // ---------------------------------------------

    document.getElementById("totalApplicants").textContent =
      Array.isArray(applicants)
        ? applicants.length
        : 0;


    // ---------------------------------------------
    // Activity Status
    // ---------------------------------------------

    document.getElementById("activityStatus").textContent =
      jobs.length > 0
        ? "Active"
        : "No Jobs";

  }

  catch (error) {

    console.error(
      "Error loading dashboard statistics:",
      error
    );

  }

}


// =====================================================
// VIEW MY JOBS
// =====================================================

async function viewMyJobs() {

  const jobsContainer =
    document.getElementById("myJobs");


  // Loading message
  jobsContainer.innerHTML = `
    <div class="job-card">
      <p>
        Loading your jobs...
      </p>
    </div>
  `;


  try {

    const response = await fetch(
      `/api/jobs/company/${user.id}`
    );


    const jobs = await response.json();


    // ---------------------------------------------
    // Update Total Jobs Counter
    // ---------------------------------------------

    document.getElementById("totalJobs").textContent =
      jobs.length;


    // ---------------------------------------------
    // No Jobs
    // ---------------------------------------------

    if (jobs.length === 0) {

      jobsContainer.innerHTML = `

        <div class="job-card">

          <h2>
            No Jobs Posted
          </h2>

          <p>
            You have not posted any jobs yet.
          </p>

          <br>

          <a href="post-job.html">

            <button>
              Post Your First Job
            </button>

          </a>

        </div>

      `;

      return;
    }


    // ---------------------------------------------
    // Section Header
    // ---------------------------------------------

    jobsContainer.innerHTML = `

      <div class="section-header">

        <div>

          <h2>
            My Jobs
          </h2>

          <p>
            Jobs posted by your company.
          </p>

        </div>

      </div>

    `;


    // ---------------------------------------------
    // Display Jobs
    // ---------------------------------------------

    jobs.forEach(job => {

      const jobCard =
        document.createElement("div");


      jobCard.className =
        "job-card";


      jobCard.innerHTML = `

        <h2>
          ${job.title}
        </h2>

        <h3>
          ${job.company}
        </h3>

        <p>
          📍 ${job.location}
        </p>

        <p>
          💰 ${job.salary}
        </p>

        <p>
          🛠️ ${job.skills}
        </p>

        <p>
          ${job.description}
        </p>

        <p>
          <strong>
            Job ID:
          </strong>

          ${job.id}
        </p>

        <br>

        <button
          onclick="editJob(${job.id})"
        >
          ✏️ Edit Job
        </button>


        <button
          class="btn-danger"
          onclick="deleteJob(${job.id})"
        >
          🗑️ Delete Job
        </button>

      `;


      jobsContainer.appendChild(
        jobCard
      );

    });

  }

  catch (error) {

    console.error(error);


    jobsContainer.innerHTML = `

      <div class="job-card">

        <h2>
          Unable to Load Jobs
        </h2>

        <p>
          Something went wrong while
          loading your jobs.
        </p>

      </div>

    `;

  }

}


// =====================================================
// VIEW APPLICANTS
// =====================================================

async function viewApplicants() {

  const applicantsContainer =
    document.getElementById("applicants");


  // Loading message
  applicantsContainer.innerHTML = `

    <div class="job-card">

      <p>
        Loading applicants...
      </p>

    </div>

  `;


  try {

    const response = await fetch(
      `/api/applicants/company/${user.id}`
    );


    const applicants =
      await response.json();


    // ---------------------------------------------
    // Update Applicant Counter
    // ---------------------------------------------

    document.getElementById(
      "totalApplicants"
    ).textContent =
      applicants.length;


    // ---------------------------------------------
    // No Applicants
    // ---------------------------------------------

    if (applicants.length === 0) {

      applicantsContainer.innerHTML = `

        <div class="section-header">

          <div>

            <h2>
              Applicants
            </h2>

            <p>
              Students who applied for your jobs.
            </p>

          </div>

        </div>


        <div class="job-card">

          <h2>
            No Applicants Yet
          </h2>

          <p>
            No students have applied
            for your jobs yet.
          </p>

        </div>

      `;

      return;
    }


    // ---------------------------------------------
    // Section Header
    // ---------------------------------------------

    applicantsContainer.innerHTML = `

      <div class="section-header">

        <div>

          <h2>
            Applicants
          </h2>

          <p>
            Review and manage student applications.
          </p>

        </div>

      </div>

    `;


    // ---------------------------------------------
    // Display Applicants
    // ---------------------------------------------

    applicants.forEach(application => {

      const applicantCard =
        document.createElement("div");


      applicantCard.className =
        "job-card";


      applicantCard.innerHTML = `

        <h2>
          ${application.student.name}
        </h2>

        <p>
          📧 ${application.student.email}
        </p>

        <hr>


        <h3>
          Applied for:
          ${application.job.title}
        </h3>


        <p>
          🏢 ${application.job.company}
        </p>


        <p>
          📍 ${application.job.location}
        </p>


        <p>

          <strong>
            Current Status:
          </strong>

          <span class="status-badge">
            ${application.status}
          </span>

        </p>


        <br>


        <label>

          <strong>
            Update Application Status
          </strong>

        </label>


        <br><br>


        <select
          onchange="
            updateApplicationStatus(
              ${application.applicationId},
              this.value
            )
          "
        >

          <option
            value="Applied"
            ${
              application.status === "Applied"
                ? "selected"
                : ""
            }
          >
            Applied
          </option>


          <option
            value="Shortlisted"
            ${
              application.status === "Shortlisted"
                ? "selected"
                : ""
            }
          >
            Shortlisted
          </option>


          <option
            value="Rejected"
            ${
              application.status === "Rejected"
                ? "selected"
                : ""
            }
          >
            Rejected
          </option>

        </select>


        <p>

          <strong>
            Application ID:
          </strong>

          ${application.applicationId}

        </p>

      `;


      applicantsContainer.appendChild(
        applicantCard
      );

    });

  }

  catch (error) {

    console.error(error);


    applicantsContainer.innerHTML = `

      <div class="job-card">

        <h2>
          Unable to Load Applicants
        </h2>

        <p>
          Something went wrong while
          loading applicants.
        </p>

      </div>

    `;

  }

}


// =====================================================
// UPDATE APPLICATION STATUS
// =====================================================

async function updateApplicationStatus(
  applicationId,
  status
) {

  try {

    const response = await fetch(
      `/api/applications/${applicationId}/status`,
      {
        method: "PUT",

        headers: {
          "Content-Type":
            "application/json"
        },

        body: JSON.stringify({

          status: status,

          companyId: user.id

        })

      }
    );


    const data =
      await response.json();


    alert(data.message);


    // Refresh applicants
    if (response.ok) {

      await viewApplicants();

      // Refresh dashboard statistics
      await loadDashboardStats();

    }

  }

  catch (error) {

    console.error(error);


    alert(
      "Unable to update application status."
    );

  }

}


// =====================================================
// EDIT JOB
// =====================================================

function editJob(jobId) {

  window.location.href =
    `edit-job.html?id=${jobId}`;

}


// =====================================================
// DELETE JOB
// =====================================================

async function deleteJob(jobId) {

  const confirmDelete =
    confirm(
      "Are you sure you want to delete this job?"
    );


  if (!confirmDelete) {

    return;

  }


  try {

    const response = await fetch(
      `/api/jobs/${jobId}`,
      {
        method: "DELETE"
      }
    );


    const data =
      await response.json();


    alert(data.message);


    if (response.ok) {

      // Refresh jobs
      await viewMyJobs();

      // Refresh dashboard statistics
      await loadDashboardStats();

    }

  }

  catch (error) {

    console.error(error);


    alert(
      "Unable to delete the job."
    );

  }

}


// =====================================================
// LOGOUT
// =====================================================

function logout() {

  localStorage.removeItem("user");

  window.location.href =
    "login.html";

}


// =====================================================
// INITIAL DASHBOARD LOAD
// =====================================================

loadDashboardStats();