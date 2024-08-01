import enum

from pydantic import BaseModel


class NoteEdit(BaseModel):
    added: int
    deleted: int
    timestamp: str


class NoteReview(BaseModel):
    review_type: str
    score: float
    timestamp: str


class Note(BaseModel):
    created_at: str
    edits: list[NoteEdit]
    reviews: list[NoteReview]
    content: str
    title: str
    level: int
    children: list[str]
