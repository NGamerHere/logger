

# Express.js Authentication App

This is a simple Express.js application for user authentication with session management. It allows users to register, login, and logout.

## Features

- **User Registration:** Users can register with their name, email, and password.
- **User Login:** Registered users can login using their email and password.
- **Session Management:** User sessions are managed using the `express-session` middleware.
- **Password Hashing:** User passwords are hashed using bcrypt before being stored in the database.
- **Middleware:** Includes custom middleware for IP logging and requiring login for accessing certain routes.

## Prerequisites

Before running this application, make sure you have the following installed:

- Node.js
- MongoDB (running locally or accessible via URI)

## Installation

1. Clone the repository:

    ```bash
    git clone <repository_url>
    ```

2. Install dependencies:

    ```bash
    npm install
    ```

3. Configure MongoDB:

    Update the MongoDB connection URI in the `DBConnector` function call in `connections.js` to connect to your MongoDB database.

## Usage

1. Start the server:

    ```bash
    npm start
    ```

2. Access the application:

    Open your web browser and navigate to `http://localhost:3000`.

3. Use the application:

    - Register: Click on the "Register" link to create a new account.
    - Login: After registration, login with your email and password.
    - Dashboard: Once logged in, you will be redirected to the dashboard where you can see your name.

4. Logout:

    To logout, click on the "Logout" link.

## Folder Structure

- `connections.js`: Contains MongoDB connection setup.
- `models/model.js`: Defines the User model schema.
- `middleWares/Iplogger.js`: Middleware for logging IP addresses.
- `middleWares/requireLogin.js`: Middleware for requiring login to access certain routes.
- `public`: Contains static files (e.g., CSS, images).
- `views`: Contains EJS templates for rendering HTML views.
- `app.js`: Main entry point of the application.

## Contributing

Contributions are welcome! If you have any ideas, suggestions, or bug fixes, feel free to open an issue or submit a pull request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---



