# Assignment 2: Blog Management Application with Next.js

## Objective

Develop a complete frontend **Blog Management Application** using **Next.js** (App Router).

The application must consume the provided **Blog REST API** and support three types of visitors:

- **Guest**
- **User**
- **Admin**

The frontend must implement a realistic blog website where users can:

- Browse blogs
- Search blogs
- Filter blogs by category
- Register
- Login
- Reset forgotten passwords
- Manage their profile
- Upload a profile image
- Change password
- Create blogs
- Update blogs
- Delete blogs

Administrators must additionally be able to manage users and any user's blogs.

---

## 1. Important Rule

The frontend must use the backend APIs provided in the Blog REST API assignment.

**Students must NOT:**
- Create fake blog data
- Hardcode users
- Hardcode blog lists
- Access the database directly
- Implement frontend-only authentication
- Use mock APIs instead of the provided backend

All application data must come from the REST API.

---

## 2. Application Layout

The application should contain two main layouts.

### Public Layout
Used by guests. Contains:
- Navbar
- Main Content
- Footer

### Dashboard Layout
Used by authenticated users. Contains:
- Fixed Navbar
- Sidebar
- Main Content

Example:
```
| Logo                    Search              Avatar ▼ |
|--------------------------------------------------------|
| Dashboard    |                                         |
| My Blogs     |                                         |
| Create Blog  |            Main Content                 |
| Profile      |                                         |
| Change Pass. |                                         |
| Logout       |                                         |
```

---

## 3. Navbar

Create a fixed Navbar. It should contain:
- Application logo/name
- Blog search
- Login/Register buttons for guests
- User profile image for authenticated users
- User name
- Logout option

Example authenticated navbar:
```
BlogSpace          Search Blogs...          [Avatar] John Doe
```

The user avatar must come from:
```
GET /api/users/profile
```
If the user does not have an uploaded profile image, display a default avatar.

---

## 4. Sidebar

Authenticated users should have a Sidebar.

**Normal User:**
- Dashboard
- My Blogs
- Create Blog
- Profile
- Change Password
- Logout

**Admin:**
- Dashboard
- All Blogs
- Create Blog
- Users
- Profile
- Change Password
- Logout

- The active menu should be visually identifiable.
- The Sidebar should be responsive for smaller screens.

---

## 5. Guest Use Case — Homepage

Create a homepage at `/`.

Guests should see:
- Navbar
- Blog cards
- Blog title
- Category
- Short blog preview
- Author information
- Author image if available
- Created date
- Read More button
- Search box
- Category filter

Data must come from:
```
GET /api/blogs
```

---

## 6. Blog Search

Provide a search input.

Example: searching `playwright` calls:
```
GET /api/blogs?title=playwright
```
The result should update the blog list.

---

## 7. Category Filter

Provide a category filter.

Example categories: `All`, `Testing`, `Automation`, `Programming`, `DevOps`, `AI`

Selecting `Testing` should call:
```
GET /api/blogs?category=Testing
```

---

## 8. Search + Category

Users should be able to combine both.

Example: Search `playwright` + Category `Testing`:
```
GET /api/blogs?title=playwright&category=Testing
```

---

## 9. Blog Details Page

Create: `/blogs/[id]`

Call:
```
GET /api/blogs/:id
```

Display:
- Blog title
- Blog content
- Category
- Author name
- Author profile image
- Created date

If the blog does not exist, show an appropriate "Blog Not Found" page/message.

---

## 10. Registration Page

Create: `/register`

Form fields:
- First Name
- Last Name
- Email
- Password
- Confirm Password
- Register (submit)

Call:
```
POST /api/auth/register
```

Frontend validation should include:
- Required fields
- Valid email
- Password minimum length
- Password confirmation

After successful registration, redirect the user to Login.

---

## 11. Login Page

Create: `/login`

Fields:
- Email
- Password
- Login (submit)
- Forgot Password? (link)

Call:
```
POST /api/auth/login
```

After successful login:
1. Store the authentication token.
2. Load the user's profile.
3. Redirect to the dashboard.

All protected API requests must send:
```
Authorization: Bearer <token>
```

---

## 12. Authentication State

The application must maintain authentication state.

The frontend should know:
- Is the user authenticated?
- Who is logged in?
- What is their role?
- What is their profile image?

After page refresh, the login state should remain available if the authentication token is still valid.

---

## 13. Protected Routes

The following pages require authentication:
- `/dashboard`
- `/dashboard/blogs`
- `/dashboard/blogs/create`
- `/dashboard/blogs/[id]/edit`
- `/dashboard/profile`
- `/dashboard/change-password`

Unauthenticated users attempting to access these pages should be redirected to `/login`.

---

## 14. Role-Based Routes

Admin-only pages must not be accessible to normal users.

Example: `/admin/users`

If a normal user tries to access an admin route: show "Access Denied" or redirect them to the dashboard.

- Do not rely only on hiding the menu.
- The backend authorization response must also be respected.

---

## 15. Dashboard

Create: `/dashboard`

Show useful information such as:
- Welcome, John
- Total Blogs
- Profile Information
- Quick Create Blog button
- Recent Blogs

This page should be populated using available backend information.

---

## 16. Create Blog Use Case

Create: `/dashboard/blogs/create`

Form:
- Blog Title
- Category
- Blog Content
- Publish Blog (submit)

Example payload:
```json
{
  "blogTitle": "Introduction to Playwright",
  "blog": "Playwright is a modern browser automation framework...",
  "category": "Automation"
}
```

Call:
```
POST /api/blogs/create
```

The frontend must NOT send `userId`. The backend determines the user from the authentication token.

---

## 17. Blog Management

Create: `/dashboard/blogs`

Display blogs in either Cards or Table.

Recommended table columns: `Title | Category | Author | Created | Actions`

Example row: `Playwright Basics | Testing | John | Sep 2 | Edit / Delete`

---

## 18. Update Blog

Clicking Edit should navigate to: `/dashboard/blogs/[id]/edit`

Initially load the blog using:
```
GET /api/blogs/:id
```
Display existing values inside the form.

When submitted, call:
```
PUT /api/blogs/update/:id
```

- Normal users can update only blogs they own.
- Admins can update any blog.

---

## 19. Delete Blog

Provide a Delete button.

Before deletion, show confirmation: **"Are you sure you want to delete this blog?"**

If confirmed, call:
```
DELETE /api/blogs/delete/:id
```

After successful deletion:
- Show success feedback
- Refresh the blog list

- Normal users can delete only their own blogs.
- Admins can delete any blog.

---

## 20. Profile Page

Create: `/dashboard/profile`

Call:
```
GET /api/users/profile
```

Display:
- Profile Image
- First Name
- Last Name
- Email
- Role

Email may be displayed as read-only if the backend does not support changing it.

---

## 21. Edit Profile

On the same page or a separate section, allow the user to update:
- First Name
- Last Name

Call:
```
PUT /api/users/profile/update
```

Users must not be given frontend controls for changing: `role`, `isActive`

---

## 22. Profile Image Upload

The Profile page should contain:
- Current Avatar
- [Choose Image]
- [Upload]

Call:
```
PATCH /api/users/profile/image
```
Use: `multipart/form-data`, field name: `image`

After successful upload:
1. Update the Profile page avatar.
2. Update the fixed Navbar avatar immediately.
3. Do not require the user to logout/login again.

---

## 23. Navbar Profile Component

Create a reusable component similar to: `ProfileMenu`

It should show:
```
[Avatar] John Doe ▼
```

Clicking it may open:
- Profile
- Change Password
- Logout

The profile component should remain available in the fixed Navbar on authenticated pages.

---

## 24. Change Password

Create: `/dashboard/change-password`

Form:
- New Password
- Confirm New Password
- Change Password (submit)

Call:
```
PATCH /api/users/password
```

Payload:
```json
{
  "password": "newPassword123"
}
```

Validate password confirmation before calling the API.

---

## 25. Forgot Password

On the Login page provide: "Forgot Password?"

Clicking it should open: `/forgot-password`

Form:
- Email
- Send Reset Link (submit)

Call:
```
POST /api/auth/forgot-password
```

Payload:
```json
{
  "email": "john@example.com"
}
```

Display an appropriate success message.

---

## 26. Reset Password

The password-reset email will contain a URL such as:
```
http://localhost:3000/reset-password/<token>
```

Create: `/reset-password/[token]`

Form:
- New Password
- Confirm Password
- Reset Password (submit)

Call:
```
PATCH /api/auth/reset-password/:token
```

Payload:
```json
{
  "password": "newPassword123"
}
```

After successful password reset: show "Password successfully changed." and redirect the user to Login.

---

## 27. Admin — User Management

Admins should see "Users" inside the Sidebar.

Create: `/admin/users`

Call:
```
GET /api/users
```

Example table: `User | Email | Role | Status | Action`

Example rows:
- John Doe | john@example.com | User | Active | Deactivate
- Sarah Khan | sarah@example.com | User | Inactive | Activate

---

## 28. View User Information

Admin should be able to view additional information about a user.

Call:
```
GET /api/users/:id
```

Display:
- Name
- Email
- Role
- Status
- Profile Image
- Created Date

---

## 29. Activate/Deactivate User

Admin can change user status.

Call:
```
PATCH /api/users/:id/status
```

Deactivate:
```json
{ "isActive": false }
```

Activate:
```json
{ "isActive": true }
```

Update the UI immediately after a successful request.

---

## 30. Logout

Provide Logout inside:
- Navbar Profile Menu
- Sidebar

On logout:
1. Remove authentication information.
2. Clear user state.
3. Redirect to `/login`.

The user must no longer be able to visit protected pages.

---

## 31. Error Handling

The application must properly display backend errors.

Examples:
- "Invalid email or password."
- "Your account has been deactivated."
- "Blog not found."
- "You are not authorized to update this blog."
- "Email already exists."

Do not display raw JavaScript errors to users.

---

## 32. Loading State

API requests should provide visual feedback.

Examples: "Loading blogs..." or loading skeletons/spinners.

Buttons should also indicate pending state. Example: "Publishing..."

The button should not allow accidental duplicate submissions.

---

## 33. Empty States

Handle situations where no data exists.

Examples:
- "No blogs found."
- "You haven't created any blogs yet."
- "No users found."

---

## 34. Responsive Design

The application should work on:
- Desktop
- Tablet
- Mobile

On mobile:
- Sidebar may become a drawer
- Navbar should remain usable
- Blog cards should stack vertically
- Forms should fit within the viewport

---

## 35. Suggested Next.js Structure

Using App Router:

```
app/
├── page.jsx
├── login/
│   └── page.jsx
├── register/
│   └── page.jsx
├── forgot-password/
│   └── page.jsx
├── reset-password/
│   └── [token]/
│       └── page.jsx
├── blogs/
│   └── [id]/
│       └── page.jsx
├── dashboard/
│   ├── layout.jsx
│   ├── page.jsx
│   ├── blogs/
│   │   ├── page.jsx
│   │   ├── create/
│   │   │   └── page.jsx
│   │   └── [id]/
│   │       └── edit/
│   │           └── page.jsx
│   ├── profile/
│   │   └── page.jsx
│   └── change-password/
│       └── page.jsx
└── admin/
    └── users/
        └── page.jsx

components/
├── Navbar.jsx
├── Sidebar.jsx
├── ProfileMenu.jsx
├── BlogCard.jsx
├── BlogForm.jsx
├── SearchBar.jsx
├── CategoryFilter.jsx
├── Loader.jsx
└── ConfirmDialog.jsx

services/
├── auth.service.js
├── user.service.js
└── blog.service.js

contexts/
└── AuthContext.jsx

utils/
├── api.js
└── auth.js
```

Students may improve the architecture as long as responsibilities remain properly separated.

---

## 36. API Integration

Create a reusable API layer, for example:
```
services/auth.service.js
services/user.service.js
services/blog.service.js
```

Pages/components should not contain repeated API implementation everywhere.

---

## 37. Required Pages

At minimum implement:

| Page | Access |
|---|---|
| `/` | Public |
| `/blogs/[id]` | Public |
| `/login` | Public |
| `/register` | Public |
| `/forgot-password` | Public |
| `/reset-password/[token]` | Public |
| `/dashboard` | User/Admin |
| `/dashboard/blogs` | User/Admin |
| `/dashboard/blogs/create` | User/Admin |
| `/dashboard/blogs/[id]/edit` | User/Admin |
| `/dashboard/profile` | User/Admin |
| `/dashboard/change-password` | User/Admin |
| `/admin/users` | Admin |

---

## 38. Required API Usage

The frontend must integrate all of these APIs:

| Method | Endpoint |
|---|---|
| POST | `/api/auth/register` |
| POST | `/api/auth/login` |
| POST | `/api/auth/forgot-password` |
| PATCH | `/api/auth/reset-password/:token` |
| GET | `/api/users` |
| GET | `/api/users/:id` |
| PATCH | `/api/users/:id/status` |
| GET | `/api/users/profile` |
| PUT | `/api/users/profile/update` |
| PATCH | `/api/users/profile/image` |
| PATCH | `/api/users/password` |
| POST | `/api/blogs/create` |
| GET | `/api/blogs` |
| GET | `/api/blogs/:id` |
| PUT | `/api/blogs/update/:id` |
| DELETE | `/api/blogs/delete/:id` |

---

## 39. Frontend Validation

Implement frontend validation for:
- Required fields
- Email
- Password
- Password confirmation
- Blog title
- Blog content
- Blog category
- Profile image format
- Profile image size

Frontend validation does not replace backend validation. Both must exist.

---

## 40. UI Expectations

The application should look like a real Blog Management Application rather than separate disconnected forms.

Students should focus on:
- Consistent Navbar
- Consistent Sidebar
- Responsive layout
- Reusable components
- Clear typography
- Blog cards
- Proper spacing
- Loading states
- Error states
- Confirmation dialogs
- Success notifications
- Empty states

**Use Tailwind CSS for styling.**

---

## 41. Core User Journey

### Main journey
```
Guest visits website
    ↓
Browse/Search Blogs
    ↓
Open Blog
    ↓
Register
    ↓
Login
    ↓
Dashboard
    ↓
Upload Profile Image
    ↓
Avatar appears in Navbar
    ↓
Create Blog
    ↓
Blog appears on Blog List
    ↓
Edit Blog
    ↓
Delete Blog
    ↓
Update Profile
    ↓
Change Password
    ↓
Logout
```

### Forgotten-password journey
```
Login
  ↓
Forgot Password
  ↓
Enter Email
  ↓
Receive Reset Link
  ↓
Reset Password
  ↓
Login with New Password
```

### Admin journey
```
Admin Login
  ↓
Dashboard
  ↓
View Users
  ↓
View User
  ↓
Deactivate User
  ↓
Manage All Blogs
  ↓
Edit/Delete Any Blog
```

---

## 42. Restrictions

Students must NOT:
- Hardcode API results
- Use static JSON instead of API data
- Allow frontend role modification
- Send `userId` during blog creation
- Allow normal users to see admin menus
- Rely only on frontend authorization
- Store plain-text passwords
- Expose password information
- Ignore backend 401/403 responses

---

## 43. Submission Requirements

Submit:
1. Public GitHub repository
2. Properly structured Next.js project
3. `.gitignore`
4. `.env.example`
5. README
6. Screenshots of major application pages
7. Backend API base URL configuration

Example:
```
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

Do not commit the real `.env`.

---

## 44. README Requirements

README should explain:
- Project overview
- Main features
- Technologies
- Installation
- Environment variables
- How to run the application
- Backend dependency
- Application routes
- User/Admin functionality
- Screenshots

---

## Final Expected Result

The final submission should behave like a small real-world blogging platform.

- A **guest** should be able to discover and read blogs.
- A **registered user** should be able to:
  - Login
  - Manage Profile
  - Upload Avatar
  - Change Password
  - Create Blogs
  - Update Own Blogs
  - Delete Own Blogs
  - Logout
- An **admin** should additionally be able to:
  - Manage Users
  - Activate/Deactivate Users
  - Update Any Blog
  - Delete Any Blog

The frontend must demonstrate proper use of **Next.js, reusable components, API integration, authentication state, protected routes, role-based UI, forms, validation, and responsive application design.**
