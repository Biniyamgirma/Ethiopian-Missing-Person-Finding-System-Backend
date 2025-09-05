# Ethiopian Missing Person Finding System - Backend

This is the backend server for the Ethiopian Missing Person Finding System, a platform designed to help locate missing individuals in Ethiopia. It provides a robust RESTful API for the frontend application to interact with, managing all data, business logic, and user authentication.

The corresponding frontend for this application is hosted at: [https://ethiopian-missing-person-sys.web.app/](https://ethiopian-missing-person-sys.web.app/)

## 📝 Overview

The system facilitates reporting missing persons, managing cases, handling criminal records related to such cases, and enabling communication between different user roles within the system. It's built with Node.js and Express, providing a scalable foundation for the application's data and logic.

## ✨ Features

*   **RESTful API:** A well-structured API for all application functionalities.
*   **User Authentication:** Secure login system for different user types.
*   **Role-Based Access Control:** Differentiated permissions for Root Admins, Police Admins, and other users.
*   **Case Management:** Create, read, update, and delete posts about missing persons.
*   **Criminal Records:** Manage a database of criminals linked to cases.
*   **Reporting System:** Functionality for users to submit reports.
*   **Internal Messaging:** A system for users to communicate securely within the platform.
*   **Notifications:** A system to notify users of important events.
*   **Static File Serving:** Handles image uploads for missing person profiles and evidence via the `/uploads` directory.

## 🛠️ Tech Stack

*   **Backend:** Node.js, Express.js
*   **Middleware:**
    *   `cors` for handling Cross-Origin Resource Sharing.
    *   `dotenv` for managing environment variables.
    *   `express.json` & `express.urlencoded` for parsing request bodies.
*   **Database:** Requires a database connection (`sqlitecloud`). The connection string must be configured in the environment variables.

## 🚀 Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

*   Node.js (v14 or newer recommended)
*   npm (comes with Node.js)
*   A database instance (e.g., a local or cloud-hosted MongoDB instance)

### Installation

1.  **Clone the repository:**
    ```sh
    git clone https://github.com/Biniyamgirma/Ethiopian-Missing-Person-Finding-System-Backend.git
    cd Ethiopian-Missing-Person-Finding-System-Backend
    ```

2.  **Install dependencies:**
    ```sh
    npm install
    ```

3.  **Set up environment variables:**
    Create a `.env` file in the root of the project. This file will hold your secret keys and configuration variables.

    **.env.example**
    ```env
    # Port for the server to run on
    PORT=3004

    # Your Sqlite cloud connection string
   

    # JWT Secret for signing authentication tokens
  
    ```

4.  **Run the server:**
    ```sh
    npm start
    ```
    The server should now be running on the port you specified in your `.env` file (e.g., `http://localhost:3004`).

## API Endpoints

The API provides several endpoints to manage the application's resources. All routes are prefixed with `/api`.

*   `GET /`: A simple health-check endpoint to confirm the server is running.
*   `/api/police/login`: Handles authentication for police users.
*   `/api/admin`: Routes for Police Station Admins.
*   `/api/police/root`: Routes for Root System Admins.
*   `/api/post`: Routes for managing missing person posts.
*   `/api/report`: Routes for handling user-submitted reports.
*   `/api/message`: Routes for the internal messaging system.
*   `/api/setting`: Routes for system settings.
*   `/api/criminals`: Routes for managing criminal records.
*   `/api/notification`: Routes for user notifications.
*   `/api/country`: Routes for country-specific data.
*   `/api/test`: Routes for development and testing purposes.

Access to these endpoints is protected and requires appropriate authentication and authorization.

## 🤝 Contributing

Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1.  Fork the Project.
2.  Create your Feature Branch (`git checkout -b feature/AmazingFeature`).
3.  Commit your Changes (`git commit -m 'Add some AmazingFeature'`).
4.  Push to the Branch (`git push origin feature/AmazingFeature`).
5.  Open a Pull Request.

## 📄 License

Distributed under the MIT License. You should add a `LICENSE` file to the repository for details.

