from datetime import datetime
import re

from document_utils import calculateContentEdit
from note import Note, NoteEdit


class HeadingNode:
    def __init__(self):
        self.content = ""
        self.children = []


def parseMarkdownHeadings(markdown: str) -> dict[str, HeadingNode]:
    lines = markdown.split('\n')
    heading_structure = {}
    heading_stack = []
    current_content = []
    headings = set()

    for line in lines:
        line = line.strip()
        heading_match = re.match(r'^(#{1,6})\s+(.+)$', line)

        if heading_match:
            # Process previous heading's content
            if heading_stack:
                last_heading = heading_stack[-1][0]
                heading_structure[last_heading].content = '\n'.join(current_content).strip()
            current_content = []

            level = len(heading_match.group(1))
            title = heading_match.group(2)

            # Check for duplicate headings, if found, append a number to the end of the heading
            if title in headings:
                i = 1
                while f"{title} |{i}|" in headings:
                    i += 1
                title = f"{title} |{i}|"

            headings.add(title)

            # Pop headings of equal or higher level
            while heading_stack and heading_stack[-1][1] >= level:
                heading_stack.pop()

            # Add current heading to its parent's children
            if heading_stack:
                parent_heading = heading_stack[-1][0]
                heading_structure[parent_heading].children.append(title)

            # Add current heading to stack and structure
            heading_stack.append((title, level))
            heading_structure[title] = HeadingNode()
        else:
            current_content.append(line)

    # Process content for the last heading
    if heading_stack:
        last_heading = heading_stack[-1][0]
        heading_structure[last_heading].content = '\n'.join(current_content).strip()

    return heading_structure


def generateNewDocumentNotes(new_markdown_content: str) -> dict[str, Note]:
    new_heading_structure = parseMarkdownHeadings(new_markdown_content)
    new_document_notes = dict()

    for heading in new_heading_structure.keys():
        note = Note(created_at=datetime.now().isoformat(), edits=[], reviews=[], content=new_heading_structure[heading].content,
                    children=new_heading_structure[heading].children)
        new_document_notes[heading] = note

    return new_document_notes


def generateUpdatedDocumentNotes(current_notes: dict[str, Note], new_markdown_content: str, content_change_threshold: float = 0.5) -> dict[str, Note]:
    new_heading_structure = parseMarkdownHeadings(new_markdown_content)

    potentially_deleted_notes = set(current_notes.keys())
    potentially_new_notes = set(new_heading_structure.keys())

    updated_document_notes = dict()

    for heading in list(potentially_new_notes):
        if heading in potentially_deleted_notes:
            note = Note(**current_notes[heading].dict())
            # if the content has changed, calculate the change size and add an edit action then save the note
            added, deleted = calculateContentEdit(current_notes[heading].content, new_heading_structure[heading].content)
            if added + deleted:
                note.content = new_heading_structure[heading].content
                note.edits.append(NoteEdit(added=added, deleted=deleted, timestamp=datetime.now().isoformat()))
            note.children = new_heading_structure[heading].children
            updated_document_notes[heading] = note
            potentially_deleted_notes.remove(heading)
            potentially_new_notes.remove(heading)

    # now we iterate through the potentially new notes again and compare them with all the potentially deleted notes
    # if the closest content match is less than content_change_threshold different, we inherit the attributes of said note
    for heading in list(potentially_new_notes):
        closest_match = None
        for existing_heading in list(potentially_deleted_notes):
            added, deleted = calculateContentEdit(current_notes[existing_heading].content, new_heading_structure[heading].content)
            change = (added + deleted) / (len(current_notes[existing_heading].content) + 1)
            if closest_match is None or change < closest_match[1]:
                closest_match = (existing_heading, change, added, deleted)
        if closest_match and closest_match[1] < content_change_threshold:
            note = Note(**current_notes[heading].dict())
            note.content = new_heading_structure[heading].content
            note.children = new_heading_structure[heading].children
            note.edits.append(NoteEdit(added=closest_match[2], deleted=closest_match[3], timestamp=datetime.now().isoformat()))
            updated_document_notes[heading] = note
            potentially_deleted_notes.remove(heading)
            potentially_new_notes.remove(heading)

    # add the remaining potentially new notes
    for heading in list(potentially_new_notes):
        note = Note(created_at=datetime.now().isoformat(), actions=[], content=new_heading_structure[heading].content,
                    children=new_heading_structure[heading].children)
        updated_document_notes[heading] = note

    return updated_document_notes


if __name__ == '__main__':
    # Example usage:
    markdown = """
    # Main Heading
    Some content for main heading

    ## Sub Heading 1
    Content for sub heading 1

    ### Sub-sub Heading
    Content for sub-sub heading

    ## Sub Heading 2
    Content for sub heading 2

    # Another Main Heading
    Content for another main heading
    """

    result = parseMarkdownHeadings(markdown)

    # Print the result
    for heading, node in result.items():
        print(f"Heading: {heading}")
        print(f"Content: {node.content}")
        print(f"Children: {node.children}")
        print()
