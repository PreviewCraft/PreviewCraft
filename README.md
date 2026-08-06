# PreviewCraft

**An AI-powered, self-hosted deployment platform that automatically builds, deploys, and serves preview environments for every GitHub push.**

PreviewCraft is a full-stack web application — a Node.js backend paired with a Vite-powered frontend — that gives teams their own Vercel/Netlify-style preview deployment pipeline, running entirely on infrastructure they control. The whole stack is containerized with Docker for fast local setup and consistent production deployment.

---

##  Features

- **Automatic preview builds** — every push to a connected GitHub repository triggers a build and deploy of a live preview environment.
- **AI-assisted workflow** — smart handling of build/deploy steps to reduce manual configuration.
- **Self-hosted** — run it on your own servers, full control over data and infrastructure.
- **Authentication** — secure JWT-based auth out of the box.
- **Media handling** — image and asset uploads via Cloudinary.
- **Transactional email** — built-in email delivery via Resend.
- **Dockerized** — one command spins up the entire stack.

---

##  Project Structure

The repository is organized as two workspaces:

```
PreviewCraft/
├── PreviewCraft-Backend/     # Node.js API server
├── PreviewCraft-Frontend/    # Vite-powered frontend
└── docker-compose.yml
```

| Workspace | Description |
|---|---|
| **`PreviewCraft-Backend/`** | Node.js API server handling database connections, authentication (JWT), media uploads (Cloudinary), and email services (Resend). |
| **`PreviewCraft-Frontend/`** | A Vite-powered frontend application, served in production via Nginx. |

---

##  Prerequisites

You only need one thing installed locally:

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) — includes both Docker Engine and Docker Compose.

---

##  Environment Variables

Both the `PreviewCraft-Backend/` and `PreviewCraft-Frontend/` directories include a `.env.sample` file. Copy each to `.env` in its respective directory and fill in the values before starting the containers.

**`PreviewCraft-Backend/.env`**

| Variable | Description |
|---|---|
| `PORT` | Server port (default: `8000`) |
| `MONGODB_URI` | MongoDB connection string |
| `CORS_ORIGIN` | Allowed origin — use `http://localhost:8082` for the Docker setup, or `http://localhost:5173` if running the frontend separately with Vite's dev server |
| `ACCESS_TOKEN_SECRET` | Secret used to sign access tokens |
| `ACCESS_TOKEN_EXPIRY` | Access token lifetime |
| `REFRESH_TOKEN_SECRET` | Secret used to sign refresh tokens |
| `REFRESH_TOKEN_EXPIRY` | Refresh token lifetime |
| `CLOUDINARY_API_KEY` | Cloudinary API key |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name |
| `RESEND_API_KEY` | Resend API key for transactional email |
| `EMAIL_USER` | Sender email address |
| `EMAIL_PASS` | Email account password (wrap in quotes if it contains spaces) |

>  **Never commit your actual `.env` files to version control.**

---

##  Running the Application

You can either run the full stack together with Docker Compose, or run the frontend and backend separately if you're actively developing one of them.

### Option A: Full stack with Docker (recommended for just running the app)

1. Open a terminal in the repository root.
2. Build and start the containers:

   ```bash
   docker-compose up --build
   ```

3. Stop the containers when you're done:

   ```bash
   docker-compose down
   ```

   (or press `Ctrl+C` in the terminal running the containers)

### Option B: Run frontend and backend separately (recommended for active development)

Running the two workspaces independently gives you hot-reload on both sides without rebuilding containers on every change.

**Backend** (runs on port `8000`):

```bash
cd PreviewCraft-Backend
npm install
npm run dev
```

The API will be available at `http://localhost:8000`.

**Frontend** (runs on Vite's default dev port):

```bash
cd PreviewCraft-Frontend
npm install
npm run dev
```

The frontend dev server will be available at `http://localhost:5173` (Vite's default — check your terminal output in case it differs).

> When running the frontend separately, make sure its API base URL / `.env` config points to `http://localhost:8000`, and that the backend's `CORS_ORIGIN` is set to match the frontend's dev URL.

---

##  Services and Ports

| Service | Docker (`docker-compose up`) | Local dev (run separately) |
|---|---|---|
| Frontend UI | [http://localhost:8082](http://localhost:8082) | [http://localhost:5173](http://localhost:5173) |
| Backend API | [http://localhost:8000](http://localhost:8000) | [http://localhost:8000](http://localhost:8000) |

---

## 🤝 Contributing

Issues and pull requests are welcome. If you're planning a larger change, consider opening an issue first to discuss what you'd like to do.

## 📄 License

Add your license of choice here (e.g. MIT) so others know how they can use this project.
