import {GenericServiceRequest, GenericServiceResponse, GenericServiceResponseData} from "../types.ts";
import {
    ChatResponse,
    FlashCard,
    MultipleChoiceQuestion,
    OpenEndedQuestion,
    OpenEndedQuestionAssessment
} from "./types.ts";
import {makeServiceCall} from "../helpers.ts";
import {BACKEND_URL} from "../../constants/env.ts";

interface GetFlashCardsServiceRequest extends GenericServiceRequest {
    content: string
    no_of_flash_cards: number
}

interface GetFlashCardsServiceResponse extends GenericServiceResponseData {
    flash_cards: FlashCard[]
}

function prependAIUrl(url: string): string {
    return `${BACKEND_URL}/ai/${url}`
}

/**
 * generate flash cards for the user given content and number of cards
 */
export async function getFlashCardsService(request: GetFlashCardsServiceRequest): Promise<GenericServiceResponse<GetFlashCardsServiceResponse>> {
    return makeServiceCall<GetFlashCardsServiceRequest, GetFlashCardsServiceResponse>({
        url: prependAIUrl("get-flash-cards"),
        method: "POST",
        request,
        service_name: "getFlashCardsService",
        with_access_token: true
    })
}


interface GetMultipleChoiceQuestionServiceRequest extends GenericServiceRequest {
    content: string
    no_of_questions: number
}

interface GetMultipleChoiceQuestionServiceResponse extends GenericServiceResponseData {
    questions: MultipleChoiceQuestion[]
}

/**
 * generate multiple choice questions for the user given content and number of questions
 */
export async function getMultipleChoiceQuestionsService(request: GetMultipleChoiceQuestionServiceRequest): Promise<GenericServiceResponse<GetMultipleChoiceQuestionServiceResponse>> {
    return makeServiceCall<GetMultipleChoiceQuestionServiceRequest, GetMultipleChoiceQuestionServiceResponse>({
        url: prependAIUrl("get-multiple-choice-questions"),
        method: "POST",
        request,
        service_name: "getMultipleChoiceQuestionsService",
        with_access_token: true
    })
}


interface GetOpenEndedQuestionServiceRequest extends GenericServiceRequest {
    content: string
    no_of_questions: number
}

interface GetOpenEndedQuestionServiceResponse extends GenericServiceResponseData {
    questions: OpenEndedQuestion[]
}

/**
 * generate open ended questions for the user given content and number of questions
 */
export async function getOpenEndedQuestionsService(request: GetOpenEndedQuestionServiceRequest): Promise<GenericServiceResponse<GetOpenEndedQuestionServiceResponse>> {
    return makeServiceCall<GetOpenEndedQuestionServiceRequest, GetOpenEndedQuestionServiceResponse>({
        url: prependAIUrl("get-open-ended-questions"),
        method: "POST",
        request,
        service_name: "getOpenEndedQuestionsService",
        with_access_token: true
    })
}


interface GradeOpenEndedQuestionServiceRequest extends GenericServiceRequest {
    content: string
    questions: OpenEndedQuestion[]
    answers: string[]
}

interface GradeOpenEndedQuestionServiceResponse extends GenericServiceResponseData {
    grading: OpenEndedQuestionAssessment[]
}

/**
 * grade open ended questions for the user given content, questions and answers
 */
export async function gradeOpenEndedQuestionsService(request: GradeOpenEndedQuestionServiceRequest): Promise<GenericServiceResponse<GradeOpenEndedQuestionServiceResponse>> {
    return makeServiceCall<GradeOpenEndedQuestionServiceRequest, GradeOpenEndedQuestionServiceResponse>({
        url: prependAIUrl("grade-open-ended-questions"),
        method: "POST",
        request,
        service_name: "gradeOpenEndedQuestionsService",
        with_access_token: true
    })
}

interface ChatWithArbyServiceRequest extends GenericServiceRequest {
    content: string
    conversation: string[]
    limit: number
    curiosity: number
}

interface ChatWithArbyServiceResponse extends GenericServiceResponseData {
    conversation: ChatResponse[]
}

/**
 * chat with Arby given content, conversation history, limit and curiosity
 */
export async function chatWithArbyService(request: ChatWithArbyServiceRequest): Promise<GenericServiceResponse<ChatWithArbyServiceResponse>> {
    return makeServiceCall<ChatWithArbyServiceRequest, ChatWithArbyServiceResponse>({
        url: prependAIUrl("chat-with-arby"),
        method: "POST",
        request,
        service_name: "chatWithArbyService",
        with_access_token: true
    })
}
