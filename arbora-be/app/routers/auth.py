from fastapi import APIRouter, Request, Depends

from auth_bearer import JWTBearer
from user import User
from utils.auth_utils import hashPassword, generateJWTToken, verifyPassword, JWTPayload, validateJWTToken
from pydantic import BaseModel, EmailStr
from starlette import status
from starlette.responses import JSONResponse

auth_router = APIRouter()


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class LoginResponse(BaseModel):
    is_successful: bool
    access_token: str = ''
    refresh_token: str = ''
    message: str


@auth_router.post("/login", description="login to arbora", response_model=LoginResponse, status_code=status.HTTP_200_OK)
async def login(request: Request, login_params: LoginRequest):
    # check if the user exists in the database
    user = await request.app.mongodb["users"].find_one({"email": login_params.email})
    if user is None:
        response = LoginResponse(message="User does not exist", is_successful=False)
        return JSONResponse(content=response.dict(), status_code=status.HTTP_404_NOT_FOUND)

    user = User(**user)

    # check if the password is correct
    if verifyPassword(login_params.password, user.password_hash) is False:
        response = LoginResponse(message="Incorrect password", is_successful=False)
        return JSONResponse(content=response.dict(), status_code=status.HTTP_400_BAD_REQUEST)

    response = LoginResponse(is_successful=True, message="Login successful!", access_token=generateJWTToken(user.id),
                             refresh_token=generateJWTToken(user.id, seconds_to_expiry=3600 * 24))
    return JSONResponse(content=response.dict(), status_code=status.HTTP_200_OK)


class RefreshTokenRequest(BaseModel):
    refresh_token: str


class RefreshTokenResponse(BaseModel):
    is_successful: bool
    access_token: str = ''
    message: str


@auth_router.get("/refresh-token", description="refresh the access token", response_model=LoginResponse, status_code=status.HTTP_200_OK)
async def refresh_token(refresh_token_params: RefreshTokenRequest, payload: JWTPayload = Depends(JWTBearer())):
    # check if the refresh token is valid
    if not validateJWTToken(refresh_token_params.refresh_token):
        response = RefreshTokenResponse(message="Invalid refresh token", is_successful=False)
        return JSONResponse(content=response.dict(), status_code=status.HTTP_400_BAD_REQUEST)
    # if it is valid, generate a new access token
    response = RefreshTokenResponse(is_successful=True, message="Token refreshed", access_token=generateJWTToken(payload.user_id))
    return JSONResponse(content=response.dict(), status_code=status.HTTP_200_OK)
