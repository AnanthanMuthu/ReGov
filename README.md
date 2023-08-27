# Test application for ReGov Technologies

This is a test application for https://github.com/regov-enterprise/pop-quiz-frontend-s-v7

## Functionalities

The project includes the following functionalities:

- Registration for users
- Login user
- Forgot password
- Email verification
- Error checking for forms
- Server-side form error handling
- Storage of user data in local storage
- Checking for private routes
- Checking for public routes
- Create new KYC
- List KYC
- Update KYC

## Environment Variables

To run this project, you will need to add the following environment variables in server directory to your .env file

```bash
    PORT = "Server Running PORT"
    MONGO_URI = "MongoDB URL (local or from mongo atlas)"
    JWT_SECRET = "Secret for JWT token"
    NODEMAILER_SECRET = "Secret for Nodemailer"
    NODEMAILER_NAME = "Email title"
    NODEMAILER_EMAIL = "Your organization email"
    NODEMAILER_PASS = "Your organization email password"
    CLIENT_URL = "Your react client URL"
```

## Run Locally

Clone the project

Go to the client directory install dependencies

```bash
  cd client && npm install
```

In a diffrent terminal go to the server directory install dependencies

```bash
  cd server && npm install
```

In the server directory to start the server

```bash
  npm run server
```

In the client directory to start the client

```bash
  npm run dev
```

## Tech Stack Client

**Framework:** React

**Build Tool:** Vite

**Form Library:** Formik

**Form Validation:** Yup

**API Request:** Axios

## Tech Stack Server

**Runtime Env:** NodeJS

**Database:** MongoDB

**Encryption:** Bcryptjs

**Send Emails:** Nodemailer

**RESTful APIs Build:** Express
