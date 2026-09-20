const express = require("express");
const fs = require("fs");

const app = express();

const PORT = 3000;


// =====================================================
// MIDDLEWARE
// =====================================================

app.use(express.json());

app.use(express.static("public"));


// =====================================================
// REGISTER
// =====================================================

app.post("/api/register", (req, res) => {

  const {
    name,
    email,
    password,
    role
  } = req.body;


  // Validate input

  if (!name || !email || !password || !role) {

    return res.status(400).json({
      message: "Please fill all fields."
    });

  }


  // Read users

  const users = JSON.parse(
    fs.readFileSync(
      "data/users.json",
      "utf8"
    )
  );


  // Check duplicate email

  const existingUser = users.find(
    user => user.email === email
  );


  if (existingUser) {

    return res.status(400).json({
      message: "Email already registered."
    });

  }


  // Generate safe user ID

  const newUserId =
    users.length === 0
      ? 1
      : Math.max(
          ...users.map(user => user.id)
        ) + 1;


  // Create new user

  const newUser = {

    id: newUserId,

    name: name,

    email: email,

    password: password,

    role: role

  };


  // Save user

  users.push(newUser);

  fs.writeFileSync(
    "data/users.json",
    JSON.stringify(
      users,
      null,
      2
    )
  );


  res.status(201).json({

    message: "Registration successful!"

  });

});


// =====================================================
// LOGIN
// =====================================================

app.post("/api/login", (req, res) => {

  const {
    email,
    password
  } = req.body;


  // Validate input

  if (!email || !password) {

    return res.status(400).json({

      message:
        "Please enter email and password."

    });

  }


  // Read users

  const users = JSON.parse(
    fs.readFileSync(
      "data/users.json",
      "utf8"
    )
  );


  // Find matching user

  const user = users.find(
    user =>
      user.email === email &&
      user.password === password
  );


  if (!user) {

    return res.status(401).json({

      message:
        "Invalid email or password."

    });

  }


  // Return user details
  // Password is not returned

  res.json({

    message: "Login successful!",

    user: {

      id: user.id,

      name: user.name,

      email: user.email,

      role: user.role

    }

  });

});


// =====================================================
// POST A JOB
// =====================================================

app.post("/api/jobs", (req, res) => {

  const {
    companyId,
    title,
    company,
    location,
    salary,
    skills,
    description
  } = req.body;


  // Validate input

  if (
    !companyId ||
    !title ||
    !company ||
    !location ||
    !salary ||
    !skills ||
    !description
  ) {

    return res.status(400).json({

      message:
        "Please fill all job details."

    });

  }


  // Read jobs

  const jobs = JSON.parse(
    fs.readFileSync(
      "data/jobs.json",
      "utf8"
    )
  );


  // Generate safe job ID

  const newJobId =
    jobs.length === 0
      ? 1
      : Math.max(
          ...jobs.map(job => job.id)
        ) + 1;


  // Create job

  const newJob = {

    id: newJobId,

    companyId: companyId,

    title: title,

    company: company,

    location: location,

    salary: salary,

    skills: skills,

    description: description

  };


  // Save job

  jobs.push(newJob);

  fs.writeFileSync(
    "data/jobs.json",
    JSON.stringify(
      jobs,
      null,
      2
    )
  );


  res.status(201).json({

    message:
      "Job posted successfully!",

    job: newJob

  });

});


// =====================================================
// GET ALL JOBS
// =====================================================

app.get("/api/jobs", (req, res) => {

  const jobs = JSON.parse(
    fs.readFileSync(
      "data/jobs.json",
      "utf8"
    )
  );


  res.json(jobs);

});


// =====================================================
// APPLY FOR A JOB
// =====================================================

app.post("/api/applications", (req, res) => {

  const {
    studentId,
    jobId
  } = req.body;


  // Validate input

  if (!studentId || !jobId) {

    return res.status(400).json({

      message:
        "Student ID and Job ID are required."

    });

  }


  // Read jobs

  const jobs = JSON.parse(
    fs.readFileSync(
      "data/jobs.json",
      "utf8"
    )
  );


  // Check that job exists

  const jobExists = jobs.find(
    job =>
      job.id === jobId
  );


  if (!jobExists) {

    return res.status(404).json({

      message:
        "Job not found."

    });

  }


  // Read applications

  const applications = JSON.parse(
    fs.readFileSync(
      "data/applications.json",
      "utf8"
    )
  );


  // Check duplicate application

  const existingApplication =
    applications.find(
      application =>
        application.studentId === studentId &&
        application.jobId === jobId
    );


  if (existingApplication) {

    return res.status(400).json({

      message:
        "You have already applied for this job."

    });

  }


  // Generate safe application ID

  const newApplicationId =
    applications.length === 0
      ? 1
      : Math.max(
          ...applications.map(
            application => application.id
          )
        ) + 1;


  // Create application

  const newApplication = {

    id: newApplicationId,

    studentId: studentId,

    jobId: jobId,

    status: "Applied"

  };


  // Save application

  applications.push(newApplication);

  fs.writeFileSync(
    "data/applications.json",
    JSON.stringify(
      applications,
      null,
      2
    )
  );


  res.status(201).json({

    message:
      "Application submitted successfully!",

    application: newApplication

  });

});


// =====================================================
// GET STUDENT APPLICATIONS
// =====================================================

app.get(
  "/api/applications/student/:studentId",
  (req, res) => {

    const studentId =
      parseInt(
        req.params.studentId
      );


    // Read applications

    const applications = JSON.parse(
      fs.readFileSync(
        "data/applications.json",
        "utf8"
      )
    );


    // Read jobs

    const jobs = JSON.parse(
      fs.readFileSync(
        "data/jobs.json",
        "utf8"
      )
    );


    // Find student's applications

    const studentApplications =
      applications

        .filter(
          application =>
            application.studentId === studentId
        )

        .map(application => {

          const job =
            jobs.find(
              job =>
                job.id === application.jobId
            );


          return {

            ...application,

            job: job

          };

        });


    res.json(
      studentApplications
    );

  }
);


// =====================================================
// GET COMPANY JOBS
// =====================================================

app.get(
  "/api/jobs/company/:companyId",
  (req, res) => {

    const companyId =
      parseInt(
        req.params.companyId
      );


    // Read jobs

    const jobs = JSON.parse(
      fs.readFileSync(
        "data/jobs.json",
        "utf8"
      )
    );


    // Find company jobs

    const companyJobs =
      jobs.filter(
        job =>
          job.companyId === companyId
      );


    res.json(companyJobs);

  }
);


// =====================================================
// GET COMPANY APPLICANTS
// =====================================================

app.get(
  "/api/applicants/company/:companyId",
  (req, res) => {

    const companyId =
      parseInt(
        req.params.companyId
      );


    // Read applications

    const applications = JSON.parse(
      fs.readFileSync(
        "data/applications.json",
        "utf8"
      )
    );


    // Read jobs

    const jobs = JSON.parse(
      fs.readFileSync(
        "data/jobs.json",
        "utf8"
      )
    );


    // Read users

    const users = JSON.parse(
      fs.readFileSync(
        "data/users.json",
        "utf8"
      )
    );


    // Combine application,
    // job and student information

    const applicants =
      applications

        .map(application => {

          const job =
            jobs.find(
              job =>
                job.id === application.jobId
            );


          const student =
            users.find(
              user =>
                user.id === application.studentId
            );


          return {

            applicationId:
              application.id,

            status:
              application.status,

            job:
              job,

            student:
              student

          };

        })


        // Keep only this company's applications

        .filter(
          application =>
            application.job &&
            application.job.companyId === companyId
        );


    res.json(applicants);

  }
);


// =====================================================
// DELETE JOB
// =====================================================

app.delete(
  "/api/jobs/:jobId",
  (req, res) => {

    const jobId =
      parseInt(
        req.params.jobId
      );


    // Read jobs

    const jobs = JSON.parse(
      fs.readFileSync(
        "data/jobs.json",
        "utf8"
      )
    );


    // Find job

    const jobIndex =
      jobs.findIndex(
        job =>
          job.id === jobId
      );


    // Check job

    if (jobIndex === -1) {

      return res.status(404).json({

        message:
          "Job not found."

      });

    }


    // Remove job

    jobs.splice(
      jobIndex,
      1
    );


    // Save jobs

    fs.writeFileSync(
      "data/jobs.json",
      JSON.stringify(
        jobs,
        null,
        2
      )
    );


    // ================================================
    // REMOVE RELATED APPLICATIONS
    // ================================================

    const applications = JSON.parse(
      fs.readFileSync(
        "data/applications.json",
        "utf8"
      )
    );


    const updatedApplications =
      applications.filter(
        application =>
          application.jobId !== jobId
      );


    // Save updated applications

    fs.writeFileSync(
      "data/applications.json",
      JSON.stringify(
        updatedApplications,
        null,
        2
      )
    );


    // Send response

    res.json({

      message:
        "Job and related applications deleted successfully!"

    });

  }
);


// =====================================================
// EDIT / UPDATE JOB
// =====================================================

app.put(
  "/api/jobs/:jobId",
  (req, res) => {

    const jobId =
      parseInt(
        req.params.jobId
      );


    const {
      title,
      company,
      location,
      salary,
      skills,
      description
    } = req.body;


    // Validate input

    if (
      !title ||
      !company ||
      !location ||
      !salary ||
      !skills ||
      !description
    ) {

      return res.status(400).json({

        message:
          "Please fill all job details."

      });

    }


    // Read jobs

    const jobs = JSON.parse(
      fs.readFileSync(
        "data/jobs.json",
        "utf8"
      )
    );


    // Find job

    const jobIndex =
      jobs.findIndex(
        job =>
          job.id === jobId
      );


    if (jobIndex === -1) {

      return res.status(404).json({

        message:
          "Job not found."

      });

    }


    // Update job

    jobs[jobIndex].title =
      title;

    jobs[jobIndex].company =
      company;

    jobs[jobIndex].location =
      location;

    jobs[jobIndex].salary =
      salary;

    jobs[jobIndex].skills =
      skills;

    jobs[jobIndex].description =
      description;


    // Save updated job

    fs.writeFileSync(
      "data/jobs.json",
      JSON.stringify(
        jobs,
        null,
        2
      )
    );


    res.json({

      message:
        "Job updated successfully!",

      job:
        jobs[jobIndex]

    });

  }
);


// =====================================================
// UPDATE APPLICATION STATUS
// =====================================================

app.put(
  "/api/applications/:applicationId/status",
  (req, res) => {

    const applicationId =
      parseInt(
        req.params.applicationId
      );


    const {
      status,
      companyId
    } = req.body;


    // Allowed statuses

    const allowedStatuses = [

      "Applied",

      "Shortlisted",

      "Rejected"

    ];


    // Validate status

    if (
      !allowedStatuses.includes(status)
    ) {

      return res.status(400).json({

        message:
          "Invalid application status."

      });

    }


    // Read applications

    const applications = JSON.parse(
      fs.readFileSync(
        "data/applications.json",
        "utf8"
      )
    );


    // Read jobs

    const jobs = JSON.parse(
      fs.readFileSync(
        "data/jobs.json",
        "utf8"
      )
    );


    // Find application

    const applicationIndex =
      applications.findIndex(
        application =>
          application.id === applicationId
      );


    if (applicationIndex === -1) {

      return res.status(404).json({

        message:
          "Application not found."

      });

    }


    const application =
      applications[applicationIndex];


    // Find related job

    const job =
      jobs.find(
        job =>
          job.id === application.jobId
      );


    if (!job) {

      return res.status(404).json({

        message:
          "Job not found."

      });

    }


    // Verify company ownership

    if (
      job.companyId !==
      parseInt(companyId)
    ) {

      return res.status(403).json({

        message:
          "You can only update applications for your own jobs."

      });

    }


    // Update status

    applications[
      applicationIndex
    ].status = status;


    // Save application

    fs.writeFileSync(
      "data/applications.json",
      JSON.stringify(
        applications,
        null,
        2
      )
    );


    res.json({

      message:
        "Application status updated successfully!",

      application:
        applications[applicationIndex]

    });

  }
);


// =====================================================
// START SERVER
// =====================================================

app.listen(
  PORT,
  () => {

    console.log(
      `Server running at http://localhost:${PORT}`
    );

  }
);