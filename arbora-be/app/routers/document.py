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
from models.document import Document, ReviewType, Folder
from note import NoteReview, Note
from note_review_utils import updateNotesRecallProbabilities
from routers import GenericResponse

document_router = APIRouter(dependencies=[Depends(JWTBearer())])


class CreateDocumentRequest(BaseModel):
    content: str


class CreateDocumentResponse(GenericResponse):
    document: Optional[Document]


@document_router.post("/create-document", description="create a document", response_model=CreateDocumentResponse)
async def create_document(request: Request, document_params: CreateDocumentRequest):
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


class ListDocumentsResponse(GenericResponse):
    documents: list[Document]


@document_router.get("/list-documents", description="Get and return a list of all the documents created by the current user",
                     response_model=ListDocumentsResponse)
async def list_documents(request: Request):
    user_id = request.state.user_id
    documents = await request.app.mongodb["documents"].find({"creator_id": user_id}).to_list(length=100)

    # update the note recall probabilities for all documents
    for document in documents:
        updateNotesRecallProbabilities(document['notes'])

    response = ListDocumentsResponse(
        documents=documents,
        is_successful=True,
        message="Documents retrieved successfully"
    )
    return JSONResponse(content=response.dict(), status_code=status.HTTP_200_OK)


class UpdateDocumentRequest(BaseModel):
    id: str
    content: str


class UpdateDocumentResponse(GenericResponse):
    document: Optional[Document]


@document_router.put("/update-document", description="Update a document", response_model=CreateDocumentResponse)
async def update_document(request: Request, document_params: UpdateDocumentRequest):
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


class DeleteDocumentResponse(GenericResponse):
    pass


@document_router.delete("/delete-document", description="Delete a document", response_model=CreateDocumentResponse)
async def delete_document(request: Request, document_params: DeleteDocumentRequest):
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


class RecordNoteReviewResponse(GenericResponse):
    pass


@document_router.post("/record-note-review", description="Record the reviewing of a note", response_model=RecordNoteReviewResponse)
async def record_note_review(request: Request, review_params: RecordNoteReviewRequest):
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

    if review_params.score < 0 or review_params.score > 1:
        response = RecordNoteReviewResponse(message="Invalid score", is_successful=False)
        return JSONResponse(content=response.dict(), status_code=status.HTTP_400_BAD_REQUEST)

    # check that the review type is one of the valid review types
    valid_review_types = [ReviewType.FLASH_CARDS.value, ReviewType.MULTIPLE_CHOICE_QUESTION.value, ReviewType.OPEN_ENDED_QUESTION.value, ReviewType.CHAT.value]
    print('valid review types are', valid_review_types)
    if review_params.review_type not in valid_review_types:
        response = RecordNoteReviewResponse(is_successful=False, message="Invalid review type")
        return JSONResponse(content=response.dict(), status_code=status.HTTP_400_BAD_REQUEST)

    note["reviews"].append(
        NoteReview(review_type=review_params.review_type, score=review_params.score, timestamp=datetime.now().isoformat()).dict()
    )

    updated_document = await request.app.mongodb["documents"].update_one({"_id": ObjectId(review_params.document_id)},
                                                                         {"$set": {"notes": document["notes"]}})
    if updated_document is None:
        response = RecordNoteReviewResponse(is_successful=False, message="Failed to record note review")
        return JSONResponse(content=response.dict(), status_code=status.HTTP_500_INTERNAL_SERVER_ERROR)

    response = RecordNoteReviewResponse(is_successful=True, message="Note review recorded successfully")
    return JSONResponse(content=response.dict(), status_code=status.HTTP_200_OK)


# region FOLDERS

class ListFoldersRequest(BaseModel):
    pass


class ListFoldersResponse(GenericResponse):
    folders: list[Folder]


@document_router.get("/list-folders", description="Get and return a list of all the folders created by the current user", response_model=ListFoldersResponse)
async def list_folders(request: Request):
    user_id = request.state.user_id
    folders = await request.app.mongodb["folders"].find({"creator_id": user_id}).to_list(length=100)
    response = ListFoldersResponse(
        folders=folders,
        is_successful=True,
        message="Folders retrieved successfully"
    )
    return JSONResponse(content=response.dict(), status_code=status.HTTP_200_OK)


class CreateFolderRequest(BaseModel):
    name: str


class CreateFolderResponse(GenericResponse):
    pass


@document_router.post("/create-folder", description="Create a folder", response_model=CreateFolderResponse)
async def create_folder(request: Request, folder_params: CreateFolderRequest):
    user_id = request.state.user_id
    folder = Folder(
        creator_id=user_id,
        name=folder_params.folder_name,
        created_at=datetime.now().isoformat()
    )
    # first check if the folder name is already in use
    folder_exists = await request.app.mongodb["folders"].find_one({"creator_id": user_id, "name": folder_params.folder_name})
    if folder_exists:
        response = CreateFolderResponse(is_successful=False, message="Folder name already in use")
        return JSONResponse(content=response.dict(), status_code=status.HTTP_400_BAD_REQUEST)

    new_folder = await request.app.mongodb["folders"].insert_one(folder.dict(by_alias=True, exclude={"id"}))

    if new_folder is None:
        response = CreateFolderResponse(is_successful=False, message="Failed to create folder")
        return JSONResponse(content=response.dict(), status_code=status.HTTP_500_INTERNAL_SERVER_ERROR)

    response = CreateFolderResponse(is_successful=True, message="Folder created successfully")
    return JSONResponse(content=response.dict(), status_code=status.HTTP_201_CREATED)


# add a document to a folder
class AddDocumentToFolderRequest(BaseModel):
    folder_id: str
    document_id: str


class AddDocumentToFolderResponse(GenericResponse):
    pass


@document_router.post("/add-document-to-folder", description="Add a document to a folder", response_model=AddDocumentToFolderResponse)
async def add_document_to_folder(request: Request, folder_params: AddDocumentToFolderRequest):
    user_id = request.state.user_id
    folder = await request.app.mongodb["folders"].find_one({"_id": ObjectId(folder_params.folder_id)})
    if not folder:
        response = AddDocumentToFolderResponse(message="Folder not found", is_successful=False)
        return JSONResponse(content=response.dict(), status_code=status.HTTP_404_NOT_FOUND)
    # make sure that the user is the creator of the folder
    if folder["creator_id"] != user_id:
        response = AddDocumentToFolderResponse(message="Unauthorized", is_successful=False)
        return JSONResponse(content=response.dict(), status_code=status.HTTP_401_UNAUTHORIZED)

    document = await request.app.mongodb["documents"].find_one({"_id": ObjectId(folder_params.document_id)})
    if not document:
        response = AddDocumentToFolderResponse(message="Document not found", is_successful=False)
        return JSONResponse(content=response.dict(), status_code=status.HTTP_404_NOT_FOUND)

    # check that the user is the creator of the document
    if document["creator_id"] != user_id:
        response = AddDocumentToFolderResponse(message="Unauthorized", is_successful=False)
        return JSONResponse(content=response.dict(), status_code=status.HTTP_401_UNAUTHORIZED)

    # check if the document is already in the folder
    if folder_params.document_id in folder["documents"]:
        response = AddDocumentToFolderResponse(message="Document already in folder", is_successful=False)
        return JSONResponse(content=response.dict(), status_code=status.HTTP_400_BAD_REQUEST)

    updated_document = await request.app.mongodb["documents"].update_one({"_id": ObjectId(folder_params.document_id)},
                                                                         {"$set": {"folder_id": folder_params.folder_id}})

    if updated_document is None:
        response = AddDocumentToFolderResponse(is_successful=False, message="Failed to add document to folder")
        return JSONResponse(content=response.dict(), status_code=status.HTTP_500_INTERNAL_SERVER_ERROR)

    response = AddDocumentToFolderResponse(is_successful=True, message="Document added to folder successfully")
    return JSONResponse(content=response.dict(), status_code=status.HTTP_200_OK)


class UpdateFolderRequest(BaseModel):
    id: str
    name: str


class UpdateFolderResponse(GenericResponse):
    pass


@document_router.put("/update-folder", description="Update a folder name", response_model=UpdateFolderResponse)
async def update_folder(request: Request, folder_params: UpdateFolderRequest):
    user_id = request.state.user_id

    folder = await request.app.mongodb["folders"].find_one({"_id": ObjectId(folder_params.folder_id)})
    if not folder:
        response = AddDocumentToFolderResponse(message="Folder not found", is_successful=False)
        return JSONResponse(content=response.dict(), status_code=status.HTTP_404_NOT_FOUND)
    # make sure that the user is the creator of the folder
    if folder["creator_id"] != user_id:
        response = AddDocumentToFolderResponse(message="Unauthorized", is_successful=False)
        return JSONResponse(content=response.dict(), status_code=status.HTTP_401_UNAUTHORIZED)

    updated_folder = await request.app.mongodb["folders"].update_one({"_id": ObjectId(folder_params.folder_id)},
                                                                     {"$set": {"name": folder_params.name}})

    if updated_folder is None:
        response = UpdateFolderResponse(is_successful=False, message="Failed to update folder")
        return JSONResponse(content=response.dict(), status_code=status.HTTP_500_INTERNAL_SERVER_ERROR)

    response = UpdateFolderResponse(is_successful=True, message="Folder updated successfully")


class DeleteFolderRequest(BaseModel):
    id: str


class DeleteFolderResponse(GenericResponse):
    pass


@document_router.delete("/delete-folder", description="Delete a folder", response_model=DeleteFolderResponse)
async def delete_folder(request: Request, folder_params: DeleteFolderRequest):
    user_id = request.state.user_id
    folder = await request.app.mongodb["folders"].find_one({"_id": ObjectId(folder_params.id)})
    if not folder:
        response = DeleteFolderResponse(message="Folder not found", is_successful=False)
        return JSONResponse(content=response.dict(), status_code=status.HTTP_404_NOT_FOUND)

    # make sure that the user is the creator of the document
    if folder["creator_id"] != user_id:
        response = DeleteFolderResponse(message="Unauthorized", is_successful=False)
        return JSONResponse(content=response.dict(), status_code=status.HTTP_401_UNAUTHORIZED)

    deleted_folder = await request.app.mongodb["folders"].delete_one({"_id": ObjectId(folder_params.id)})

    if deleted_folder is None:
        response = DeleteFolderResponse(is_successful=False, message="Failed to delete folder")
        return JSONResponse(content=response.dict(), status_code=status.HTTP_500_INTERNAL_SERVER_ERROR)

    response = DeleteFolderResponse(is_successful=True, message="Folder deleted successfully")
    return JSONResponse(content=response.dict(), status_code=status.HTTP_200_OK)

# endregion
