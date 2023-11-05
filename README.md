# MFE API Shared Session Store Example

This example illustrates building a Microfrontend (MFE) application with a shared session store using Express.js and MongoDB. This setup allows a front-end application and a separate API service to share user session data seamlessly.

## Overview

The project consists of two main parts:

- **Web Server (`app.js`)**: Serves the frontend content, manages user sessions, and communicates with the API.
- **API Server (`api.js`)**: Provides a protected API that only serves requests with a valid session.

These components use MongoDB as a shared session store to ensure session continuity across the services.

### Session Management

Session management is critical for modern web applications. Here, we use `express-session` with a MongoDB store provided by `connect-mongo`. Sessions are created on the first visit to the web server and are then shared with the API server via cookies.

### Security

Security in session management is achieved through:
- Signing session IDs using a secret to prevent session hijacking.
- Configuring cookies securely to avoid XSS and CSRF vulnerabilities.

### Frontend Routing

The routing in `routes/index.js` is set up to demonstrate session tracking. Each time the main page is visited, the session view count is incremented.

### Templates

The `views/index.hbs` file is a Handlebars template to display session data on the front end.

### Docker Integration

Docker is used to containerize the MongoDB instance for session storage, ensuring that our application can be run consistently across different environments.

## Prerequisites

To follow this tutorial, you should have the following installed on your machine:
- Node.js
- npm (comes with Node.js)
- Docker (for containerization of MongoDB)

## Installation and Setup

Follow these steps to set up the environment:

1. **Clone the repository:**
    ```bash
    git clone https://github.com/your-repo/mfe-api-shared-session-store.git
    cd mfe-api-shared-session-store
    ```

2. **Install dependencies:**
    ```bash
    npm install
    ```

3. **Start MongoDB with Docker Compose:**
    ```bash
    docker-compose up -d
    ```

4. **Run the web server:**
    ```bash
    npm start
    ```

5. **Run the API server:**
    ```bash
    npm run start:api
    ```

## Tutorial Steps

### Understanding the Configuration

The `config.js` file contains the session cookie settings and MongoDB connection details. Review this file to understand how sessions are configured.

### Exploring the Web Server

Open `app.js` and follow the code to see how the Express server is set up, how sessions are initiated, and how the view engine is configured.

### Exploring the API Server

In `api.js`, notice how we protect the API routes with the `withSession` middleware from `utils.js`, ensuring only requests with a valid session can access them.

### Testing Session Sharing

To test session sharing:
- Visit `http://localhost:3000` in your browser to initiate a session and increment the view count.
- Access `http://localhost:3001/api` using a REST client like Postman with the session cookie from the browser to see if the session persists.

### Docker and MongoDB

Understand how Docker is used to run MongoDB, which stores the session data, by reviewing the `docker-compose.yml` file.

## Further Development

This section can outline steps for extending the application, such as adding new routes or integrating other Microfrontend services.

## Contributing

Explain how users can contribute to this tutorial. Encourage improvements and expansions to the tutorial.

## Authors

List the authors and contributors.

## License

Specify the license under which this tutorial is released.

## Acknowledgments

Credit any sources or inspirations for this project.

