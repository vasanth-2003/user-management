Changes I Made:
---------------

* As i Familiar with nodejs so I Rewrote the entire backend using Node.js with Express: Implemented a clean and modular API structure.

* Used SQLite for simplicity.

* Created RESTful API Endpoints:
--------------------------------
=> GET /users/ – Fetch all users

=> GET /users/:userId – Get user by ID

=> POST /users/ – Create new user

=> PUT /users/:userId – Update user

=> DELETE /users/:userId – Delete user

=> GET /search?name=xyz – Search by name

=> POST /login/ – Basic login endpoint

* Added error handling with try-catch blocks for all endpoints.

* Prepared for future password encryption by importing bcrypt (though not used).

* Structured the server to initialize DB and handle port dynamically using process.env.PORT.

Note on Including users.db:
--------------------------
* The users.db file is intentionally included in the repository because:

* It is small and lightweight.

* It allows easy testing and evaluation of the APIs without requiring manual database setup.

What I Would Do with More Time:
-------------------------------
* Implement password hashing using bcrypt

Which AI Tool I Used:
---------------------
* ChatGPT (OpenAI GPT-4)
* For code reviews and validation of edge cases