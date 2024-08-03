from pydantic import BaseModel


class FlashCard(BaseModel):
    id: str
    prompt: str
    answer: str
