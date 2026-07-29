from uuid import UUID

from sqlalchemy import func, or_, select
from sqlalchemy.orm import Session

from app.models.audit_log import AuditLog
from app.models.enquiry import Enquiry, EnquiryStatus
from app.schemas.enquiry import EnquiryCreate


def create_enquiry(
    db: Session,
    enquiry_data: EnquiryCreate,
    attachment_path: str | None = None,
) -> Enquiry:
    enquiry = Enquiry(
        name=enquiry_data.name.strip(),
        email=str(enquiry_data.email).lower(),
        phone=enquiry_data.phone,
        company=(
            enquiry_data.company.strip()
            if enquiry_data.company
            else None
        ),
        project_type=enquiry_data.project_type.strip(),
        budget=enquiry_data.budget,
        message=enquiry_data.message.strip(),
        attachment_path=attachment_path,
    )

    db.add(enquiry)

    try:
        db.commit()
        db.refresh(enquiry)
        return enquiry
    except Exception:
        db.rollback()
        raise


def get_enquiries(
    db: Session,
    page: int = 1,
    page_size: int = 10,
    search: str | None = None,
    enquiry_status: EnquiryStatus | None = None,
) -> tuple[list[Enquiry], int]:
    query = select(Enquiry)
    count_query = select(func.count(Enquiry.id))

    if search:
        search_value = f"%{search.strip()}%"

        search_filter = or_(
            Enquiry.name.ilike(search_value),
            Enquiry.email.ilike(search_value),
            Enquiry.company.ilike(search_value),
            Enquiry.project_type.ilike(search_value),
        )

        query = query.where(search_filter)
        count_query = count_query.where(search_filter)

    if enquiry_status:
        query = query.where(
            Enquiry.status == enquiry_status
        )

        count_query = count_query.where(
            Enquiry.status == enquiry_status
        )

    total = db.scalar(count_query) or 0

    offset = (page - 1) * page_size

    query = (
        query
        .order_by(Enquiry.created_at.desc())
        .offset(offset)
        .limit(page_size)
    )

    enquiries = list(db.scalars(query).all())

    return enquiries, total


def get_enquiry_by_id(
    db: Session,
    enquiry_id: UUID,
) -> Enquiry | None:
    return db.scalar(
        select(Enquiry).where(
            Enquiry.id == enquiry_id
        )
    )


def get_enquiry_audit_logs(
    db: Session,
    enquiry_id: UUID,
) -> list[AuditLog]:
    query = (
        select(AuditLog)
        .where(
            AuditLog.enquiry_id == enquiry_id
        )
        .order_by(AuditLog.created_at.desc())
    )

    return list(db.scalars(query).all())


def update_enquiry_status(
    db: Session,
    enquiry_id: UUID,
    new_status: EnquiryStatus,
    admin_id: UUID,
) -> Enquiry | None:
    enquiry = get_enquiry_by_id(
        db=db,
        enquiry_id=enquiry_id,
    )

    if enquiry is None:
        return None

    old_status = enquiry.status

    if old_status == new_status:
        return enquiry

    enquiry.status = new_status

    audit_log = AuditLog(
        admin_id=admin_id,
        enquiry_id=enquiry.id,
        action="STATUS_CHANGED",
        old_value=old_status.value,
        new_value=new_status.value,
    )

    db.add(audit_log)

    try:
        db.commit()
        db.refresh(enquiry)
        return enquiry
    except Exception:
        db.rollback()
        raise