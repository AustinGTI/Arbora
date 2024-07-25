from typing import Optional

from bson import ObjectId
from fastapi import APIRouter, Request, Depends
from pydantic import BaseModel, EmailStr
from starlette import status
from starlette.responses import JSONResponse

from auth_bearer import JWTBearer
from models.user import User
from utils.auth_utils import hashPassword, JWTPayload
from datetime import datetime

user_router = APIRouter()


class CreateUserRequest(BaseModel):
    name: str
    email: EmailStr
    password: str
    password_confirmation: str


class CreateUserResponse(BaseModel):
    is_successful: bool
    message: str


@user_router.post("/create-user", description="create a user", response_model=CreateUserResponse, status_code=status.HTTP_201_CREATED)
async def createUser(request: Request, user_params: CreateUserRequest):
    # check that the password and the password confirmation are the same
    if user_params.password != user_params.password_confirmation:
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

    # we need to check that the email is unique
    existing_user = await request.app.mongodb["users"].find_one({"email": user.email})
    if existing_user is not None:
        response = CreateUserResponse(is_successful=False, message="This email is already in use on this platform, use another one")
        return JSONResponse(content=response.dict(), status_code=status.HTTP_400_BAD_REQUEST)

    new_user = await request.app.mongodb["users"].insert_one(user.dict(by_alias=True, exclude={"id"}))
    # get the created user to check if it was created successfully
    user = await request.app.mongodb["users"].find_one({"_id": new_user.inserted_id})

    if user is None:
        response = CreateUserResponse(is_successful=False, message="Failed to create user")
        return JSONResponse(content=response.dict(), status_code=status.HTTP_500_INTERNAL_SERVER_ERROR)

    response = CreateUserResponse(is_successful=True, message="User created successfully")
    return JSONResponse(content=response.dict(), status_code=status.HTTP_201_CREATED)


class GetUserResponse(BaseModel):
    user: Optional[User]
    message: str
    is_successful: bool


@user_router.get("/get-user", response_model=GetUserResponse, dependencies=[Depends(JWTBearer())])
async def getCurrentUser(request: Request):
    user_id = request.state.user_id
    user = await request.app.mongodb["users"].find_one({"_id": ObjectId(user_id)})
    if not user_id or not user:
        response = GetUserResponse(user=None, message="User not found", is_successful=False)
        return JSONResponse(content=response.dict(), status_code=status.HTTP_404_NOT_FOUND)

    response = GetUserResponse(user=user, message="User found", is_successful=True)
    return JSONResponse(content=response.dict(), status_code=status.HTTP_200_OK)
