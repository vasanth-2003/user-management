// Import required modules
const express = require("express");
const path = require("path");
const sqlite3 = require("sqlite3");
const { open } = require("sqlite");
const bcrypt = require("bcrypt"); // Currently not used, but good for password hashing

// Initialize Express app
const app = express();
app.use(express.json()); // Middleware to parse JSON request bodies

// Define the path to the SQLite database
const dbPath = path.join(__dirname, "users.db");

let db = null;

// Function to initialize DB connection and start server
const initializeDBAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    app.listen(3000, () => {
      console.log("Server Running at http://localhost:3000/");
    });
  } catch (e) {
    console.log(`DB Error: ${e.message}`);
    process.exit(1); // Exit process if DB connection fails
  }
};

initializeDBAndServer();

// Root route
app.get("/", (request, response) => {
  response.send("User Management System");
});

// GET all users
app.get("/users/", async (request, response) => {
  try {
    const getUsersQuery = `
      SELECT *
      FROM users
      ORDER BY id;
    `;
    const usersArray = await db.all(getUsersQuery);
    response.send(usersArray);
  } catch (error) {
    console.error("Error fetching users:", error.message);
    response.status(500).send("Internal Server Error");
  }
});

// GET a single user by ID
app.get("/users/:userId", async (request, response) => {
  try {
    const { userId } = request.params;
    const getUsersQuery = `
      SELECT *
      FROM users
      WHERE id = ${userId};
    `;
    const userData = await db.get(getUsersQuery);
    response.send(userData);
  } catch (error) {
    console.error("Error fetching user:", error.message);
    response.status(500).send("Internal Server Error");
  }
});

// POST (Create) a new user
app.post("/users/", async (request, response) => {
  try {
    const { name, email, password } = request.body;

    const postUserQuery = `
      INSERT INTO users(name, email, password)
      VALUES (
        "${name}",
        "${email}",
        "${password}"
      );
    `;

    const dbResponse = await db.run(postUserQuery);
    const userId = dbResponse.lastID;
    console.log(dbResponse);
    response.send({ id: userId, message: "User created" });
  } catch (error) {
    console.error("Error creating user:", error.message);
    response.status(500).send("Internal Server Error");
  }
});

// PUT (Update) user data by ID
app.put("/users/:userId", async (request, response) => {
  try {
    const { userId } = request.params;
    const { name, email, password } = request.body;

    const updateQuery = `
      UPDATE users
      SET name="${name}",
          email="${email}",
          password="${password}"
      WHERE id = "${userId}";
    `;

    await db.run(updateQuery);
    console.log(updateQuery);
    response.send("User's Data Updated Successfully!");
  } catch (error) {
    console.error("Error updating user:", error.message);
    response.status(500).send("Internal Server Error");
  }
});

// DELETE user by ID
app.delete("/users/:userId", async (request, response) => {
  try {
    const { userId } = request.params;
    const deleteQuery = `
      DELETE 
      FROM users
      WHERE id="${userId}";
    `;
    await db.run(deleteQuery);
    response.send("User Deleted Successfully!");
  } catch (error) {
    console.error("Error deleting user:", error.message);
    response.status(500).send("Internal Server Error");
  }
});

// GET users by name search (query param)
app.get("/search", async (request, response) => {
  try {
    const { name } = request.query;
    const searchQuery = `
      SELECT *
      FROM users
      WHERE name LIKE "%${name}%"
    `;
    const dbResponse = await db.all(searchQuery);
    response.send(dbResponse);
  } catch (error) {
    console.error("Error during search:", error.message);
    response.status(500).send("Internal Server Error");
  }
});

// POST login route
app.post("/login/", async (request, response) => {
  const { email, password } = request.body;

  // Query to get user by email
  const loginQuery = `
    SELECT * 
    FROM users
    WHERE email = "${email}";
  `;
  const dbResponse = await db.get(loginQuery);

  // If user not found
  if (dbResponse === undefined) {
    response.status(400);
    response.send("Incorrect Email Please Register To Continue!");
  } else {
    // If password matches
    if (password === dbResponse.password) {
      response.send("Logined Successfully!");
    } else {
      response.status(400);
      response.send("Incorrect Password!");
    }
  }
});


app.listen(3000);
