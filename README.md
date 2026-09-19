# Blog Management Application

A full-stack blog management platform built with Next.js, Express.js, Sequelize, and MySQL. Guests can discover and read articles, registered users can manage their own blogs and profile, and administrators can manage every blog and every user account.

The frontend consumes the real REST API in this repository. There are no mock users, hardcoded blog lists, or direct frontend database access; every piece of data comes from the backend.

## Main Features

### Guest

- Browse all blogs on the homepage
- Search blogs by title, from the navbar on any page or from the homepage search box; results always appear on the homepage list
- Filter blogs by category
- Combine title search and category filtering
- Read the full blog with author and date
- Register, log in, and recover a forgotten password by email

### User

- JWT-based login that survives a page refresh (a session lasts 1 hour by default, set by `JWT_EXPIRES_IN`)
- Protected dashboard with a welcome message, profile summary, total blog count, and recent blogs
- **My Blogs**: view, create, edit, and delete only their own blogs, with a confirmation dialog before deleting
- View and update first and last name
- Upload a profile image; the navbar avatar updates immediately without logging in again
- Change password and log out from the navbar menu or the sidebar

### Admin

- Everything a normal user can do
- Admin dashboard with platform totals (blogs, users, categories in use) and the latest blogs across all authors
- **All Blogs**: view every user's blogs, and edit or delete any of them
- **Users**: view all registered users with role and status
- View an individual user's details (name, email, role, status, profile image, created date)
- Activate or deactivate accounts; a deactivated user is blocked immediately, even if their token has not expired
- Admin-only access is enforced by the backend as well as the UI

### General

- Responsive layout: the sidebar becomes a slide-in drawer on small screens and blog cards stack vertically on mobile; the navbar search box is hidden on phone-width screens, where the homepage search box is used instead
- Loading states, empty states, and readable error messages on every data-driven page
- Submit buttons disable while a request is running to prevent duplicate submissions
- If the backend rejects a token as expired or invalid, the next protected request logs the user out and returns them to the login page

## Technologies

### Frontend

- Next.js 16 (App Router) and React 19
- Tailwind CSS 4
- axios with a shared instance that attaches the JWT and handles expired sessions
- Context API for authentication state
- A service layer (`services/`) so pages never call the API directly

### Backend

- Node.js and Express 4
- MySQL with Sequelize ORM (`mysql2` driver)
- JSON Web Tokens for authentication
- bcryptjs for password hashing
- Nodemailer with Gmail SMTP for password-reset emails
- Multer for profile image uploads
- CORS and dotenv

## Security Notes

- Passwords are hashed with bcrypt before storage and are never returned by any API response.
- The auth middleware verifies the JWT and reloads the user from the database on every protected request, so deactivating a user takes effect immediately.
- Admin-only endpoints (`/api/users`, `/api/users/:id`, `/api/users/:id/status`) are guarded by role middleware, not just hidden in the UI.
- Ownership checks stop a normal user from updating or deleting another user's blog. The frontend never sends a `userId` when creating a blog; the backend takes the author from the token.
- Registration always creates a normal `user`; role and active status cannot be set from the frontend.
- Login returns the same "Invalid email or password" message for an unknown email and a wrong password.
- Password-reset tokens are random, stored only as a SHA-256 hash, expire after 15 minutes, work once, and the forgot-password response does not reveal whether an email is registered.
- Profile uploads are limited to the JPG, PNG, GIF, and WEBP image types and a 3 MB size, checked on both the frontend and the backend.
- Real `.env` files are ignored and must never be committed.

### Known limitations

- The JWT is stored in `localStorage`, which is common for coursework but not the safest choice for production.
- CORS currently allows all origins; restrict it to the deployed frontend origin before deploying.
- There is no rate limiting on login or password-reset endpoints.
- The backend validates an upload by its declared file type and size only; it does not inspect the file's contents.
- The blog and user lists are not paginated.

## Project Structure

```text
.
|-- backend/
|   |-- config/          # Sequelize database connection
|   |-- controllers/     # HTTP request handlers and input validation
|   |-- middlewares/     # Auth, admin role, upload, and error handling
|   |-- models/          # Sequelize models and associations
|   |-- routes/          # REST API routes
|   |-- services/        # Business logic and database access
|   |-- uploads/         # Uploaded profile images
|   |-- utils/           # Response helper, logger, AppError
|   |-- app.js           # Express application setup
|   |-- server.js        # Backend entry point
|   `-- seed.js          # Creates the demo admin account
|-- frontend/
|   |-- app/             # Next.js App Router pages and layouts
|   |-- components/      # Reusable UI components
|   |-- contexts/        # Authentication context
|   |-- hooks/           # Route-guard hook
|   |-- public/          # Static assets
|   |-- services/        # Auth, user, and blog API services
|   `-- utils/           # Axios instance, categories, photo validation
|-- Requirment/          # Assignment requirements
|-- screenshots/         # Screenshots used in this README
`-- README.md
```

## Prerequisites

- Node.js 20.9 or later (required by Next.js 16)
- npm
- MySQL Server
- A Gmail account with an App Password, only if you want to test the forgot-password email

## Installation

Clone the repository:

```bash
git clone https://github.com/rashadkhan97/blogsite-using-NextJS-and-Tailwind.git
```

Install backend and frontend dependencies:

```bash
cd backend
npm install

cd ../frontend
npm install
```

Create the MySQL database:

```sql
CREATE DATABASE blog_management;
```

The tables are created automatically the first time the backend starts.

## Environment Variables

Copy each example file to a local `.env` file.

PowerShell:

```powershell
Copy-Item backend/.env.example backend/.env
Copy-Item frontend/.env.example frontend/.env
```

macOS/Linux:

```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
```

### Backend environment (`backend/.env`)

| Variable | Purpose |
|---|---|
| `PORT` | Backend HTTP port, normally `5000` |
| `DB_HOST` | MySQL host |
| `DB_PORT` | MySQL port, normally `3306` |
| `DB_USER` | MySQL user |
| `DB_PASSWORD` | MySQL password |
| `DB_NAME` | MySQL database name (must exist before starting) |
| `JWT_SECRET` | Private secret used to sign JWTs; use a long random string |
| `JWT_EXPIRES_IN` | JWT lifetime, such as `1h` |
| `GMAIL` | Gmail address that sends the reset emails |
| `GMAIL_APP_PASSWORD` | Gmail App Password (not your normal password); never commit it |
| `FRONTEND_URL` | Frontend origin used to build the password-reset link |

`GMAIL` and `GMAIL_APP_PASSWORD` are only needed for the forgot-password email. Every other feature works without them.

The backend reads `backend/.env` only when it starts, so restart it after you change a value.

If the frontend runs on a port other than `3000`, update the backend value to match:

```env
FRONTEND_URL=http://localhost:3001
```

### Frontend environment (`frontend/.env`)

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

> `NEXT_PUBLIC_API_URL` must end with `/api`. Uploaded images are served from the backend's root `/uploads` path, so the app removes the `/api` suffix when it builds image URLs.

## Running the Application

Start the backend in the first terminal:

```bash
cd backend
npm run dev
```

The backend runs at [http://localhost:5000](http://localhost:5000). Confirm it is healthy at [http://localhost:5000/api/health](http://localhost:5000/api/health).

Start the frontend in a second terminal:

```bash
cd frontend
npm run dev
```

The frontend runs at [http://localhost:3000](http://localhost:3000). To use another port:

```bash
npm run dev -- -p 3001
```

## Demo Admin Account

Anyone who registers becomes a normal `user`; the app deliberately gives the frontend no way to choose a role. The first admin is created with a seeder. After the database exists and `backend/.env` has your database settings, run:

```bash
cd backend
npm run seed
```

| Field | Value |
|---|---|
| Email | `admin@test.com` |
| Password | `admin123` |

Log in at `/login` with those credentials and the sidebar will show **All Blogs** and **Users**.

The seeder creates the `users` table if it is missing, and it is safe to run again: if `admin@test.com` already exists it does nothing.

> These are demonstration credentials for local evaluation only. Change the password from **Change Password** in the dashboard before deploying, and never reuse a real password.

## Backend Dependency

The frontend depends on the backend API and provides no mock data. Start the backend, connect it to MySQL, and set `NEXT_PUBLIC_API_URL` before using any page that loads data. If the backend is not running, the blog list, login, profile, and admin pages cannot load.

## Application Routes

| Route | Access | Purpose |
|---|---|---|
| `/` | Public | Homepage with blog cards, search, and category filter |
| `/blogs/[id]` | Public | Blog details, with a "Blog Not Found" page for unknown ids |
| `/register` | Public | User registration |
| `/login` | Public | Login |
| `/forgot-password` | Public | Request a password-reset email |
| `/reset-password/[token]` | Public | Set a new password, then return to login |
| `/dashboard` | User/Admin | Dashboard overview |
| `/dashboard/blogs` | User/Admin | Own blogs (user) or all blogs (admin) |
| `/dashboard/blogs/create` | User/Admin | Create a blog |
| `/dashboard/blogs/[id]/edit` | User/Admin | Edit a blog you are allowed to edit |
| `/dashboard/profile` | User/Admin | View and update profile, upload avatar |
| `/dashboard/change-password` | User/Admin | Change password |
| `/admin/users` | Admin | View users and activate or deactivate them |
| `/admin/users/[id]` | Admin | View one user's details |

Unauthenticated visitors to a protected route are sent to `/login`. A normal user opening an admin route is redirected to `/dashboard`, and the backend rejects the underlying API calls with `403` regardless.

## REST API Overview

Every response uses the same envelope:

```json
{ "success": true, "message": "...", "data": {} }
```

Protected requests send:

```http
Authorization: Bearer <token>
```

### Authentication

| Method | Endpoint | Purpose |
|---|---|---|
| `POST` | `/api/auth/register` | Register a user |
| `POST` | `/api/auth/login` | Log in and receive a JWT |
| `POST` | `/api/auth/forgot-password` | Email a password-reset link |
| `PATCH` | `/api/auth/reset-password/:token` | Reset the password with a valid token |

### Profile and users

| Method | Endpoint | Access | Purpose |
|---|---|---|---|
| `GET` | `/api/users/profile` | User/Admin | Get the current profile |
| `PUT` | `/api/users/profile/update` | User/Admin | Update first and last name |
| `PATCH` | `/api/users/profile/image` | User/Admin | Upload a profile image (`multipart/form-data`, field `image`) |
| `PATCH` | `/api/users/password` | User/Admin | Change the current password |
| `GET` | `/api/users` | Admin | List all users |
| `GET` | `/api/users/:id` | Admin | Get one user's details |
| `PATCH` | `/api/users/:id/status` | Admin | Activate or deactivate a user |

### Blogs

| Method | Endpoint | Access | Purpose |
|---|---|---|---|
| `GET` | `/api/blogs` | Public | List, search, and filter blogs |
| `GET` | `/api/blogs/:id` | Public | Get blog details |
| `POST` | `/api/blogs/create` | User/Admin | Create a blog |
| `PUT` | `/api/blogs/update/:id` | Owner/Admin | Update a blog |
| `DELETE` | `/api/blogs/delete/:id` | Owner/Admin | Delete a blog |

Blog payload:

```json
{
  "blogTitle": "Introduction to Playwright",
  "blog": "Playwright is a modern browser automation framework...",
  "category": "Automation"
}
```

Valid categories: `Testing`, `Automation`, `Programming`, `DevOps`, `AI`.

`GET /api/blogs` accepts these optional query parameters, which can be combined:

| Parameter | Effect |
|---|---|
| `title` | Blogs whose title contains the text |
| `category` | Only that category (`All` or no value returns every category) |
| `authorId` | Only blogs written by that user (used by **My Blogs**) |

Combined search example:

```http
GET /api/blogs?title=playwright&category=Testing
```

## Screenshots

### Guest Dashboard
<img width="1900" height="793" alt="guest_page" src="https://github.com/user-attachments/assets/c4d80aa5-f493-4966-94d2-eb86800877dd" />

### Blog details

![Blog details page](screenshots/blog-details.png)

### Register and login

![Register page](screenshots/register.png)

![Login page](screenshots/login.png)

### User dashboard

![User dashboard](screenshots/dashboard.png)

### My Blogs

![My Blogs table with edit and delete actions](screenshots/my-blogs.png)

### Create Blog

![Create blog form](screenshots/create-blog.png)

### Profile and avatar

![Profile page with avatar upload](screenshots/profile.png)

### Change Password

![Change password form](screenshots/change-password.png)

### Admin user management

![Admin users table](screenshots/admin-users.png)

### Mobile sidebar drawer

![Mobile layout with the sidebar drawer open](screenshots/mobile-drawer.png)

## Available Scripts

Backend:

```bash
npm run dev    # Start with nodemon (auto-restart)
npm start      # Start with Node.js
npm run seed   # Create the demo admin account
```

Frontend:

```bash
npm run dev    # Start the Next.js development server
npm run build  # Create a production build
npm start      # Run the production build
npm run lint   # Run ESLint
```
