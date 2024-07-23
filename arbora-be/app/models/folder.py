import uuid

from pydantic import Field, BaseModel


class Folder(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()), alias="_id")
    name: str
