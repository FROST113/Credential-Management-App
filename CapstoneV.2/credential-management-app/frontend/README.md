# Credential Management App

The Credential Management App is a web application designed to manage user credentials and organizational units within different divisions. It allows users to register, log in, and perform actions such as adding organizational units and managing user roles.

## Table of Contents

- [Features](#features)
- [Technologies Used](#technologies-used)
- [Installation](#installation)
- [Usage](#usage)
- [Backend Setup](#backend-setup)
- [Frontend Setup](#frontend-setup)
- [Login Details](#Login-details)
- [Contributing](#contributing)

## Features

- User Registration and Authentication
- Adding and Managing Organizational Units (OUs)
- Managing Divisions and Credentials
- Updating User Roles

## Technologies Used

- Backend:
  - Node.js
  - Express.js
  - MongoDB (mongoose)
  - JWT for authentication
  - bcrypt for password hashing

- Frontend:
  - React.js
  - Axios for API requests
  - React Toastify for notifications

## Installation

To run the Credential Management App locally, follow these steps:

# Navigate to the backend folder
cd credential-management-app/backend
npm install

# Navigate to the frontend folder
cd ../frontend
npm install

## Usage
# Inside the backend folder
npm start

# Inside the frontend folder
npm start

## Backend Setup

The backend uses MongoDB for data storage. Make sure you have a MongoDB instance running, and update the MongoDB URI in the backend/.env file.

Create a .env file in the backend folder with the following content:

MONGODB_URI=your-mongodb-uri
JWT_SECRET=your-jwt-secret

## Frontend Setup

Update API URLs:

In the frontend/src/UserList.js file, update the API URLs to point to your backend:

javascript
Copy code
const apiBaseUrl = "http://localhost:5000/api";
const usersApiUrl = `${apiBaseUrl}/users`;
const rolesApiUrl = `${apiBaseUrl}/roles`;

##Login-Details

Admin
Username: JuanDev
Password: Batman13!0412

Manager
Username: JuanDev2
Password: Batman13!0412

Normal
Username: JuanDev3
Password: Batman13!0412



## Contributing
Contributions are welcome! If you find any issues or have suggestions for improvements, please open an issue or submit a pull request.



