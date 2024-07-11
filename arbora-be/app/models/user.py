import uuid

from pydantic import BaseModel, Field, EmailStr


class User(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()), alias="_id")
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
