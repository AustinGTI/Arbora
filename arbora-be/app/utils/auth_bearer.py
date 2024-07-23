from fastapi import HTTPException, Request
from auth_utils import decodeJWTToken, validateJWTToken
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials


class JWTBearer(HTTPBearer):
    def __init__(self, auto_error: bool = True):
        super(JWTBearer, self).__init__(auto_error=auto_error)

    async def __call__(self, request: Request):
        credentials: HTTPAuthorizationCredentials = await super(JWTBearer, self).__call__(request)
        if credentials:
            if not credentials.scheme == "Bearer":
                raise HTTPException(status_code=403, detail="Invalid authentication scheme.")
            if not validateJWTToken(credentials.credentials):
                raise HTTPException(status_code=403, detail="Invalid token or expired token.")
            token = decodeJWTToken(credentials.credentials)
            request.state.user_id = token.user_id
            return token
        else:
            raise HTTPException(status_code=403, detail="Invalid authorization code.")
