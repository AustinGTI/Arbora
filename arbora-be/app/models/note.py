import enum

from pydantic import BaseModel


class ActionType(enum.Enum):
    EDIT = "edit"
    REVIEW = "review"


class Action(BaseModel):
    type: ActionType
    datetime: str
    single_doc_section: list


class Note(BaseModel):
    created_at: str
    actions: list[Action]
