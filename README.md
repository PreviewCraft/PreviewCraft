# PreviewCraft

PreviewCraft is a full-stack web application featuring a Node.js backend and a Vite-based frontend. The entire application is containerized using Docker for streamlined development and deployment.

## Project Structure

The repository is divided into two main workspaces:
*   **`PreviewCraft-Backend/`**: Node.js API server handling database connections, authentication (JWT), media uploads (Cloudinary), and email services (Resend).
*   **`PreviewCraft-Frontend/`**: A Vite-powered frontend application, served in production via Nginx.

## Prerequisites

To run this project, you only need to have the following installed on your machine:
*   [Docker Desktop](https://www.docker.com/products/docker-desktop/) (This includes both Docker Engine and Docker Compose)

## Environment Variables

Both the backend and frontend directories contain a `.env.sample` file. You must create `.env` files in both directories before starting the containers.

**Backend (`PreviewCraft-Backend/.env`) requires:**
*   `PORT` (Default: 5000)
*   `MONGODB_URI`
*   `CORS_ORIGIN` (Set to `http://localhost:8082` for Docker environment)
*   `ACCESS_TOKEN_SECRET` 
*   `ACCESS_TOKEN_EXPIRY`
*   `REFRESH_TOKEN_SECRET` 
*   `REFRESH_TOKEN_EXPIRY`
*   `CLOUDINARY_API_KEY` 
*   `CLOUDINARY_API_SECRET` 
*   `CLOUDINARY_CLOUD_NAME`
*   `RESEND_API_KEY`
*   `EMAIL_USER` 
*   `EMAIL_PASS` 
(Ensure passwords with spaces are enclosed in quotes)

*Note: Never commit your actual `.env` files to version control.*

## Running the Application

The project uses Docker Compose to orchestrate both the frontend and backend services simultaneously.

1. Open your terminal in the root directory.
2. Build and start the containers by running:
   ```bash
   docker-compose up --build
   ```
3. To stop the containers, press Ctrl+C in the terminal, or run:

    ```Bash
    docker-compose down
    ```

## Services and Ports
Once the containers are running, the services will be accessible at the following local URLs:

*  Frontend UI: http://localhost:8082
*  Backend API: http://localhost:5000