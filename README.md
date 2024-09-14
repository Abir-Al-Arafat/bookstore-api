# bookstore-api

### <u><b>Project Setup:</b></u>

<ol>
<li>Clone the repository: </li>

```bash
git clone https://github.com/Abir-Al-Arafat/bookstore-api.git
```

<li>Navigate into the directory:</li>

```bash
cd bookstore-api
```

<li>Install the necessary packages:</li>

```bash
npm install
```

<li>Navigate to the .env file to set the database name, user and password, set jwt secret and expiry time </li>

<li>Navigate to the migration folder and run the migrations using: </li>
```bash
npx knex migrate:latest --knexfile ../src/config/knexfile.js
```

<li>Run the project in dev using:</li>

```node
npm run dev
```

</ol>

### <u><b>This is a RESTful API for a Bookstore</b></u>

# The API allows users to perform CRUD (Create, Read, Update, Delete) operations on books and authors and also includes authentication, authorization, searching, filtering, pagination.

## techonologies used:

1. TypeScript used for type safety
2. Express for the web framework
3. Express Validator for input validation
4. MySQL for the database.
5. Knex used as a query builder.
6. .env files used for environment variables.
7. bcryptjs for hashing password
8. jsonwebtoken for authentication and authorization

## Database Schema

### Authors Table

| Column    | Type         | Constraints                 |
| --------- | ------------ | --------------------------- |
| id        | INT          | PRIMARY KEY, AUTO_INCREMENT |
| name      | VARCHAR(255) | NOT NULL                    |
| bio       | TEXT         | OPTIONAL                    |
| birthdate | DATE         | NOT NULL                    |

### Books Table

| Column         | Type         | Constraints                                    |
| -------------- | ------------ | ---------------------------------------------- |
| id             | INT          | PRIMARY KEY, AUTO_INCREMENT                    |
| title          | VARCHAR(255) | NOT NULL                                       |
| description    | TEXT         | OPTIONAL                                       |
| published_date | DATE         | NOT NULL                                       |
| author_id      | INT          | FOREIGN KEY REFERENCES `authors(id)`, NOT NULL |

### Auth Users Table

| Column   | Type         | Constraints      |
| -------- | ------------ | ---------------- |
| name     | VARCHAR(255) | NOT NULL         |
| email    | VARCHAR(255) | NOT NULL, UNIQUE |
| password | VARCHAR(255) | NOT NULL         |

<p>All routes:</p>
### Books
```js
    1.  route: "/books"
        method: "GET",
    2.  route: "/books/:id"
        method: "GET"
    3.  route: "/books"
        method: "POST",
        payload: "body",
        body: {
            "title": "Book Title",
            "description": "Book description (optional)",
            "published_date": "YYYY-MM-DD",
            "author_id": 1
        }
    4.  route: "/books/:id"
        method: "PUT",
        payload: "body",
        body: {
            "title": "Book Title",
            "description": "Book description (optional)",
            "published_date": "YYYY-MM-DD",
            "author_id": 1
        }
    5.  route: "/books/:id"
        method: "DELETE",
    6.  route: "/books?author=6"
        method: "GET",
```

### Authors

```js
    1.  route: "/authors"
        method: "GET",
    2.  route: "/authors/:id"
        method: "GET"
    3.  route: "/authors"
        method: "POST",
        payload: "body",
        body: {
            "name": "Author Name",
            "bio": "Author biography (optional)",
            "birthdate": "YYYY-MM-DD"
        }
    4.  route: "/authors/:id"
        method: "PUT",
        payload: "body",
        body: {
            "name": "Author Name",
            "bio": "Author biography (optional)",
            "birthdate": "YYYY-MM-DD"
        }
    5.  route: "/authors/:id"
        method: "DELETE",
```

### Authentication & Authorization

```js
    1.  route: "/users/auth/signup"
        method: "POST",
        payload: "body",
        body: {
            "name": "User Name",
            "email": "user@example.com",
            "password": "password123"
        }

    2.  route: "/users/auth/login"
        method: "POST",
        payload: "body",
        body: {
            "email": "user@example.com",
            "password": "password123"
        }
```

# Description (All the main and bonus requirements have been completed):

1. User Management:
   - User can register and login.
   - JWT used for secure authentication and authorization.
   - Passwords been hashed using bcrypt before storing them in the database.
2. Book and Author Management:
   - Endpoints implemented for creating, updating, retrieving and deleting Book and Author information.
3. Middleware for Authentication and Validations:
   - Middlewares added for validations and to protect routes and ensure only authenticated users can access them.
4. Express Validator added to validate request bodies.
5. pagination added for books and authors
6. search funtionality added to filter books by title and authors by name.
7. Error Handling: meaningful HTTP status codes, error messages, resource not found, validation errors and database connection errors added for handling errors.
8. mysql2 client library used
9. environment variables used to manage database credentials.

<p><strong>Project  Structure:</strong></p>

```
    migrations/
    src/
        config/
        constants/
        controller/
        middleware/
        routes/
        utilities/
        index.ts
    .env.example
```

<span>Necessary Dependencies</span>

<ol>
    <li>
        <a href="https://www.npmjs.com/package/dotenv">dotenv</a>
    </li>
    <li>
        <a href="https://www.npmjs.com/package/express">express</a>
    </li>
    <li>
        <a href="https://www.npmjs.com/package/express-validator">express-validator</a>
    </li>
    <li>
        <a href="https://www.npmjs.com/package/mysql2">mysql2</a>
    </li>
    <li>
        <a href="https://www.npmjs.com/package/jsonwebtoken">jsonwebtoken</a>
    </li>
    <li>
        <a href="https://www.npmjs.com/package/bcryptjs">bcryptjs</a>
    </li>
    <li>
        <a href="https://www.npmjs.com/package/knex">knex</a>
    </li>
    <li>
        <a href="https://www.npmjs.com/package/nodemon">nodemon</a>
    </li>
</ol>
