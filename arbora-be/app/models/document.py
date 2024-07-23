from typing import Optional

from model_utils import PyObjectId
from note import Note

from pydantic import BaseModel, Field
import uuid


class Document(BaseModel):
    id: Optional[PyObjectId] = Field(alias="_id", default=None)
    folder_id: Optional[str] = None
    creator_id: str
    name: str
    notes: dict[str, Note]
    content: str

    model_config = {
        "populate_by_field_name": True,
    }
