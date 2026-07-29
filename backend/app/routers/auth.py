from fastapi import APIRouter, Depends, HTTPException, Request, status
from sqlalchemy import select
from sqlalchemy.orm import Session
from app.core.rate_limit import limiter

from app.core.security import create_access_token, verify_password
from app.db.database import get_db
from app.models.admin import Admin
from app.schemas.auth import LoginRequest, TokenResponse


router = APIRouter(
    prefix="/api/v1/auth",
    tags=["Authentication"],
)


@router.post(
    "/login",
    response_model=TokenResponse,
)
@limiter.limit("5/minute")
def login(
    request: Request,
    credentials: LoginRequest,
    db: Session = Depends(get_db),
):
    admin = db.scalar(
        select(Admin).where(
            Admin.email == credentials.email.lower()
        )
    )

    if (
        admin is None
        or not admin.is_active
        or not verify_password(
            credentials.password,
            admin.password_hash,
        )
    ):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
        )

    access_token = create_access_token(
        subject=str(admin.id)
    )

    return TokenResponse(
        access_token=access_token,
    )