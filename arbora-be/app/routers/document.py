from datetime import datetime
from typing import Optional

from bson import ObjectId
from fastapi import APIRouter, Request, Depends
from pydantic import BaseModel
from starlette import status
from starlette.responses import JSONResponse

from auth_bearer import JWTBearer
from document_utils import calculateContentEdit, extractDocumentTitle
from markdown_utils import generateNewDocumentNotes, generateUpdatedDocumentNotes
from models.document import Document
from note import NoteReview, Note

document_router = APIRouter(dependencies=[Depends(JWTBearer())])


class CreateDocumentRequest(BaseModel):
    content: str


class CreateDocumentResponse(BaseModel):
    document: Optional[Document]
    is_successful: bool
    message: str


@document_router.post("/create-document", description="create a document", response_model=CreateDocumentResponse)
async def createDocument(request: Request, document_params: CreateDocumentRequest):
    # first we need to get the access token to get the user id
    user_id = request.state.user_id
    user = await request.app.mongodb["users"].find_one({"_id": ObjectId(user_id)})
    if not user_id or not user:
        response = CreateDocumentResponse(message="Invalid access token", is_successful=False)
        return CreateDocumentResponse(content=response.dict(), status_code=status.HTTP_404_NOT_FOUND)
    document = Document(
        creator_id=user_id,
        title=extractDocumentTitle(document_params.content),
        notes=generateNewDocumentNotes(document_params.content),
        content=document_params.content,
    )
    new_document = await request.app.mongodb["documents"].insert_one(document.dict(by_alias=True, exclude={"id"}))
    created_document = await request.app.mongodb["documents"].find_one({"_id": new_document.inserted_id})
    if created_document is None:
        response = CreateDocumentResponse(is_successful=False, message="Failed to create document")
        return JSONResponse(content=response.dict(), status_code=status.HTTP_500_INTERNAL_SERVER_ERROR)
    response = CreateDocumentResponse(is_successful=True, message="Document created successfully", document=created_document)
    return JSONResponse(content=response.dict(), status_code=status.HTTP_201_CREATED)


class ListDocumentsResponse(BaseModel):
    documents: list[Document]
    is_successful: bool
    message: str


@document_router.get("/list-documents", description="Get and return a list of all the documents created by the current user",
                     response_model=ListDocumentsResponse)
async def listDocuments(request: Request):
    user_id = request.state.user_id
    documents = await request.app.mongodb["documents"].find({"creator_id": user_id}).to_list(length=100)
    response = ListDocumentsResponse(
        documents=documents,
        is_successful=True,
        message="Documents retrieved successfully"
    )
    return JSONResponse(content=response.dict(), status_code=status.HTTP_200_OK)


class UpdateDocumentRequest(BaseModel):
    id: str
    content: str


class UpdateDocumentResponse(BaseModel):
    document: Optional[Document]
    is_successful: bool
    message: str


@document_router.put("/update-document", description="Update a document", response_model=CreateDocumentResponse)
async def updateDocument(request: Request, document_params: UpdateDocumentRequest):
    user_id = request.state.user_id
    document = await request.app.mongodb["documents"].find_one({"_id": ObjectId(document_params.id)})
    if not document:
        response = UpdateDocumentResponse(message="Document not found", is_successful=False)
        return JSONResponse(content=response.dict(), status_code=status.HTTP_404_NOT_FOUND)
    # make sure that the user is the creator of the document
    if document["creator_id"] != user_id:
        response = UpdateDocumentResponse(message="Unauthorized", is_successful=False)
        return JSONResponse(content=response.dict(), status_code=status.HTTP_401_UNAUTHORIZED)

    # check if there is a difference in content, if not, no need to update
    added, deleted = calculateContentEdit(document['content'], document_params.content)

    if added + deleted == 0:
        response = UpdateDocumentResponse(is_successful=True, message="No changes made to document", document=document)
        return JSONResponse(content=response.dict(), status_code=status.HTTP_200_OK)

    edited_document = Document(**document)

    edited_document.title = extractDocumentTitle(document_params.content)
    print('title is ', edited_document.title)
    edited_document.content = document_params.content
    edited_document.notes = generateUpdatedDocumentNotes({key: Note(**note) for key, note in document['notes'].items()}, document_params.content)

    updated_document = await request.app.mongodb["documents"].update_one({"_id": ObjectId(document_params.id)},
                                                                         {"$set": edited_document.dict(by_alias=True, exclude={"id"})})
    if updated_document is None:
        response = UpdateDocumentResponse(is_successful=False, message="Failed to update document")
        return JSONResponse(content=response.dict(), status_code=status.HTTP_500_INTERNAL_SERVER_ERROR)

    response = UpdateDocumentResponse(is_successful=True, message="Document updated successfully", document=edited_document)
    return JSONResponse(content=response.dict(), status_code=status.HTTP_200_OK)


class DeleteDocumentRequest(BaseModel):
    id: str


class DeleteDocumentResponse(BaseModel):
    is_successful: bool
    message: str


@document_router.delete("/delete-document", description="Delete a document", response_model=CreateDocumentResponse)
async def deleteDocument(request: Request, document_params: DeleteDocumentRequest):
    user_id = request.state.user_id
    document = await request.app.mongodb["documents"].find_one({"_id": ObjectId(document_params.id)})
    if not document:
        response = DeleteDocumentResponse(message="Document not found", is_successful=False)
        return JSONResponse(content=response.dict(), status_code=status.HTTP_404_NOT_FOUND)
    # make sure that the user is the creator of the document
    if document["creator_id"] != user_id:
        response = DeleteDocumentResponse(message="Unauthorized", is_successful=False)
        return JSONResponse(content=response.dict(), status_code=status.HTTP_401_UNAUTHORIZED)

    deleted_document = await request.app.mongodb["documents"].delete_one({"_id": ObjectId(document_params.id)})
    if deleted_document is None:
        response = DeleteDocumentResponse(is_successful=False, message="Failed to delete document")
        return JSONResponse(content=response.dict(), status_code=status.HTTP_500_INTERNAL_SERVER_ERROR)

    response = DeleteDocumentResponse(is_successful=True, message="Document deleted successfully")
    return JSONResponse(content=response.dict(), status_code=status.HTTP_200_OK)


class RecordNoteReviewRequest(BaseModel):
    document_id: str
    note_id: str
    review_type: str
    score: float


class RecordNoteReviewResponse(BaseModel):
    is_successful: bool
    message: str


@document_router.post("/record-note-review", description="Record the reviewing of a note", response_model=RecordNoteReviewResponse)
async def recordNoteReview(request: Request, review_params: RecordNoteReviewRequest):
    user_id = request.state.user_id
    document = await request.app.mongodb["documents"].find_one({"_id": ObjectId(review_params.document_id)})
    if not document:
        response = RecordNoteReviewResponse(message="Document not found", is_successful=False)
        return JSONResponse(content=response.dict(), status_code=status.HTTP_404_NOT_FOUND)
    # make sure that the user is the creator of the document
    if document["creator_id"] != user_id:
        response = RecordNoteReviewResponse(message="Unauthorized", is_successful=False)
        return JSONResponse(content=response.dict(), status_code=status.HTTP_401_UNAUTHORIZED)

    note = document["notes"].get(review_params.note_id)
    if not note:
        response = RecordNoteReviewResponse(message="Note not found", is_successful=False)
        return JSONResponse(content=response.dict(), status_code=status.HTTP_404_NOT_FOUND)

    if review_params.review_type not in ["flash-card", "question-answer", "explain-to-arby"]:
        response = RecordNoteReviewResponse(message="Invalid review type", is_successful=False)
        return JSONResponse(content=response.dict(), status_code=status.HTTP_400_BAD_REQUEST)

    if review_params.score < 0 or review_params.score > 1:
        response = RecordNoteReviewResponse(message="Invalid score", is_successful=False)
        return JSONResponse(content=response.dict(), status_code=status.HTTP_400_BAD_REQUEST)

    note["reviews"].append(
        NoteReview(review_type=review_params.review_type, score=review_params.score, timestamp=datetime.now().isoformat())
    )

    updated_document = await request.app.mongodb["documents"].update_one({"_id": ObjectId(review_params.document_id)},
                                                                         {"$set": {"notes": document["notes"]}})
    if updated_document is None:
        response = RecordNoteReviewResponse(is_successful=False, message="Failed to record note review")
        return JSONResponse(content=response.dict(), status_code=status.HTTP_500_INTERNAL_SERVER_ERROR)

    response = RecordNoteReviewResponse(is_successful=True, message="Note review recorded successfully")
    return JSONResponse(content=response.dict(), status_code=status.HTTP_200_OK)
