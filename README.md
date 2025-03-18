<div class="hero-icon" align="center">
  <img src="https://raw.githubusercontent.com/PKief/vscode-material-icon-theme/ec559a9f6bfd399b82bb44393651661b08aaf7ba/icons/folder-markdown-open.svg" width="100" />
</div>

<h1 align="center">
FitTracker
</h1>
<h4 align="center">Web app for enthusiasts: goal setting, progress tracking, social sharing.</h4>
<h4 align="center">Developed with the software and tools below.</h4>
<div class="badges" align="center">
  <img src="https://img.shields.io/badge/Framework-React_18.2.0-blue" alt="React 18.2.0">
  <img src="https://img.shields.io/badge/Frontend-JavaScript,_HTML,_CSS-red" alt="JavaScript, HTML, CSS">
  <img src="https://img.shields.io/badge/Backend-Node.js-blue" alt="Node.js">
  <img src="https://img.shields.io/badge/Database-MongoDB_Atlas-green" alt="MongoDB Atlas">
</div>
<div class="badges" align="center">
  <img src="https://img.shields.io/github/last-commit/coslynx/fit-tracker-mvp?style=flat-square&color=5D6D7E" alt="git-last-commit" />
  <img src="https://img.shields.io/github/commit-activity/m/coslynx/fit-tracker-mvp?style=flat-square&color=5D6D7E" alt="GitHub commit activity" />
  <img src="https://img.shields.io/github/languages/top/coslynx/fit-tracker-mvp?style=flat-square&color=5D6D7E" alt="GitHub top language" />
</div>

## 📑 Table of Contents
- 📍 Overview
- 📦 Features
- 📂 Structure
- 💻 Installation
- 🏗️ Usage
- 🌐 Hosting
- 📄 API Documentation
- 📜 License & Attribution
- 👏 Authors

## 📍 Overview
The repository contains a Minimum Viable Product (MVP) called "FitTracker" that allows fitness enthusiasts to track their goals and share their progress. It's built using React for the frontend and Node.js with Express for the backend, leveraging MongoDB Atlas for data persistence. The application provides user authentication, goal setting, progress tracking, and social sharing capabilities.

## 📦 Features
|    | Feature            | Description                                                                                                        |
|----|--------------------|--------------------------------------------------------------------------------------------------------------------|
| 🔑 | **Authentication** | Secure user authentication using bcrypt for password hashing and JWT for session management.                       |
| 🎯 | **Goal Setting**   | Users can define and customize fitness goals, storing parameters in MongoDB for persistence.                         |
| 📈 | **Progress Tracking**| Real-time progress updates through API endpoints, allowing users to monitor their achievements.                      |
| 📱 | **Responsive Design**| A fully responsive UI built with React and styled with Tailwind CSS for optimal viewing across devices.           |
| 🛡️ | **XSS Protection** | Utilizes DOMPurify for input sanitization to prevent Cross-Site Scripting (XSS) attacks.                           |
| ⚙️ | **Centralized State**| Authentication state management is handled via React Context API for consistent user experience.                     |
| 🚀 | **API Services**   | Abstracted API calls using axios, providing a service layer for easy data fetching and updates.                    |
| ✉️ | **Email Validation**| Implements client-side email validation with regular expressions, enhancing data quality.                         |
| 🌐 | **Cloud Database** | Leverages MongoDB Atlas for scalable and reliable cloud-based NoSQL data storage.                                  |

## 📂 Structure
```text
├── README.md
├── package.json
├── src
│   ├── components
│   │   ├── common
│   │   │   ├── Button.jsx
│   │   │   └── Input.jsx
│   │   ├── auth
│   │   │   └── AuthForm.jsx
│   │   ├── goals
│   │   │   ├── GoalCard.jsx
│   │   │   └── GoalForm.jsx
│   │   ├── profile
│   │   │   └── ProfileDetails.jsx
│   │   └── layout
│   │   │   ├── Header.jsx
│   │   │   └── Footer.jsx
│   ├── pages
│   │   ├── Home.jsx
│   │   ├── Dashboard.jsx
│   │   └── Profile.jsx
│   ├── context
│   │   └── AuthContext.jsx
│   ├── services
│   │   ├── api.js
│   │   ├── authService.js
│   │   ├── goalService.js
│   │   └── userService.js
│   ├── utils
│   │   └── helpers.js
│   └── styles
│       └── global.css
├── public
│   ├── index.html
│   └── favicon.ico
├── .env
├── startup.sh
└── commands.json
```

## 💻 Installation
> [!WARNING]
> ### 🔧 Prerequisites
> - Node.js v16+
> - npm 6+

### 🚀 Setup Instructions
1. Clone the repository:
   ```bash
   git clone https://github.com/coslynx/fit-tracker-mvp.git
   cd fit-tracker-mvp
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure environment variables:
   ```bash
   cp .env.example .env
   # Fill in necessary environment variables in .env file
   ```

## 🏗️ Usage
### 🏃‍♂️ Running the MVP
1. Start the development server:
   ```bash
   npm run dev
   ```
2. Access the application:
   - Web interface: `http://localhost:3000`

> [!TIP]
> ### ⚙️ Configuration
> The `.env` file contains the configuration settings for the application. Ensure the following variables are properly set:
> - `REACT_APP_API_BASE_URL`: Base URL for the backend API (default: `http://localhost:3001`)
> - `MONGODB_URI`: MongoDB Atlas connection URI
> - `JWT_SECRET_KEY`: Secret key for signing JSON Web Tokens

### 📚 Examples
Provide specific examples relevant to the MVP's core features. For instance:

- 📝 **User Registration**: 
  ```bash
  curl -X POST http://localhost:3001/auth/register \
       -H "Content-Type: application/json" \
       -d '{"username": "newuser", "email": "user@example.com", "password": "securepass123"}'
  ```

- 📝 **Setting a Fitness Goal**: 
  ```bash
  curl -X POST http://localhost:3001/api/goals \
       -H "Content-Type: application/json" \
       -H "Authorization: Bearer YOUR_JWT_TOKEN" \
       -d '{"name": "Run a Marathon", "description": "Train to complete a 26.2 mile marathon.", "target": 26.2, "unit": "miles"}'
  ```

## 🌐 Hosting
### 🚀 Deployment Instructions
Provide detailed, step-by-step instructions for deploying to the most suitable platform for this MVP. For example:

#### Deploying to Heroku
1. Install the Heroku CLI:
   ```bash
   npm install -g heroku
   ```
2. Login to Heroku:
   ```bash
   heroku login
   ```
3. Create a new Heroku app:
   ```bash
   heroku create fit-tracker-production
   ```
4. Set up environment variables:
   ```bash
   heroku config:set NODE_ENV=production
   heroku config:set REACT_APP_API_BASE_URL=https://your-app-backend.herokuapp.com
   heroku config:set MONGODB_URI=your_mongodb_uri_here
   heroku config:set JWT_SECRET_KEY=your_jwt_secret_key_here
   ```
5. Deploy the code:
   ```bash
   git push heroku main
   ```

### 🔑 Environment Variables
Provide a comprehensive list of all required environment variables, their purposes, and example values:

- `REACT_APP_API_BASE_URL`: Base URL for the backend API
  Example: `http://localhost:3001` or `https://your-app-backend.herokuapp.com`
- `MONGODB_URI`: Connection string for the MongoDB Atlas database
  Example: `mongodb+srv://<user>:<password>@<cluster>.mongodb.net/fitnesstracker`
- `JWT_SECRET_KEY`: Secret key for JWT token generation
  Example: `your-256-bit-secret`

## 📄 API Documentation
### 🔍 Endpoints
Provide a comprehensive list of all API endpoints, their methods, required parameters, and expected responses. For example:

- **POST /auth/register**
  - Description: Register a new user
  - Body: `{ "username": string, "email": string, "password": string }`
  - Response: `{ "statusCode": number, "data": { "id": string, "username": string, "email": string, "token": string } }`

- **POST /auth/login**
  - Description: Log in an existing user
  - Body: `{ "email": string, "password": string }`
  - Response: `{ "statusCode": number, "data": { "id": string, "username": string, "email": string, "token": string } }`
  
- **GET /api/goals**
  - Description: Retrieve all fitness goals for the authenticated user
  - Headers: `Authorization: Bearer TOKEN`
  - Response: `{ "statusCode": number, "data": array<{ "id": string, "name": string, "description": string, "target": number,  "current": number, "unit": string }> }`

- **POST /api/goals**
  - Description: Create a new fitness goal
  - Headers: `Authorization: Bearer TOKEN`
  - Body: `{ "name": string, "description": string, "target": number, "unit": string }`
  - Response: `{ "statusCode": number, "data": { "id": string, "name": string, "description": string, "target": number, "current": number, "unit": string } }`

- **PUT /api/goals/:goalId**
    - Description: Update an existing fitness goal
    - Headers: `Authorization: Bearer TOKEN`
    - Parameters: `goalId` (string, required)
    - Body: `{ "name": string, "description": string, "target": number, "unit": string }`
    - Response: `{ "statusCode": number, "data": { "id": string, "name": string, "description": string, "target": number, "current": number, "unit": string } }`

- **DELETE /api/goals/:goalId**
    - Description: Delete a fitness goal
    - Headers: `Authorization: Bearer TOKEN`
    - Parameters: `goalId` (string, required)
    - Response: `{ "statusCode": number, "message": string }`

- **GET /api/users/:userId**
  - Description: Retrieve a user profile by user ID.
  - Headers: `Authorization: Bearer TOKEN`
  - Parameters: `userId` (string, required)
  - Response: `{ "statusCode": number, "data": { "id": string, "username": string, "email": string } }`

- **PUT /api/users/:userId**
  - Description: Update a user profile by user ID.
  - Headers: `Authorization: Bearer TOKEN`
  - Parameters: `userId` (string, required)
  - Body: `{ "username": string, "email": string }`
  - Response: `{ "statusCode": number, "data": { "id": string, "username": string, "email": string } }`
  
### 🔒 Authentication
Explain the authentication process in detail:
1. Register a new user or login to receive a JWT token
2. Include the token in the `Authorization` header for all protected routes:
   ```
   Authorization: Bearer YOUR_JWT_TOKEN
   ```

### 📝 Examples
Provide comprehensive examples of API usage, including request and response bodies:

```bash
# Register a new user
curl -X POST http://localhost:3001/auth/register \
     -H "Content-Type: application/json" \
     -d '{"username": "fitnessuser", "email": "user@example.com", "password": "securepass123"}'

# Response
{
  "statusCode": 201,
  "data": {
    "id": "user123",
    "username": "fitnessuser",
    "email": "user@example.com",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}

# Create a new goal
curl -X POST http://localhost:3001/api/goals \
     -H "Content-Type: application/json" \
     -H "Authorization: Bearer YOUR_JWT_TOKEN" \
     -d '{"name": "Run a Marathon", "description": "Train to complete a 26.2 mile marathon.", "target": 26.2, "unit": "miles"}'

# Response
{
  "statusCode": 201,
  "data": {
    "id": "goal123",
    "name": "Run a Marathon",
    "description": "Train to complete a 26.2 mile marathon.",
    "target": 26.2,
    "current": 0,
    "unit": "miles"
  }
}
```

> [!NOTE]
> ## 📜 License & Attribution
> 
> ### 📄 License
> This Minimum Viable Product (MVP) is licensed under the [GNU AGPLv3](https://choosealicense.com/licenses/agpl-3.0/) license.
> 
> ### 🤖 AI-Generated MVP
> This MVP was entirely generated using artificial intelligence through [CosLynx.com](https://coslynx.com).
> 
> No human was directly involved in the coding process of the repository: fit-tracker-mvp
> 
> ### 📞 Contact
> For any questions or concerns regarding this AI-generated MVP, please contact CosLynx at:
> - Website: [CosLynx.com](https://coslynx.com)
> - Twitter: [@CosLynxAI](https://x.com/CosLynxAI)

<p align="center">
  <h1 align="center">🌐 CosLynx.com</h1>
</p>
<p align="center">
  <em>Create Your Custom MVP in Minutes With CosLynxAI!</em>
</p>
<div class="badges" align="center">
<img src="https://img.shields.io/badge/Developers-Drix10,_Kais_Radwan-red" alt="">
<img src="https://img.shields.io/badge/Website-CosLynx.com-blue" alt="">
<img src="https://img.shields.io/badge/Backed_by-Google,_Microsoft_&_Amazon_for_Startups-red" alt="">
<img src="https://img.shields.io/badge/Finalist-Backdrop_Build_v4,_v6-black" alt="">
</div>