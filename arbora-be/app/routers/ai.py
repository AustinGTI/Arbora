from fastapi import APIRouter, Depends

from auth_bearer import JWTBearer

ai_router = APIRouter('ai', dependencies=[Depends(JWTBearer())])


@ai_router.get("/flash-cards")
async def get_flash_cards():
    return NotImplementedError()


@ai_router.get("/multiple-choice-questions")
async def get_multiple_choice_questions():
    return NotImplementedError()


@ai_router.get("/open-ended-questions")
async def get_open_ended_questions():
    return NotImplementedError()


@ai_router.post("/grade-open-ended-questions")
async def grade_open_ended_questions():
    return NotImplementedError()


@ai_router.post("/chat-with-arby")
async def chat_with_arby():
    return NotImplementedError()
