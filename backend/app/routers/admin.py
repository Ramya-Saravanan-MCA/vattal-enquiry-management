from pathlib import Path
from uuid import UUID

from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
    Query,
    status,
)
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.dependencies.auth import get_current_admin
from app.models.admin import Admin
from app.models.enquiry import EnquiryStatus
from app.schemas.enquiry import (
    EnquiryDetailResponse,
    EnquiryResponse,
    EnquiryStatusUpdate,
    PaginatedEnquiryResponse,
)
from app.services.enquiry_service import (
    get_enquiries,
    get_enquiry_audit_logs,
    get_enquiry_by_id,
    update_enquiry_status,
)


router = APIRouter(
    prefix="/api/v1/admin",
    tags=["Admin"],
)


@router.get("/me")
def get_admin_profile(
    current_admin: Admin = Depends(get_current_admin),
):
    return {
        "id": str(current_admin.id),
        "email": current_admin.email,
        "is_active": current_admin.is_active,
    }


@router.get(
    "/enquiries",
    response_model=PaginatedEnquiryResponse,
)
def list_enquiries(
    page: int = Query(
        default=1,
        ge=1,
    ),
    page_size: int = Query(
        default=10,
        ge=1,
        le=100,
    ),
    search: str | None = Query(
        default=None,
        max_length=100,
    ),
    enquiry_status: EnquiryStatus | None = Query(
        default=None,
        alias="status",
    ),
    db: Session = Depends(get_db),
    current_admin: Admin = Depends(get_current_admin),
):
    enquiries, total = get_enquiries(
        db=db,
        page=page,
        page_size=page_size,
        search=search,
        enquiry_status=enquiry_status,
    )

    items = [
        EnquiryResponse.model_validate(enquiry)
        for enquiry in enquiries
    ]

    return PaginatedEnquiryResponse.create(
        items=items,
        total=total,
        page=page,
        page_size=page_size,
    )


@router.get(
    "/enquiries/{enquiry_id}",
    response_model=EnquiryDetailResponse,
)
def get_enquiry_details(
    enquiry_id: UUID,
    db: Session = Depends(get_db),
    current_admin: Admin = Depends(get_current_admin),
):
    enquiry = get_enquiry_by_id(
        db=db,
        enquiry_id=enquiry_id,
    )

    if enquiry is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Enquiry not found",
        )

    audit_logs = get_enquiry_audit_logs(
        db=db,
        enquiry_id=enquiry_id,
    )

    return {
        "id": enquiry.id,
        "name": enquiry.name,
        "email": enquiry.email,
        "phone": enquiry.phone,
        "company": enquiry.company,
        "project_type": enquiry.project_type,
        "budget": enquiry.budget,
        "message": enquiry.message,
        "status": enquiry.status,
        "attachment_path": enquiry.attachment_path,
        "created_at": enquiry.created_at,
        "updated_at": enquiry.updated_at,
        "audit_logs": audit_logs,
    }


@router.patch(
    "/enquiries/{enquiry_id}/status",
    response_model=EnquiryResponse,
)
def change_enquiry_status(
    enquiry_id: UUID,
    status_data: EnquiryStatusUpdate,
    db: Session = Depends(get_db),
    current_admin: Admin = Depends(get_current_admin),
):
    enquiry = update_enquiry_status(
        db=db,
        enquiry_id=enquiry_id,
        new_status=status_data.status,
        admin_id=current_admin.id,
    )

    if enquiry is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Enquiry not found",
        )

    return enquiry


@router.get(
    "/enquiries/{enquiry_id}/attachment",
)
def download_enquiry_attachment(
    enquiry_id: UUID,
    db: Session = Depends(get_db),
    current_admin: Admin = Depends(get_current_admin),
):
    enquiry = get_enquiry_by_id(
        db=db,
        enquiry_id=enquiry_id,
    )

    if enquiry is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Enquiry not found",
        )

    if not enquiry.attachment_path:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No attachment found for this enquiry",
        )

    file_path = Path(
        enquiry.attachment_path
    ).resolve()

    upload_directory = Path(
        "uploads"
    ).resolve()

    if (
        upload_directory
        not in file_path.parents
    ):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Invalid attachment path",
        )

    if (
        not file_path.exists()
        or not file_path.is_file()
    ):
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Attachment file not found",
        )

    return FileResponse(
        path=file_path,
        filename=file_path.name,
        media_type="application/octet-stream",
    )