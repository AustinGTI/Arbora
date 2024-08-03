from dotenv import load_dotenv
from pydantic_settings import BaseSettings

load_dotenv()


class Settings(BaseSettings):
    JWT_SECRET_KEY: str
    JWT_ALGORITHM: str
    MONGODB_URL: str
    DB_NAME: str
    GOOGLE_AI_API_KEY: str

    class Config:
        env_file = "./../.env"
        env_file_encoding = "utf-8"


settings = Settings()
