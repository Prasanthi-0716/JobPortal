# Job Portal

A full-stack Job Portal web application developed using HTML, CSS, JavaScript, Node.js, and Express.js.

The application provides separate functionality for students and companies. Students can search and apply for jobs, while companies can post jobs and manage applicants.

---

## 🚀 Features

### 👨‍🎓 Student

- Student registration
- Student login
- Browse available jobs
- Search jobs by title, company, and skills
- Filter jobs by location
- Apply for jobs
- Prevent duplicate applications
- View submitted applications
- Track application status
- Student profile

### 🏢 Company

- Company registration
- Company login
- Post new jobs
- View posted jobs
- Edit jobs
- Delete jobs
- View applicants
- Update application status
- Company profile

### 🔐 Authentication

- Registration system
- Login system
- Role-based access
- Student and company dashboards
- Logout functionality

---

## 🛠️ Technologies Used

| Technology | Purpose |
|------------|---------|
| HTML | Web page structure |
| CSS | Styling and responsive design |
| JavaScript | Frontend functionality |
| Node.js | Backend runtime |
| Express.js | Server and API development |
| JSON | Data storage |
| Git | Version control |
| GitHub | Source code management |

---

## 📂 Project Structure

```text
JobPortal/
│
├── data/
│   ├── users.json
│   ├── jobs.json
│   └── applications.json
│
├── public/
│   ├── css/
│   │   └── style.css
│   │
│   ├── js/
│   │   ├── register.js
│   │   ├── login.js
│   │   ├── student.js
│   │   ├── company.js
│   │   ├── post-job.js
│   │   ├── jobs.js
│   │   └── edit-job.js
│   │
│   ├── index.html
│   ├── register.html
│   ├── login.html
│   ├── jobs.html
│   ├── student-dashboard.html
│   ├── company-dashboard.html
│   ├── post-job.html
│   └── edit-job.html
│
├── .gitignore
├── package.json
├── package-lock.json
├── server.js
└── README.md