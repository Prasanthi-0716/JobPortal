const user =
  JSON.parse(
    localStorage.getItem("user")
  );


// =====================================
// LOGIN CHECK
// =====================================

if (!user) {

  window.location.href =
    "login.html";

}


if (user.role !== "student") {

  window.location.href =
    "login.html";

}


// =====================================
// PROFILE
// =====================================

document.getElementById(
  "welcome"
).textContent =
  `Welcome, ${user.name}!`;


document.getElementById(
  "profileName"
).textContent =
  user.name;


document.getElementById(
  "profileEmail"
).textContent =
  user.email;


document.getElementById(
  "profileRole"
).textContent =
  user.role;


// =====================================
// LOAD APPLICATION STATISTICS
// =====================================

async function loadApplicationStats() {

  try {

    const response =
      await fetch(
        `/api/applications/student/${user.id}`
      );


    const applications =
      await response.json();


    const total =
      applications.length;


    const shortlisted =
      applications.filter(
        application =>
          application.status ===
          "Shortlisted"
      ).length;


    const rejected =
      applications.filter(
        application =>
          application.status ===
          "Rejected"
      ).length;


    document.getElementById(
      "totalApplications"
    ).textContent =
      total;


    document.getElementById(
      "shortlistedApplications"
    ).textContent =
      shortlisted;


    document.getElementById(
      "rejectedApplications"
    ).textContent =
      rejected;

  }

  catch (error) {

    console.error(
      "Unable to load application statistics:",
      error
    );

  }

}


// =====================================
// VIEW APPLICATIONS
// =====================================

async function viewApplications() {

  const applicationsContainer =
    document.getElementById(
      "applicationsList"
    );


  applicationsContainer.innerHTML =
    "<p>Loading applications...</p>";


  try {

    const response =
      await fetch(
        `/api/applications/student/${user.id}`
      );


    const applications =
      await response.json();


    if (applications.length === 0) {

      applicationsContainer.innerHTML = `

        <div class="job-card">

          <h2>
            No Applications Yet
          </h2>

          <p>
            You have not applied for any jobs.
          </p>

          <a href="jobs.html">

            <button>
              Browse Jobs
            </button>

          </a>

        </div>

      `;

      return;

    }


    applicationsContainer.innerHTML = "";


    applications.forEach(
      application => {

        const job =
          application.job;


        // Safety check
        if (!job) {

          return;

        }


        const applicationCard =
          document.createElement(
            "div"
          );


        applicationCard.className =
          "job-card";


        applicationCard.innerHTML = `

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
              Application Status:
            </strong>

            <span class="status-badge">
              ${application.status}
            </span>

          </p>

        `;


        applicationsContainer.appendChild(
          applicationCard
        );

      }
    );

  }

  catch (error) {

    console.error(error);

    applicationsContainer.innerHTML =
      "<p>Unable to load applications.</p>";

  }

}


// =====================================
// LOGOUT
// =====================================

function logout() {

  localStorage.removeItem("user");

  window.location.href =
    "login.html";

}


// =====================================
// INITIAL LOAD
// =====================================

loadApplicationStats();