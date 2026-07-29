# Vattal Enquiry Management

A simple enquiry management system built for Vattal Studios.

The application has two sides:

- A public enquiry form where clients can submit their project requirements.
- An admin dashboard where the submitted enquiries can be viewed and managed.

I built the frontend using React and the backend using FastAPI with PostgreSQL as the database.

## Tech Used

**Frontend**
- React
- Vite
- Tailwind CSS
- Axios

**Backend**
- FastAPI
- Python
- SQLAlchemy
- Pydantic
- Alembic

**Database**
- PostgreSQL

**Other**
- JWT authentication
- SlowAPI for rate limiting
- Locust for load testing
- Docker

## Main Features

### Enquiry Form

Clients can submit an enquiry with their contact and project details.

The form includes validation for the required fields and also supports file attachments.

Allowed attachment types:

- PDF
- JPG
- PNG

Files are checked on the backend for type, size and actual file signature before they are stored.

### Admin

The admin side is protected using JWT authentication.

After login, the admin can:

- View enquiries
- Search enquiries
- Filter by status
- Open an enquiry to see full details
- Change enquiry status
- Download attachments
- View the status change history

The available statuses are:

```text
NEW
CONTACTED
IN_PROGRESS
COMPLETED
REJECTED
```

## Project Structure

```text
vattal-enquiry-management/

backend/
  app/
    core/
    db/
    dependencies/
    models/
    routers/
    schemas/
    services/
    utils/
    main.py

  alembic/
  Dockerfile
  requirements.txt

frontend/

load-tests/
  locustfile.py

README.md
```

I kept the backend separated into routers, schemas, models and services instead of keeping all the logic inside the API routes.

## Running the Backend

Go to the backend folder:

```bash
cd backend
```

Create and activate a virtual environment.

Install the dependencies:

```bash
pip install -r requirements.txt
```

Create a `.env` file with the required configuration.

Example:

```env
DATABASE_URL=postgresql+psycopg2://username:password@localhost:5432/database_name
JWT_SECRET=your-secret-key
JWT_ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=60
ALLOWED_ORIGINS=http://localhost:5173
MAX_UPLOAD_SIZE_MB=5
```

Run the database migrations:

```bash
alembic upgrade head
```

Start the backend:

```bash
uvicorn app.main:app --reload --port 8001
```

The API will be available at:

```text
http://127.0.0.1:8001
```

Swagger documentation:

```text
http://127.0.0.1:8001/docs
```

Health check:

```text
GET /health
```

## Running the Frontend

Go to the frontend folder:

```bash
cd frontend
```

Install the packages:

```bash
npm install
```

Start the application:

```bash
npm run dev
```

## API

Main endpoints used in the project:

```text
POST   /api/v1/enquiries
POST   /api/v1/auth/login

GET    /api/v1/admin/me
GET    /api/v1/admin/enquiries
GET    /api/v1/admin/enquiries/{id}
PATCH  /api/v1/admin/enquiries/{id}/status
GET    /api/v1/admin/enquiries/{id}/attachment
```

Admin endpoints require a valid bearer token.

## Security

A few security measures I added while building the project:

- Password hashing
- JWT authentication
- Token expiration
- Protected admin APIs
- Request validation
- Restricted CORS origins
- Rate limiting
- File type and size validation
- File signature checking
- Protected attachment downloads
- Security headers
- Environment variables for secrets

The login endpoint is limited to 5 requests per minute and the public enquiry endpoint is limited to 10 requests per minute per IP.

## Database

PostgreSQL is used for storing admins, enquiries and audit logs.

Alembic is used for database migrations.

I also added indexes for fields that are commonly used while retrieving enquiries.

For example, enquiries have a composite index on:

```text
status + created_at
```

I checked the query using PostgreSQL `EXPLAIN ANALYZE`, and PostgreSQL used the index when filtering enquiries by status and ordering them by creation date.

## Load Testing

I used Locust to do a basic load test on the enquiry API.

One of the baseline tests gave:

```text
Requests: 9
Failures: 0
Average response time: 36.66 ms
Median: 36 ms
95th percentile: 65 ms
99th percentile: 65 ms
```

The enquiry API also has rate limiting, so requests above the configured limit return `429 Too Many Requests`.

## Docker

The backend can also be built using Docker.

Build the image:

```bash
docker build -t vattal-backend .
```

Run the container with the environment file:

```bash
docker run --name vattal-backend-container -p 8002:8001 --env-file .env vattal-backend
```

The application health endpoint can then be checked at:

```text
http://localhost:8002/health
```

## Notes

This project mainly focuses on building a clean enquiry workflow while keeping the backend secure and maintainable.

The database schema is managed through migrations, admin actions are protected, status changes are recorded in audit logs, and the application includes basic performance and deployment testing.