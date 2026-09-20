const jobsContainer = document.getElementById("jobsContainer");
const searchInput = document.getElementById("search");
const locationInput = document.getElementById("location");

let allJobs = [];
let appliedJobIds = [];

// Get logged-in user
const user = JSON.parse(localStorage.getItem("user"));

// Load jobs
async function loadJobs() {
  try {
    const response = await fetch("/api/jobs");

    allJobs = await response.json();

    // If student is logged in, get their applications
    if (user && user.role === "student") {
      await loadAppliedJobs();
    }

    displayJobs(allJobs);

  } catch (error) {
    console.error(error);

    jobsContainer.innerHTML =
      "<p>Unable to load jobs.</p>";
  }
}


// Load jobs already applied for by the student
async function loadAppliedJobs() {

  try {

    const response = await fetch(
      `/api/applications/student/${user.id}`
    );

    const applications = await response.json();

    appliedJobIds = applications
      .map(application => application.jobId);

  } catch (error) {

    console.error(error);

  }
}


// Display jobs
function displayJobs(jobs) {

  jobsContainer.innerHTML = "";

  if (jobs.length === 0) {

    jobsContainer.innerHTML =
      "<p>No jobs found.</p>";

    return;
  }

  jobs.forEach(function(job) {

    const jobCard =
      document.createElement("div");

    jobCard.className = "job-card";


    // Check whether student already applied
    const alreadyApplied =
      appliedJobIds.includes(job.id);


    let applyButton = "";

    if (alreadyApplied) {

      applyButton = `
        <button disabled>
          ✓ Applied
        </button>
        <button onclick ="viewJobDetails(${job.id})">
            View Details
        </button>
      `;

    } else {

      applyButton = `
        <button onclick="applyForJob(${job.id})">
          Apply
        </button>
        <button onclick ="viewJobDetails(${job.id})">
            View Details
        </button>
      `;

    }


    jobCard.innerHTML = `
      <h2>${job.title}</h2>

      <h3>${job.company}</h3>

      <p>📍 ${job.location}</p>

      <p>💰 ${job.salary}</p>

      <p>🛠️ ${job.skills}</p>

      <p>${job.description}</p>

      ${applyButton}
    `;


    jobsContainer.appendChild(jobCard);

  });

}


// Search and filter jobs
function filterJobs() {

  const searchText =
    searchInput.value.toLowerCase();

  const locationText =
    locationInput.value.toLowerCase();


  const filteredJobs =
    allJobs.filter(function(job) {

      const searchMatch =
        job.title.toLowerCase().includes(searchText) ||
        job.company.toLowerCase().includes(searchText) ||
        job.skills.toLowerCase().includes(searchText);


      const locationMatch =
        job.location
          .toLowerCase()
          .includes(locationText);


      return searchMatch && locationMatch;

    });


  displayJobs(filteredJobs);

}


// Search events
searchInput.addEventListener(
  "input",
  filterJobs
);

locationInput.addEventListener(
  "input",
  filterJobs
);


// Apply for job
async function applyForJob(jobId) {

  const currentUser =
    JSON.parse(localStorage.getItem("user"));


  if (!currentUser) {

    alert(
      "Please login as a student to apply."
    );

    window.location.href =
      "login.html";

    return;
  }


  if (currentUser.role !== "student") {

    alert(
      "Only students can apply for jobs."
    );

    return;
  }


  try {

    const response = await fetch(
      "/api/applications",
      {
        method: "POST",

        headers: {
          "Content-Type":
            "application/json"
        },

        body: JSON.stringify({

          studentId:
            currentUser.id,

          jobId:
            jobId

        })
      }
    );


    const data =
      await response.json();


    alert(data.message);


    if (response.ok) {

      // Add job to applied list
      appliedJobIds.push(jobId);

      // Refresh displayed jobs
      filterJobs();

    }


  } catch (error) {

    console.error(error);

    alert(
      "Something went wrong while applying."
    );

  }

}


// Start
loadJobs();
function viewJobDetails(jobId) {

  window.location.href =
    `job-details.html?id=${jobId}`;

}