from decimal import Decimal
from app.core.rate_limit import limiter

from fastapi import (
    APIRouter,
    Depends,
    File,
    Form,
    UploadFile,
    status,
    Request,
)
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.schemas.enquiry import EnquiryCreate, EnquiryResponse
from app.services.enquiry_service import create_enquiry
from app.services.file_service import save_upload


router = APIRouter(
    prefix="/api/v1/enquiries",
    tags=["Enquiries"],
)


@router.post(
    "",
    response_model=EnquiryResponse,
    status_code=status.HTTP_201_CREATED,
)
@limiter.limit("10/minute")
async def submit_enquiry(
    request: Request,
    name: str = Form(...),
    email: str = Form(...),
    phone: str | None = Form(None),
    company: str | None = Form(None),
    project_type: str = Form(...),
    budget: Decimal | None = Form(None),
    message: str = Form(...),
    attachment: UploadFile | None = File(None),
    db: Session = Depends(get_db),
):
    # Validate normal enquiry fields using Pydantic
    enquiry_data = EnquiryCreate(
        name=name,
        email=email,
        phone=phone,
        company=company,
        project_type=project_type,
        budget=budget,
        message=message,
    )

    attachment_path = None

    if attachment is not None:
        attachment_path = await save_upload(attachment)

    return create_enquiry(
        db=db,
        enquiry_data=enquiry_data,
        attachment_path=attachment_path,
    )