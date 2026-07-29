from getpass import getpass

from sqlalchemy import select

from app.db.database import SessionLocal
from app.models.admin import Admin
from app.core.security import hash_password


def create_admin():
    email = input("Admin email: ").strip().lower()
    password = getpass("Admin password: ")

    if len(password) < 12:
        print("Password must contain at least 12 characters.")
        return

    db = SessionLocal()

    try:
        existing_admin = db.scalar(
            select(Admin).where(Admin.email == email)
        )

        if existing_admin:
            print("Admin already exists.")
            return

        admin = Admin(
            email=email,
            password_hash=hash_password(password),
        )

        db.add(admin)
        db.commit()

        print("Admin created successfully.")

    except Exception:
        db.rollback()
        raise

    finally:
        db.close()


if __name__ == "__main__":
    create_admin()