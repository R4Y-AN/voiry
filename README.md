# Voiry

A MERN (MongoDB, Express.js, React.js, Node.js) web application for sharing audio posts.

## Table of Contents

- [Introduction](#introduction)
- [Screenshots](#screenshots)
- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
- [Technologies Used](#technologies-used)

## Introduction

## Screenshots

See Voiry in action:

![Screenshot 1](https://firebasestorage.googleapis.com/v0/b/voiry-webapp.appspot.com/o/Images%2Fsignin%20page.png?alt=media&token=3192ae04-d05d-4639-aced-b640cc2e28e3)
_Login Page_

![Screenshot 2](https://firebasestorage.googleapis.com/v0/b/voiry-webapp.appspot.com/o/Images%2F1.png?alt=media&token=eaa1937b-babe-4e1c-bc14-ccb86d220b9e)
_Home Page_

![Screenshot 3](https://firebasestorage.googleapis.com/v0/b/voiry-webapp.appspot.com/o/Images%2Fupload.png?alt=media&token=a2c8db94-a4f2-4d01-a52e-c78b9cb93afc)
_Upload Page_

![Screenshot 4](https://firebasestorage.googleapis.com/v0/b/voiry-webapp.appspot.com/o/Images%2Fexplorer.png?alt=media&token=d1f9dae2-ec20-4c1a-b891-527fa6965631)
_Explorer Page_

![Screenshot 5](https://firebasestorage.googleapis.com/v0/b/voiry-webapp.appspot.com/o/Images%2Fprofile.png?alt=media&token=c8ee60e6-68b5-4eff-984b-0d20329e6ead)
_Profile Page_

![Screenshot 6](https://firebasestorage.googleapis.com/v0/b/voiry-webapp.appspot.com/o/Images%2Fediting%20profile.png?alt=media&token=706199fc-3d87-4b02-b75e-82a70a3f437d)
_Edit Profile Page_

## Features

1. **User Authentication:**

   - Sign up and sign in functionality.
   - Secure user authentication with JWT.

2. **User Interaction:**

   - Follow and unfollow users.
   - Real-time chat functionality.
   - Audio post creation and liking.

3. **Explorer:**

   - Explore and discover new audio posts.
   - Filter and search functionalities.

4. **Profile Management:**
   - Edit user profiles.
   - View and manage liked posts.

## Installation

Provide step-by-step instructions on how to set up the project locally. Include prerequisites and dependencies.

```bash
# Clone the repository
git clone https://github.com/R4Y-AN/voiry.git

# Change into the project directory (Frontend)
cd voiry/frontend

# Install dependencies in frontend
npm install

# After installing the frontend dependencies Change into the Backend directory
cd ..
cd backend

# Install dependencies in backend
npm install

# Set up environment variables in frontend and also backend

# .env FOR YOUR BACKEND
MONGO=YOUR MONGO DB SERVER URI

JWT_SECRET=JWT SECRET CODE

apiKey=YOUR FIREBASE TOKEN
authDomain=YOUR FIREBASE TOKEN
databaseURL= YOUR FIREBASE TOKEN
storageBucket=YOUR FIREBASE TOKEN
messagingSenderId=YOUR FIREBASE TOKEN
appId= YOUR FIREBASE TOKEN

# .env FOR YOUR FRONTEND
REACT_APP_SERVER_IP= YOUR BACKEND SERVER IP

REACT_APP_APIKEY=YOUR FIREBASE TOKEN
REACT_APP_AUTHDOMAIN=YOUR FIREBASE TOKEN
REACT_APP_DATABASE_URL=YOUR FIREBASE TOKEN
REACT_APP_PROJECT_ID=YOUR FIREBASE TOKEN
REACT_APP_STORAGE_BUCKET=YOUR FIREBASE TOKEN
REACT_APP_MESSAGING_SENDER_ID=YOUR FIREBASE TOKEN
REACT_APP_APP_ID= YOUR FIREBASE TOKEN


# Run the frontend
npm start

# Run the backend
nodemon index.js
```

## Usage

Explore the various features of AudioShare with ease.

### Creating an Audio Post

To create an audio post, follow these steps:

1. Navigate to the "Create Post" section in the user interface.
2. Upload your audio file and provide a captivating description.
3. Click the "Post" button to share your audio with the community.

### Interacting with the Explorer

Discover new audio content using the Explorer:

1. Access the "Explorer" tab to see a curated list of trending audio posts.
2. Use filters and search functionality to find posts based on your interests.

### Managing Your Profile

Keep your profile up-to-date:

1. Visit the "Profile" section to edit your personal information.
2. View and manage the posts you've liked for quick reference.

Feel free to customize and expand upon these instructions to provide more detailed guidance on using specific features of your application.

## Technologies Used

AudioShare is built using the following technologies:

- MongoDB
- Express.js
- React.js
- TailwindCSS
- Node.js
- Firebase (for realtime chat and storing files)
- Other relevant libraries...
