import enum
from typing import Optional

from model_utils import PyObjectId
from note import Note

from pydantic import BaseModel, Field
import uuid


class Document(BaseModel):
    id: Optional[PyObjectId] = Field(alias="_id", default=None)
    folder_id: Optional[str] = None
    creator_id: str
    title: str
    notes: dict[str, Note]
    content: str

    model_config = {
        "populate_by_field_name": True,
    }


class ReviewType(enum.Enum):
    FLASH_CARDS = "flash_cards"
    MULTIPLE_CHOICE_QUESTION = "multiple_choice_questions"
    OPEN_ENDED_QUESTION = "open_ended_questions"
    CHAT = "chat"


class Folder(BaseModel):
    id: Optional[PyObjectId] = Field(alias="_id", default=None)
    creator_id: str
    name: str
    created_at: str

    model_config = {
        "populate_by_field_name": True,
    }