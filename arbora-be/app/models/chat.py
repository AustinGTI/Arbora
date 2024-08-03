from pydantic import BaseModel


class ChatResponse(BaseModel):
    message: str
    is_last: bool
