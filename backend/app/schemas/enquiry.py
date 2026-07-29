from datetime import datetime
from decimal import Decimal
from math import ceil
from typing import Annotated
from uuid import UUID

from pydantic import (
    AfterValidator,
    BaseModel,
    ConfigDict,
    EmailStr,
    Field,
    field_validator,
)

from app.models.enquiry import EnquiryStatus


ALLOWED_PROJECT_TYPES = {
    "Creative Film Promotions",
    "Professional Filming",
    "Movie Making Videos",
    "Social Media Management & Strategy",
    "Influencer Marketing",
    "AD Films",
    "Ad Films",
    "Expert Editing",
    "Captivating Photoshoots",
    "Photoshoots",
    "Other",
}


def strip_required_string(value: str) -> str:
    value = value.strip()

    if not value:
        raise ValueError("Value cannot be empty")

    return value


RequiredString = Annotated[
    str,
    AfterValidator(strip_required_string),
]


class EnquiryCreate(BaseModel):
    name: RequiredString = Field(
        min_length=2,
        max_length=100,
    )

    email: EmailStr

    phone: str | None = Field(
        default=None,
        max_length=20,
    )

    company: str | None = Field(
        default=None,
        max_length=150,
    )

    project_type: RequiredString = Field(
        min_length=2,
        max_length=50,
    )

    budget: Decimal | None = Field(
        default=None,
        gt=0,
        max_digits=12,
        decimal_places=2,
    )

    message: RequiredString = Field(
        min_length=10,
        max_length=5000,
    )

    @field_validator("email", mode="before")
    @classmethod
    def normalize_email(cls, value):
        if isinstance(value, str):
            return value.strip().lower()

        return value

    @field_validator("phone", mode="before")
    @classmethod
    def validate_phone(cls, value):
        if value is None:
            return None

        value = value.strip()

        if not value:
            return None

        if not value.startswith("+"):
            raise ValueError(
                "Phone number must include a country code"
            )

        digits = value[1:]

        if not digits.isdigit():
            raise ValueError(
                "Phone number must contain only digits after the country code"
            )

        if len(digits) < 7 or len(digits) > 15:
            raise ValueError(
                "Phone number must contain between 7 and 15 digits"
            )

        if value.startswith("+91"):
            indian_number = value[3:]

            if len(indian_number) != 10:
                raise ValueError(
                    "Indian mobile number must contain exactly 10 digits"
                )

            if indian_number[0] not in {"6", "7", "8", "9"}:
                raise ValueError(
                    "Indian mobile number must start with 6, 7, 8 or 9"
                )

        return value

    @field_validator("company", mode="before")
    @classmethod
    def normalize_company(cls, value):
        if value is None:
            return None

        value = value.strip()

        return value or None

    @field_validator("project_type")
    @classmethod
    def validate_project_type(cls, value):
        if value not in ALLOWED_PROJECT_TYPES:
            raise ValueError(
                "Invalid project type"
            )

        return value


class EnquiryResponse(BaseModel):
    id: UUID
    name: str
    email: EmailStr
    phone: str | None
    company: str | None
    project_type: str
    budget: Decimal | None
    status: EnquiryStatus
    created_at: datetime

    model_config = ConfigDict(
        from_attributes=True
    )


class PaginatedEnquiryResponse(BaseModel):
    items: list[EnquiryResponse]
    total: int
    page: int
    page_size: int
    total_pages: int

    @classmethod
    def create(
        cls,
        items: list[EnquiryResponse],
        total: int,
        page: int,
        page_size: int,
    ):
        return cls(
            items=items,
            total=total,
            page=page,
            page_size=page_size,
            total_pages=(
                ceil(total / page_size)
                if total
                else 0
            ),
        )


class EnquiryStatusUpdate(BaseModel):
    status: EnquiryStatus


class AuditLogResponse(BaseModel):
    id: UUID
    action: str
    old_value: str | None
    new_value: str | None
    created_at: datetime

    model_config = ConfigDict(
        from_attributes=True
    )


class EnquiryDetailResponse(BaseModel):
    id: UUID
    name: str
    email: EmailStr
    phone: str | None
    company: str | None
    project_type: str
    budget: Decimal | None
    message: str
    status: EnquiryStatus
    attachment_path: str | None
    created_at: datetime
    updated_at: datetime

    audit_logs: list[AuditLogResponse] = Field(
        default_factory=list
    )

    model_config = ConfigDict(
        from_attributes=True
    )