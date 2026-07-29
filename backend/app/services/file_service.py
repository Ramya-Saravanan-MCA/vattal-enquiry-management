from pathlib import Path
from uuid import uuid4

from fastapi import HTTPException, UploadFile, status

from app.core.config import settings


UPLOAD_DIR = Path("uploads")

ALLOWED_TYPES = {
    "application/pdf": {
        "extension": ".pdf",
        "signature": b"%PDF",
    },
    "image/jpeg": {
        "extension": ".jpg",
        "signature": b"\xff\xd8\xff",
    },
    "image/png": {
        "extension": ".png",
        "signature": b"\x89PNG\r\n\x1a\n",
    },
}


async def save_upload(file: UploadFile) -> str:

    # 1. Validate declared MIME type
    file_config = ALLOWED_TYPES.get(file.content_type)

    if file_config is None:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Only PDF, JPG and PNG files are allowed",
        )

    # 2. Read file with size protection
    max_size = settings.max_upload_size_mb * 1024 * 1024

    content = await file.read(max_size + 1)

    if len(content) > max_size:
        raise HTTPException(
            status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
            detail=f"File must not exceed {settings.max_upload_size_mb} MB",
        )

    if not content:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Uploaded file is empty",
        )

    # 3. Validate actual file signature
    expected_signature = file_config["signature"]

    if not content.startswith(expected_signature):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="File content does not match the declared file type",
        )

    # 4. Generate our own filename
    extension = file_config["extension"]
    safe_filename = f"{uuid4()}{extension}"

    # 5. Ensure upload directory exists
    UPLOAD_DIR.mkdir(
        parents=True,
        exist_ok=True,
    )

    file_path = UPLOAD_DIR / safe_filename

    # 6. Save file
    with file_path.open("wb") as destination:
        destination.write(content)

    return str(file_path)