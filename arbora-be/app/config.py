from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    JWT_SECRET_KEY: str
    JWT_ALGORITHM: str
    MONGODB_URL: str
    DB_NAME: str

    class Config:
        env_file = "./../.env"
        env_file_encoding = "utf-8"


settings = Settings()
