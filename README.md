# Project Name

## Basic Blog Application With Node, React & Redux
1. User can Sign Up and Log In
2. View All Blogs
3. Post new blog but need authentication
4. Comment in blog
5. View Details of a blog
6. Edit or Delete own Blog

## Table of Contents
- [Project Structure](#project-structure)
- [Technologies Used](#technologies-used)
- [Setup Instructions](#setup-instructions)
  - [Server (Node.js)](#server-nodejs)
  - [Client (React)](#client-react)
- [Available Scripts](#available-scripts)
  - [Server Scripts](#server-scripts)
  - [Client Scripts](#client-scripts)
- [API Documentation](#api-documentation)

---

## Project Structure


## Technologies Used
- **Frontend (React)**
  - React
  - React Router
  - Axios for API calls
  - Redux
  - Sass
  - MUI

- **Backend (Node.js)**
  - Node.js
  - Express.js
  - MongoDB
  - Mongoose 
  - JWT for authentication and authorization
  - Bcrypt for encryption 

## Setup Instructions

### Prerequisites
- Node.js installed on your machine

### Server (Node.js)

1. **Navigate to the `server` folder:**
    ```bash
    cd server
    ```

2. **Install dependencies:**
    ```bash
    npm install
    ```

3. **Set up environment variables:**
   Create a `.env` file in the `server` folder by copying `.env.example` file content

4. **Start the server:**
    ```bash
    npm run dev
    ```
    This will start the server at `http://localhost:5000`.

### Client (React)

1. **Navigate to the `client` folder:**
    ```bash
    cd client
    ```

2. **Install dependencies:**
    ```bash
    npm install
    ```

3. **Start the client application:**
    ```bash
    npm run dev
    ```
    The client will run at `http://localhost:5173`.

### Running Both Server and Client Together after completing installation process of both server and client
You can run both parts of the application concurrently using the following:

1. **Navigate to the root directory and install `concurrently`:**
    ```bash
    npm install
    ```

2. **Run both applications:**
    ```bash
    npm run start
    ```

## Available Scripts

### Server Scripts
- **`npm run dev`**: Start the server with hot reloading.
- **`npm start`**: Start the server in production mode.

### Client Scripts
- **`npm run dev`**: Start the React application.
- **`npm run build`**: Build the application for production.

## API Documentation
I have included postman collection for any referance.


