from fastapi import APIRouter, Request
from pydantic import BaseModel, EmailStr
from starlette import status
from starlette.responses import JSONResponse
from models.user import User
from utils.auth_utils import hashPassword
from datetime import datetime

user_router = APIRouter()


class CreateUserRequest(BaseModel):
    name: str
    email: EmailStr
    password: str
    password_confirm: str


class CreateUserResponse(BaseModel):
    is_successful: bool
    message: str


@user_router.post("/user", description="create a user", response_model=CreateUserResponse, status_code=status.HTTP_201_CREATED)
async def create_user(request: Request, user_params: CreateUserRequest):
    # check that the password and the confirm password are the same
    if user_params.password != user_params.password_confirm:
        response = CreateUserResponse(is_successful=False, message="Passwords do not match")
        return JSONResponse(content=response.dict(), status_code=status.HTTP_400_BAD_REQUEST)

    user = User(
        name=user_params.name,
        email=user_params.email,
        password_hash=hashPassword(user_params.password),
        is_active=True,
        is_verified=False,
        # the dates are in iso format
        created_at=datetime.now().isoformat(),
        updated_at="",
        deleted_at="",
    )
    new_user = await request.app.mongodb["users"].insert_one(user.dict())
    # get the created user to check if it was created successfully
    user = await request.app.mongodb["users"].find_one({"_id": new_user.inserted_id})

    if user is None:
        response = CreateUserResponse(is_successful=False, message="Failed to create user")
        return JSONResponse(content=response.dict(), status_code=status.HTTP_500_INTERNAL_SERVER_ERROR)

    response = CreateUserResponse(is_successful=True, message="User created successfully")
    return JSONResponse(content=response.dict(), status_code=status.HTTP_201_CREATED)
