# Vattal Enquiry Management System

Vattal Enquiry Management System is a web application for collecting and managing customer enquiries. Users can submit enquiries through the website, while admins can log in to view and manage the submitted enquiries from the admin dashboard.

The project is built with React and Vite for the frontend and FastAPI for the backend.

## Features

### User

* Submit a new enquiry
* Form validation for required fields
* Upload attachments along with an enquiry
* Responsive interface for desktop and mobile devices
* Clear success and error messages after submission

### Admin

* Secure admin login
* View submitted enquiries
* View individual enquiry details
* Update enquiry status
* Search and filter enquiries
* Manage enquiry records
* View audit logs for administrative actions

## Tech Stack

### Frontend

* React
* Vite
* JavaScript
* CSS
* Axios

### Backend

* Python
* FastAPI
* SQLAlchemy
* Pydantic
* JWT authentication
* Alembic

### Database

* PostgreSQL

## Project Structure

```text
vattal-enquiry-management/
│
├── frontend/
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── vite.config.js
│
├── backend/
│   ├── app/
│   │   ├── core/
│   │   ├── db/
│   │   ├── models/
│   │   ├── routers/
│   │   ├── schemas/
│   │   ├── services/
│   │   ├── utils/
│   │   └── main.py
│   │
│   ├── alembic/
│   ├── tests/
│   ├── requirements.txt
│   └── Dockerfile
│
└── README.md
```

## Running the Project Locally

### 1. Clone the repository

```bash
git clone <repository-url>
cd vattal-enquiry-management
```

## Backend Setup

Go to the backend directory.

```bash
cd backend
```

Create a virtual environment.

```bash
python -m venv venv
```

Activate it on Windows:

```bash
venv\Scripts\activate
```

Install the required packages.

```bash
pip install -r requirements.txt
```

Create a `.env` file inside the backend directory and add the required environment variables.

Example:

```env
DATABASE_URL=postgresql://username:password@localhost:5432/vattal_db
SECRET_KEY=your-secret-key
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=60
```

Do not commit the actual `.env` file to the repository.

Run database migrations:

```bash
alembic upgrade head
```

Start the FastAPI server:

```bash
uvicorn app.main:app --reload
```

The backend will run at:

```text
http://localhost:8000
```

FastAPI API documentation is available at:

```text
http://localhost:8000/docs
```

## Frontend Setup

Open another terminal and go to the frontend directory.

```bash
cd frontend
```

Install the dependencies.

```bash
npm install
```

Start the development server.

```bash
npm run dev
```

The frontend will normally be available at:

```text
http://localhost:5173
```

## Authentication

Admin APIs are protected using JWT authentication.

After a successful login, the backend generates an access token. The frontend sends this token with requests to protected endpoints.

```text
Admin Login
    ↓
Credentials verified
    ↓
JWT access token generated
    ↓
Token sent with protected requests
    ↓
Backend validates token
    ↓
Admin resource returned
```

Passwords are stored as hashes rather than plain text.

## API Overview

Some of the main API routes used by the application are:

```text
POST   /api/v1/auth/login
POST   /api/v1/enquiries
GET    /api/v1/enquiries
GET    /api/v1/enquiries/{id}
```

The complete and current API specification can be checked through Swagger at `/docs` while the backend is running.

## Database

PostgreSQL is used for storing application data.

The main data handled by the system includes:

* Admin accounts
* Enquiries
* Audit logs

SQLAlchemy is used for database operations and Alembic is used to manage database schema migrations.

## Security

The application includes basic security measures such as:

* Password hashing
* JWT-based authentication
* Protected admin endpoints
* Request validation using Pydantic
* Environment variables for sensitive configuration
* CORS configuration
* File validation for uploaded attachments
* Audit logging for important admin actions

Sensitive values such as database credentials and secret keys are not stored directly in the source code.

## Testing

Backend tests are kept inside the `tests` directory.

Run the tests using:

```bash
pytest
```

API behaviour can also be tested manually using the FastAPI Swagger interface.

## Docker

The backend includes a Dockerfile so that it can be run in a containerized environment.

Build the image:

```bash
docker build -t vattal-backend ./backend
```

Run the container:

```bash
docker run -p 8000:8000 vattal-backend
```

## Development Notes

The project follows a layered backend structure to keep responsibilities separate.

* `routers` handle API routes and HTTP requests.
* `schemas` define request and response validation.
* `models` define database tables.
* `services` contain business logic.
* `db` contains database configuration.
* `core` contains application configuration and security-related functionality.
* `utils` contains reusable helper functions.

This structure makes it easier to maintain the application and add new functionality without putting all the logic inside the API routes.

## Future Improvements

Some improvements that can be added later include:

* Email notifications for new enquiries
* Advanced search and filtering
* Dashboard statistics
* Role-based admin access
* Automated deployment
* Improved monitoring and logging

## Author

Developed as an Enquiry Management System project.
