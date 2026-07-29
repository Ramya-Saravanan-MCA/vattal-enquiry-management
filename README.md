# Vattal Enquiry Management

A simple enquiry management system built for Vattal Studios.

The application has two sides:

- A public enquiry form where clients can submit their project requirements.
- An admin dashboard where submitted enquiries can be viewed and managed.

I built the frontend using React and Vite, the backend using FastAPI, and PostgreSQL as the database.

## Live Application

**Frontend**

https://vattal-enquiry-management.vercel.app

**Admin Dashboard**

https://vattal-enquiry-management.vercel.app/admin

**Backend API**

https://vattal-enquiry-management.onrender.com

**Swagger API Documentation**

https://vattal-enquiry-management.onrender.com/docs

**GitHub Repository**

https://github.com/Ramya-Saravanan-MCA/vattal-enquiry-management

## Test Admin Login

A test admin account is available for reviewing the admin dashboard.

```text
Email: admin@vattal.com
Password: adminvattal123
```

These credentials are provided only for assignment evaluation and demonstration.

## Tech Used

### Frontend

- React
- Vite
- Tailwind CSS
- Axios

### Backend

- FastAPI
- Python
- SQLAlchemy
- Pydantic
- Alembic

### Database

- PostgreSQL

### Other

- JWT authentication
- SlowAPI for rate limiting
- Locust for load testing
- Docker

## Main Features

### Enquiry Form

Clients can submit an enquiry with their contact and project details.

The form includes validation for required fields and supports file attachments.

Allowed attachment types:

- PDF
- JPG
- PNG

Files are checked on the backend for file type, size and actual file signature before they are stored.

The form also provides success and error feedback after submission.

### Admin

The admin side is protected using JWT authentication.

After login, the admin can:

- View submitted enquiries
- Search enquiries
- Filter enquiries by status
- Navigate through enquiries using pagination
- Open an enquiry to see full details
- Change enquiry status
- Download attachments
- View status change history

The available enquiry statuses are:

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
│
├── backend/
│   ├── app/
│   │   ├── core/
│   │   ├── db/
│   │   ├── dependencies/
│   │   ├── models/
│   │   ├── routers/
│   │   ├── schemas/
│   │   ├── services/
│   │   ├── utils/
│   │   └── main.py
│   │
│   ├── alembic/
│   ├── scripts/
│   ├── tests/
│   ├── Dockerfile
│   └── requirements.txt
│
├── frontend/
│   ├── src/
│   ├── package.json
│   ├── vite.config.js
│   └── vercel.json
│
├── load-tests/
│   └── locustfile.py
│
└── README.md
```

I kept the backend separated into routers, schemas, models and services instead of keeping all the application logic inside the API routes.

## Running the Backend

Go to the backend folder:

```bash
cd backend
```

Create a virtual environment:

```bash
python -m venv venv
```

Activate it on Windows Command Prompt:

```bash
venv\Scripts\activate
```

Or on PowerShell:

```powershell
.\venv\Scripts\Activate.ps1
```

Install the dependencies:

```bash
pip install -r requirements.txt
```

## Environment Configuration

Create a `.env` file inside the `backend` directory.

Example:

```env
APP_NAME=Project Enquiry Management API
APP_ENV=development
DEBUG=false

DATABASE_URL=postgresql+psycopg2://username:password@localhost:5432/vattal_enquiry

JWT_SECRET=your-secure-secret-key
JWT_ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=60

ALLOWED_ORIGINS=http://localhost:5173

MAX_UPLOAD_SIZE_MB=5
```

The actual `.env` file should not be committed to Git because it contains sensitive configuration.

## Database Setup

PostgreSQL is required to run the backend.

Create a PostgreSQL database:

```sql
CREATE DATABASE vattal_enquiry;
```

Update the `DATABASE_URL` inside `.env` with the correct PostgreSQL username and password.

For example:

```env
DATABASE_URL=postgresql+psycopg2://postgres:your_password@localhost:5432/vattal_enquiry
```

Run the database migrations:

```bash
alembic upgrade head
```

Alembic creates the required database tables.

The main tables used by the application are:

```text
admins
enquiries
audit_logs
alembic_version
```

## Creating an Admin

An admin account can be created using the included script.

From the `backend` directory run:

```bash
python -m scripts.create_admin
```

The script will ask for:

```text
Admin email:
Admin password:
```

The password must contain at least 12 characters.

Admin passwords are stored as hashes rather than plain text.

## Starting the Backend

Start FastAPI with:

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

Open another terminal and go to the frontend folder:

```bash
cd frontend
```

Install the packages:

```bash
npm install
```

The frontend uses `VITE_API_URL` to determine which backend API to use.

For local development, it can be configured as:

```env
VITE_API_URL=http://127.0.0.1:8001/api/v1
```

Start the frontend:

```bash
npm run dev
```

The development server will normally be available at:

```text
http://localhost:5173
```

## API

The main API endpoints used by the project are:

```text
POST   /api/v1/enquiries
POST   /api/v1/auth/login

GET    /api/v1/admin/me
GET    /api/v1/admin/enquiries
GET    /api/v1/admin/enquiries/{id}
PATCH  /api/v1/admin/enquiries/{id}/status
GET    /api/v1/admin/enquiries/{id}/attachment
```

Admin endpoints require a valid JWT bearer token.

The full API specification is available through Swagger:

```text
https://vattal-enquiry-management.onrender.com/docs
```

## Authentication

The admin dashboard uses JWT-based authentication.

The authentication flow is:

```text
Admin Login
    ↓
Credentials verified
    ↓
JWT access token generated
    ↓
Frontend sends token with protected requests
    ↓
Backend validates token
    ↓
Protected admin resource returned
```

Passwords are hashed before being stored in the database.

## Security

A few security measures I added while building the project:

- Password hashing
- JWT authentication
- Token expiration
- Protected admin APIs
- Active admin validation
- Request validation using Pydantic
- Restricted CORS origins
- Rate limiting
- File type validation
- File size validation
- File signature checking
- Protected attachment downloads
- Security headers
- Environment variables for secrets
- Audit logging for admin actions

The login endpoint is limited to 5 requests per minute.

The public enquiry endpoint is limited to 10 requests per minute per IP.

Sensitive values such as database credentials and JWT secrets are stored using environment variables instead of being hardcoded in the application.

## Database

PostgreSQL is used for storing:

- Admin accounts
- Enquiries
- Audit logs

SQLAlchemy is used for database operations and Alembic is used for schema migrations.

I also added indexes for fields that are commonly used while retrieving enquiries.

For example, enquiries have a composite index on:

```text
status + created_at
```

I checked the query using PostgreSQL `EXPLAIN ANALYZE`.

Example:

```sql
EXPLAIN (ANALYZE, BUFFERS)
SELECT *
FROM enquiries
WHERE status = 'NEW'
ORDER BY created_at DESC
LIMIT 10;
```

PostgreSQL used the `ix_enquiries_status_created_at` index when filtering enquiries by status and ordering them by creation date.

## Search, Filtering and Pagination

The admin enquiry API supports search, status filtering and pagination.

Pagination prevents the API from returning every enquiry in a single request and keeps the dashboard manageable as the number of records increases.

The API also limits the maximum page size.

## Audit Logging

Important admin actions are recorded in the audit log.

When an enquiry status is changed, the application records the action so that the change history can be reviewed later.

Audit records are stored separately from the main enquiry records.

## File Uploads

Customers can attach PDF, JPG or PNG files to an enquiry.

The backend validates:

- File extension/type
- File size
- File signature

The configured maximum upload size is:

```text
5 MB
```

Attachment downloads are available only through protected admin endpoints.

## Testing

Backend tests are available inside the `backend/tests` directory.

Run them using:

```bash
pytest
```

The APIs can also be tested manually using the FastAPI Swagger interface.

## Load Testing

I used Locust to perform a basic load test against the enquiry submission API.

The test file is available at:

```text
load-tests/locustfile.py
```

The endpoint tested was:

```text
POST /api/v1/enquiries
```

One baseline test produced:

```text
Requests: 9
Failures: 0

Average response time: 36.66 ms
Median response time: 36 ms

95th percentile: 65 ms
99th percentile: 65 ms

Minimum response time: 23 ms
Maximum response time: 65 ms

Failures per second: 0
```

The test completed without request failures.

The enquiry endpoint also has rate limiting, so requests above the configured limit return:

```text
429 Too Many Requests
```

This was a small assignment-level load test rather than a production-scale stress test.

### Running the Load Test

Install Locust if required:

```bash
pip install locust
```

From the project root run:

```bash
locust -f load-tests/locustfile.py
```

Then open:

```text
http://localhost:8089
```

Enter the backend host and start the test.

## Docker

The backend includes a Dockerfile.

From the `backend` directory, build the image:

```bash
docker build -t vattal-backend .
```

Run the container:

```bash
docker run --name vattal-backend-container -p 8002:8001 --env-file .env vattal-backend
```

The health endpoint can then be checked at:

```text
http://localhost:8002/health
```

## Deployment

The deployed application uses:

```text
Vercel
React / Vite Frontend
        ↓
Render
FastAPI Backend
        ↓
Render PostgreSQL
Database
```

### Frontend

The React frontend is deployed on Vercel:

```text
https://vattal-enquiry-management.vercel.app
```

The production frontend uses:

```env
VITE_API_URL=https://vattal-enquiry-management.onrender.com/api/v1
```

### Backend

The FastAPI backend is deployed as a Docker-based Render Web Service:

```text
https://vattal-enquiry-management.onrender.com
```

Production configuration is provided using Render environment variables.

### Database

The production PostgreSQL database is hosted on Render.

Alembic migrations are used to create and maintain the production database schema.

## Notes

This project mainly focuses on building a clean enquiry workflow while keeping the backend secure and maintainable.

The database schema is managed through migrations, admin endpoints are protected, status changes are recorded in audit logs, and the application includes basic performance and deployment testing.

## Limitations and Assumptions

This project was completed as a time-boxed technical assignment.

A few limitations of the current version are:

- Uploaded files currently use application-level storage instead of permanent object storage such as Amazon S3.
- The load test is a small baseline test rather than a production-scale stress test.
- The application currently supports a single admin access level.
- Email notifications are not implemented.
- The deployed application uses free-tier hosting and is intended for assignment evaluation and demonstration.

For a larger production system, I would move attachments to persistent object storage, add more extensive automated testing and introduce production monitoring and alerting.

## Author

Developed as a Project Enquiry Management System technical assignment.