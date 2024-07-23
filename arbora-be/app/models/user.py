import uuid
from typing import Optional

from pydantic import BaseModel, Field, EmailStr

from model_utils import PyObjectId


class User(BaseModel):
    id: Optional[PyObjectId] = Field(alias="_id", default=None)
    name: str
    email: EmailStr
    password_hash: str
    is_active: bool
    is_verified: bool
    created_at: str
    updated_at: str
    deleted_at: str

    class Config:
        populate_by_field_name = True
        json_schema_extra = {
            "example": {
                "name": "John Doe",
                "email": "johndoe@gmail.com",
                "password_hash": "password_hash",
                "is_active": True,
                "is_verified": True,
                "created_at": "2021-07-21T00:00:00",
                "updated_at": "2021-07-21T00:00:00",
                "deleted_at": "2021-07-21T00:00:00",
            }
        }
