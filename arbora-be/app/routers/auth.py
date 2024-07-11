from fastapi import APIRouter, Request
from pydantic import BaseModel, EmailStr
from starlette import status
from starlette.responses import JSONResponse

auth_router = APIRouter()


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class LoginResponse(BaseModel):
    message: str


@auth_router.post("/login", description="login to arbora", response_model=LoginResponse, status_code=status.HTTP_200_OK)
def login(request: Request, login_params: LoginRequest):
    response = LoginResponse(message="Login successful!")
    return JSONResponse(content=response.dict(), status_code=status.HTTP_200_OK)
