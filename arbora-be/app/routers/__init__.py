from pydantic import BaseModel


class GenericResponse(BaseModel):
    is_successful: bool
    message: str
