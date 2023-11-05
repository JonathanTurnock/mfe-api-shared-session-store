## Seamless Session Sharing in Node.js & Express

Modern web applications often split their architecture into microfrontends (MFE) for the user interface and separate services for backend APIs. While this modular approach has its advantages in scalability and maintainability, it presents unique challenges. One such challenge is managing user sessions across these decoupled systems. This tutorial will guide you through the process of sharing sessions between a microfrontend and an API in a Node.js environment.

### Understanding the Architecture

Let’s start by exploring the architecture of our sample application. We have two main components:

- **Web Server (app.js)**: This is our frontend server that serves the HTML pages and deals with user sessions.
- **API Server (api.js)**: This is our backend server that the frontend consumes. It relies on a valid session initiated by the web server.

Both servers are Express.js applications, and we use MongoDB as our session store for its flexibility and ease of use in distributed systems.

### Session Management with express-session
The express-session middleware is instrumental in handling session data. Let's see how we've configured it for both servers.

On the Web Server (app.js):
```javascript
app.use(
  session({
    name: config.sessionCookieName,
    secret: config.sessionCookieSecret,
    store: config.sessionStore,
    resave: true,
    saveUninitialized: true,
  })
);
```
In the snippet above, we initialize the session middleware. We specify a cookie name and a secret for signing the session ID. `store` is set to use MongoDB through `connect-mongo`, allowing our sessions to be stored in a centralized database.

On the API Server (api.js):
```javascript
app.use(
  session({
    name: config.sessionCookieName,
    secret: config.sessionCookieSecret,
    store: config.sessionStore,
    saveUninitialized: false,
    resave: false,
  })
);
```
For the API server, the configuration is similar, but `saveUninitialized` is set to `false` to prevent creating sessions for unauthenticated requests.

### Signing Cookies for Secure Transmission
When a session is initiated on the web server, a cookie is created and needs to be transmitted securely to the API server. Here's how we sign the cookie using `cookie-signature`:

In utils.js:
```javascript
const signedSessionId = `s:${sign(req.sessionID, config.sessionCookieSecret)}`;
```
This code signs the session ID from the request with our secret, creating a secure token that the client can use to authenticate with the API.

### Middleware for Session Validation
Before the API processes any request, we must ensure that a valid session exists. We've created a middleware called `withSession` for this purpose.

```javascript
const withSession = (req, res, next) => {
  if (req.session.username) {
    next();
  } else {
    res.status(401).send("Unauthorized");
  }
};
```

This middleware checks if the `username` exists in the session. If not, it sends a 401 Unauthorized response.

### The User Flow
Now let's look at the user flow with a bit more detail:

1. **User Visits Web Server**: When a user accesses the web server, a session is initiated and stored in MongoDB.

```javascript
app.use((req, res, next) => {
  if (!req.session.username) {
    req.session.username = crypto.randomUUID();
  }
  next();
});

```

2. **Fetching Data from API Server**: The web server makes a request to the API, passing along the signed session cookie in the headers.

```javascript
axios.get("http://localhost:3001/api", {
  headers: getSessionHeaders(req)
});
```

3. **API Server Validates Session**: The API server receives the request, validates the session using the middleware, and responds with data.

```javascript
app.use("/api", withSession, (req, res) => {
    res.send({ status: "OK", views: req.session.views });
});
```

### Dockerizing the Environment
For convenience, we've dockerized our MongoDB setup. Here's a snippet of the `docker-compose.yml` configuration:

```yaml
services:
  mongo:
    image: mongo
    ports:
      - "27017:27017"
    volumes:
      - mongodb_data_container:/data/db
```

With Docker, starting the database is as simple as running `docker-compose up -d`.

### Running the Example
To run our example, clone the repository and install the dependencies. Then, use Docker to spin up the MongoDB container, and start the servers:

```shell
npm start # starts the web server on port 3000
npm run start:api # starts the API server on port 3001
```

### Wrapping Up
Through this tutorial, you've seen how to configure a Node.js application to share session data between a microfrontend and an API server using MongoDB. 

By following the steps outlined here, you can ensure that your modular application components maintain a cohesive session state, providing a seamless user experience across your entire platform.

Implementing a shared session store within a partitioned monolith architecture, as highlighted in our Node.js application, offers a strategic benefit, particularly when compared to a microservices architecture that might opt for a stateless token approach. 

This method allows session management within the partitions of a monolith without having to adopt and maintain complex architecture, allowing for a seamless user experience and simplified server-side handling. While bearer tokens are well-suited to fully decoupled microservices, a shared session store is more similar for systems where the various components are more tightly integrated but still need to maintain a level of independence, such as in a partitioned monolith. 

It provides a balanced solution that supports both isolated service development and unified session management.

Needless to say careful control should be maintained of data within the session store to ensure each application is not reaching and relying on loosely coupled contracts.

the full example is accessible on github @ https://github.com/JonathanTurnock/mfe-api-shared-session-store