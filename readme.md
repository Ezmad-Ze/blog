
# Project Title

Blog for Interview

## Table of Contents

- [Installation](#installation)
- [Scripts](#scripts)
- [Environment Variables](#environment-variables)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)
- [Testing](#testing)

## Installation

1. Clone the repo:
   ```bash
   git clone https://github.com/username/blog.git
   ```
2. Navigate into the project directory:
   ```bash
   cd blog
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. [Optional] Setup environment variables in `.env` (see [Environment Variables](#environment-variables)).

## Scripts

| Script             | Description                                                     |
| ------------------ | --------------------------------------------------------------- |
| `npm run dev`      | Runs the app in development mode with nodemon or ts-node.       |
| `npm run build`    | Builds the project (TypeScript -> JavaScript, etc.).            |
| `npm run start`    | Runs the built app (in `dist` or `build` folder).               |
| `npm run test`     | Runs the test suite with Jest.                                  |
| `npm run migrate`  | Runs database migrations (e.g., `prisma migrate`).              |

## Environment Variables

Create a file named `.env` in the project root. Add these variables:

```dotenv
DATABASE_URL="your-database-connection-string"
JWT_SECRET="your_jwt_secret"
PORT=3000
```

Adjust values according to your environment.

## Usage

1. **Development**:
   ```bash
   npm run dev
   ```
   The server should start at [http://localhost:3000](http://localhost:3000) (or whichever port you specified).

2. **Production**:
   ```bash
   npm run build
   npm run start
   ```

## API Endpoints

Below is a sample overview of available endpoints. (Adjust to match your routes.)

- **Auth**  
  - `POST /auth/register` — Register a new user  
  - `POST /auth/login` — Login and get a JWT  
  - `POST /auth/change-role` — Change user role (Admin only)

- **Blogs**  
  - `GET /blogs` — Fetch all blogs  
  - `GET /blogs/search?query=KEYWORD` — Search blogs by keyword  
  - `POST /blogs` — Create a new blog (Authenticated)  
  - `GET /blogs/:id` — Get blog by ID  
  - `PUT /blogs/:id` — Update blog (Owner only)  
  - `DELETE /blogs/:id` — Delete blog (Owner only)

- **Users**  
  - `GET /users/:id` — Get user profile  
  - `PUT /users/profile` — Update profile (Authenticated)  
  - `GET /users/search?query=KEYWORD` — Search users by query

- **Comments**  
  - `POST /comments` — Create a comment (Authenticated)  
  - `PUT /comments/:id` — Edit a comment (Owner only)  
  - `DELETE /comments/:id` — Delete a comment (Owner only)

- **Ratings/Likes**  
  - `POST /comments/rate` — Rate a blog (Authenticated)  
  - `POST /comments/like` — Like/unlike a blog (Authenticated)

*(Adjust these to reflect your actual routes and controllers.)*

## Testing

- Run tests with:
  ```bash
  npm test
  ```
  
- You can find tests in the `tests` folder or alongside controllers (depending on your structure).