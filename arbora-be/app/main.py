import uvicorn
from fastapi import FastAPI
from motor.motor_asyncio import AsyncIOMotorClient
from config import settings
from routers.document import document_router
from routers.auth import auth_router
from routers.user import user_router


async def lifespan(app: FastAPI):
    # startup
    app.mongodb_client = AsyncIOMotorClient(settings.MONGODB_URL)
    app.mongodb = app.mongodb_client[settings.DB_NAME]

    yield
    app.mongodb_client.close()


app = FastAPI(lifespan=lifespan)

app.include_router(auth_router)
app.include_router(user_router)
app.include_router(document_router)

if __name__ == '__main__':
    uvicorn.run(
        "main:app"
    )
