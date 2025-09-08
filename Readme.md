# 📸 PhotoShare App

Welcome to **PhotoShare**, a full-stack web application designed for sharing your favorite moments through images. This project demonstrates robust user management, including registration, login, secure authentication, role-based access control, and efficient file uploads. Built with Node.js, Express, and MongoDB, PhotoShare provides a solid foundation for understanding modern web application development.

## ✨ Features

- **User Registration**: Allow new users to create an account with a unique username and password.
- **User Login**: Authenticate existing users and issue JSON Web Tokens (JWT) for secure session management.
- **Authentication**: Implement JWT-based authentication to protect routes and ensure only authorized users can access specific functionalities.
- **Permission-wise Access (Role-Based Access Control - RBAC)**:
  - **User Role**: Create, read, update, and delete their own photos.
  - **Admin Role**: Manage all user accounts and photos.
- **File Uploads**: Users can upload single or multiple images for their posts. Images are stored securely on the server (or a cloud storage solution).
- **Photo Management**: Users can view, update, and delete their uploaded photos.
- **Profile Management**: Users can view and potentially update their profile information.

## 🚀 Technologies Used

**Backend:**

- **Node.js**: A JavaScript runtime built on Chrome's V8 JavaScript engine.
- **Express.js**: A fast, unopinionated, minimalist web framework for Node.js.
- **MongoDB**: A NoSQL document database for flexible data storage.
- **Mongoose**: An ODM (Object Data Modeling) library for MongoDB and Node.js, simplifying data interactions.
- **JSON Web Tokens (JWT)**: For stateless user authentication.
- **Bcrypt.js**: For hashing passwords securely.
- **Multer**: Middleware for handling `multipart/form-data`, primarily used for file uploads.

## 🔧 Setup & Installation

Follow these steps to get PhotoShare up and running on your local machine.

### Prerequisites

- Node.js v24.6.0
- MongoDB v8.0.10 (Community Edition or MongoDB Atlas account)
- Git

### Steps

1.  **Clone the Repository**:

    ```bash
    git clone https://github.com/roydebasis/photo-share.git
    cd photo-share
    ```

2.  **Install Dependencies**:

    ```bash
    npm install
    ```

3.  **Environment Variables**:
    Create a `.env` file in the root directory of the project.

    ```
    cp .env.example .env
    ```

    Add the following environment variables:

    ```
    APP_NAME=application_name
    COOKIE_NAME=name_for_cookie
    COOKIE_SECRET=a_strong_secret_key_for_cookie
    COOKIE_EXPIRY=cookie_expiry_time_in_milliseconds
    JWT_SECRET=a_strong_secret_key_for_jwt
    JWT_EXPIRY=jwt_expiry_time_in_milliseconds
    MONGO_URI=mongodb://127.0.0.1:27017/photoshares
    PORT=3000
    UPLOAD_FOLDER=uploads
    ```

    - Replace `application_name` with your prefered name.
    - Replace `name_for_cookie` with your prefered cookie name.
    - Replace `a_strong_secret_key_for_cookie` with a long, random string. You can generate one online.
    - Replace `cookie_expiry_time_in_milliseconds` with miliseconds.
    - Replace `a_strong_secret_key_for_jwt` with a long, random string. You can generate one online.
    - Replace `jwt_expiry_time_in_milliseconds` with miliseconds.
    - Replace `your_mongodb_connection_string` with your MongoDB URI (e.g., `mongodb://localhost:27017/photoshares` or your MongoDB Atlas connection string).
    - Replace `PORT` or keep the default one.
    - `UPLOAD_FOLDER` is the directory where uploaded files will be stored.

4.  **Create Uploads Directory**:
    Ensure you have an `uploads` directory (or whatever you named `UPLOAD_FOLDER` in your `.env`) in your project root.

5.  **Start the Server**:
    ```bash
    npm start
    ```
    The server will typically run on `http://localhost:5000` (or the `PORT` you specified).

## 💡 Usage

You can interact with the API using a tool like [Postman](https://www.postman.com/) or [Insomnia](https://insomnia.rest/).

### API Endpoints

Here are some of the main API endpoints:

**Authentication & Users:**

- `POST /api/auth/register`: Register a new user.
  - Body: `{ "username": "...", "email": "...", "password": "..." }`
- `POST /api/auth/login`: Log in a user.
  - Body: `{ "email": "...", "password": "..." }`
  - Returns: `{ "token": "..." }`
- `GET /api/users/me`: Get current user's profile (requires JWT).
- `GET /api/users`: Get all users (admin only, requires JWT with admin role).

**Photos:**

- `POST /api/photos/upload`: Upload a new photo.
  - `Content-Type: multipart/form-data`
  - Form field: `photo` (for the image file), `description` (text field)
  - Requires JWT.
- `GET /api/photos`: Get all photos (public or user-specific depending on implementation).
- `GET /api/photos/:id`: Get a single photo by ID.
- `PUT /api/photos/:id`: Update a photo (requires JWT, user can only update their own).
- `DELETE /api/photos/:id`: Delete a photo (requires JWT, user can only delete their own, admin can delete any).

## 🔒 Authentication & Authorization

This application uses **JWT (JSON Web Tokens)** for authentication.

1.  Upon successful login, a JWT is issued to the client.
2.  This token must be included in the `Authorization` header as a Bearer token for all protected routes (e.g., `Authorization: Bearer <your_token>`).
3.  **Role-Based Access Control (RBAC)** is implemented to define permissions. Users are assigned roles (e.g., `user`, `admin`), and middleware checks these roles to grant or deny access to specific routes or actions. For instance, only users with the `admin` role can access the `/api/users` endpoint to view all users.

## 📁 File Uploads

File uploads are handled using **Multer**.

1.  When a user uploads a file, Multer processes the `multipart/form-data` request.
2.  The uploaded files are saved to the `uploads` directory on the server (configured via `UPLOAD_FOLDER` in `.env`).
3.  The file path/URL is then stored in the MongoDB database along with other photo metadata. This allows the application to serve the images to clients.

## 👋 Contributing

Contributions are welcome! If you have suggestions or want to improve the project, feel free to:

1.  Fork the repository.
2.  Create a new branch (`git checkout -b feature/your-feature`).
3.  Make your changes.
4.  Commit your changes (`git commit -am 'Add new feature'`).
5.  Push to the branch (`git push origin feature/your-feature`).
6.  Create a new Pull Request.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
