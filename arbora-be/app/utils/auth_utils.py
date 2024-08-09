import time
from typing import Optional

import bcrypt
from pydantic import BaseModel

import jwt
from config import settings


def hashPassword(password: str):
    return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt(14))


def verifyPassword(password: str, hashed_password: str):
    return bcrypt.checkpw(password.encode('utf-8'), hashed_password.encode('utf-8'))


class JWTPayload(BaseModel):
    user_id: str
    expires: int


def generateJWTToken(user_id: str, seconds_to_expiry: int = 60 * 60) -> str:
    payload = JWTPayload(user_id=user_id, expires=int(time.time()) + seconds_to_expiry)

    token = jwt.encode(payload.dict(), settings.JWT_SECRET_KEY, algorithm=settings.JWT_ALGORITHM)

    return token


def decodeJWTToken(token: str) -> Optional[JWTPayload]:
    try:
        payload = jwt.decode(token, settings.JWT_SECRET_KEY, algorithms=[settings.JWT_ALGORITHM])

        return JWTPayload(**payload)
    except jwt.PyJWTError:
        return None


def validateJWTToken(token: str) -> bool:
    payload = decodeJWTToken(token)
    print('token is ', payload)
    if payload is not None and payload.expires > time.time():
        return True
    return False
