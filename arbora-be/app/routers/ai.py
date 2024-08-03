from fastapi import APIRouter, Depends, Request
from starlette import status
from pydantic import BaseModel
from starlette.responses import JSONResponse

from auth_bearer import JWTBearer
from chat import ChatResponse
from flash_card import FlashCard
from gemini.services.flash_cards import generateFlashCards
from gemini.services.multiple_choice_questions import generateMultipleChoiceQuestions
from gemini.services.open_ended_questions import generateOpenEndedQuestions
from gemini.services.chat import explainContentToAI
from gemini.services.grade_open_ended_questions import gradeOpenEndedQuestions

from question import MultipleChoiceQuestion, OpenEndedQuestion, OpenEndedQuestionAssessment, OpenEndedQuestionAnswer
from routers import GenericResponse

ai_router = APIRouter(prefix='/ai', dependencies=[Depends(JWTBearer())])


class GetFlashCardsRequest(BaseModel):
    no_of_flash_cards: int
    content: str


class GetFlashCardsRequestResponse(GenericResponse):
    flash_cards: list[FlashCard]


@ai_router.post("/get-flash-cards", description="generate flash cards given the number and content", response_model=GetFlashCardsRequestResponse)
async def get_flash_cards(request: Request, params: GetFlashCardsRequest):
    try:
        flash_cards = generateFlashCards(params.no_of_flash_cards, params.content)
    except Exception as e:
        response = GetFlashCardsRequestResponse(is_successful=False, message="Internal error getting flash cards " + str(e), flash_cards=[])
        return JSONResponse(content=response.dict(), status_code=status.HTTP_500_INTERNAL_SERVER_ERROR)

    response = GetFlashCardsRequestResponse(is_successful=True, message="Flash cards generated successfully", flash_cards=flash_cards)
    return JSONResponse(content=response.dict(), status_code=status.HTTP_200_OK)


class GetMultipleChoiceQuestionsRequest(BaseModel):
    no_of_questions: int
    content: str


class GetMultipleChoiceQuestionsResponse(GenericResponse):
    questions: list[MultipleChoiceQuestion]


@ai_router.post("/get-multiple-choice-questions", description="generate multiple choice questions given the number and content",
                response_model=GetMultipleChoiceQuestionsResponse)
async def get_multiple_choice_questions(request: Request, params: GetMultipleChoiceQuestionsRequest):
    try:
        mc_questions = generateMultipleChoiceQuestions(params.no_of_questions, params.content)
    except Exception as e:
        response = GetMultipleChoiceQuestionsResponse(is_successful=False, message="Internal server error generating multiple choice questions," + str(e),
                                                      questions=[])
        return JSONResponse(content=response.dict(), status_code=status.HTTP_500_INTERNAL_SERVER_ERROR)

    response = GetMultipleChoiceQuestionsResponse(is_successful=True, message="Multiple choice questions generated successfully", questions=mc_questions)
    return JSONResponse(content=response.dict(), status_code=status.HTTP_200_OK)


class GetOpenEndedQuestionsRequest(BaseModel):
    no_of_questions: int
    content: str


class GetOpenEndedQuestionsResponse(GenericResponse):
    questions: list[OpenEndedQuestion]


@ai_router.post("/get-open-ended-questions", description="generate open ended questions given the number and content",
                response_model=GetOpenEndedQuestionsResponse)
async def get_open_ended_questions(request: Request, params: GetOpenEndedQuestionsRequest):
    try:
        oe_questions = generateOpenEndedQuestions(params.no_of_questions, params.content)
    except Exception as e:
        response = GetOpenEndedQuestionsResponse(is_successful=False, message='Internal server error ' + str(e), questions=[])
        return JSONResponse(content=response.dict(), status_code=status.HTTP_500_INTERNAL_SERVER_ERROR)

    response = GetOpenEndedQuestionsResponse(is_successful=True, message="Open ended questions generated successfully", questions=oe_questions)
    return JSONResponse(content=response.dict(), status_code=status.HTTP_200_OK)


class GradeOpenEndedQuestionsRequest(BaseModel):
    content: str
    questions: list[OpenEndedQuestion]
    answers: list[str]


class GradeOpenEndedQuestionsResponse(GenericResponse):
    grading: list[OpenEndedQuestionAssessment]


@ai_router.post("/grade-open-ended-questions", description="grade open ended questions given the content, questions and answers",
                response_model=GradeOpenEndedQuestionsResponse)
async def grade_open_ended_questions(request: Request, params: GradeOpenEndedQuestionsRequest):
    # check that the number of questions match the number of answers
    if len(params.questions) != len(params.answers):
        response = GradeOpenEndedQuestionsResponse(is_successful=False, message="Number of questions and answers do not match", grading=[])
        return JSONResponse(content=response.dict(), status_code=status.HTTP_400_BAD_REQUEST)

    try:
        grading = gradeOpenEndedQuestions(params.content,
                                          [OpenEndedQuestionAnswer(id=q.id, question=q.question, answer=a) for q, a in zip(params.questions,
                                                                                                                           params.answers)])
    except Exception as e:
        response = GradeOpenEndedQuestionsResponse(is_successful=False, message=str(e), grading=[])
        return JSONResponse(content=response.dict(), status_code=status.HTTP_500_INTERNAL_SERVER_ERROR)

    response = GradeOpenEndedQuestionsResponse(is_successful=True, message="Open ended questions graded successfully", grading=grading)
    return JSONResponse(content=response.dict(), status_code=status.HTTP_200_OK)


class ChatWithArbyRequest(BaseModel):
    content: str
    conversation: list[str]
    # the limit to the length of the conversation
    limit: int
    # how curious the ai is, how deep the questioning goes
    curiosity: int


class ChatWithArbyResponse(GenericResponse):
    response: ChatResponse


@ai_router.post("/chat-with-arby", description="chat with the AI", response_model=GenericResponse)
async def chat_with_arby(request: Request, params: ChatWithArbyRequest):
    try:
        response = explainContentToAI(params.content, params.conversation, params.limit, params.curiosity)
    except Exception as e:
        response = ChatWithArbyResponse(is_successful=False, message="Internal error in Chat with Arby : " + str(e), response=ChatResponse())
        return JSONResponse(content=response.dict(), status_code=status.HTTP_500_INTERNAL_SERVER_ERROR)

    response = ChatWithArbyResponse(is_successful=True, message="Chat with Arby successful", response=response)
    return JSONResponse(content=response.dict(), status_code=status.HTTP_200_OK)
