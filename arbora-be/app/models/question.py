from pydantic import BaseModel


class MultipleChoiceQuestion(BaseModel):
    id: str
    question: str
    choices: list[str]
    correct_choice: int


class OpenEndedQuestion(BaseModel):
    id: str
    question: str


class OpenEndedQuestionAnswer(BaseModel):
    id: str
    grade: int
    comment: str
