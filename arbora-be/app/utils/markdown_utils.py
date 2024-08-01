from datetime import datetime
import re
from typing import Optional

from document_utils import calculateContentEdit
from note import Note, NoteEdit


class HeadingNode:
    def __init__(self):
        self.content = ""
        self.title = ""
        self.coords = ""
        self.level = 0
        self.children = []


def parseMarkdownHeadings(markdown: str) -> dict[str, HeadingNode]:
    lines = markdown.split('\n')
    heading_structure = {}
    node_stack = []
    current_content = []
    headings = set()

    for line in lines:
        line = line.strip()
        heading_match = re.match(r'^(#{1,6})\s+(.+)$', line)

        if heading_match:
            # Process previous heading's content
            if node_stack:
                last_coords = node_stack[-1][1]
                heading_structure[last_coords].content = '\n'.join(current_content).strip()
            current_content = []

            level = len(heading_match.group(1))
            title = heading_match.group(2)
            coords = ''

            # Pop sections of equal or higher level
            while node_stack and node_stack[-1][0] >= level:
                if node_stack[-1][1].count('.') == 0:
                    break
                node_stack.pop()

            # calculate the note's coords
            if coords == '':
                if len(node_stack) == 0:
                    coords = '1'
                else:
                    if node_stack[-1][0] >= level:
                        coords = str(int(node_stack[-1][1]) + 1)
                    else:
                        coords = node_stack[-1][1] + '.' + str(len(heading_structure[node_stack[-1][1]].children) + 1)

            headings.add(coords)

            # Add current section to its parent's children
            if node_stack and coords.count('.') > 0:
                parent_coords = '.'.join(coords.split('.')[:-1])
                heading_structure[parent_coords].children.append(coords)

            # Add current section to stack and structure
            node_stack.append((level, coords))
            node = HeadingNode()
            node.title = title
            node.coords = coords
            node.level = level
            heading_structure[coords] = node
        else:
            current_content.append(line)

    # Process content for the last heading
    if node_stack:
        last_coords = node_stack[-1][1]
        heading_structure[last_coords].content = '\n'.join(current_content).strip()

    return heading_structure


def generateNewDocumentNotes(new_markdown_content: str) -> dict[str, Note]:
    new_heading_structure = parseMarkdownHeadings(new_markdown_content)
    new_document_notes = dict()

    for coords, node in new_heading_structure.items():
        note = Note(created_at=datetime.now().isoformat(), edits=[], reviews=[], content=node.content,
                    title=node.title, children=node.children, level=node.level)
        new_document_notes[coords] = note

    return new_document_notes


def generateUpdatedDocumentNotes(current_notes: dict[str, Note], new_markdown_content: str, content_change_threshold: float = 0.5) -> dict[str, Note]:
    new_heading_structure = parseMarkdownHeadings(new_markdown_content)

    updated_document_notes = dict()

    new_notes_coords = set(new_heading_structure.keys())

    # now we iterate through the potentially new notes again and compare them with all the potentially deleted notes
    # if the closest content match is less than content_change_threshold different, we inherit the attributes of said note
    for new_coords in list(new_notes_coords):
        closest_match: Optional[tuple[str, float, int, int]] = None
        for existing_coords in current_notes.keys():
            added, deleted = calculateContentEdit(current_notes[existing_coords].content, new_heading_structure[new_coords].content)
            change = (added + deleted) / (len(current_notes[existing_coords].content) + 1)

            # if the headings are the same, set the closest match and break
            if new_heading_structure[new_coords].title == current_notes[existing_coords].title:
                closest_match = (existing_coords, change, added, deleted)
                break

            if closest_match is None or change < closest_match[1]:
                closest_match = (existing_coords, change, added, deleted)

        if closest_match and closest_match[1] < content_change_threshold:
            note = Note(**current_notes[closest_match[0]].dict())
            node = new_heading_structure[new_coords]
            note.content = node.content
            note.children = node.children
            note.title = node.title
            note.level = node.level
            note.edits.append(NoteEdit(added=closest_match[2], deleted=closest_match[3], timestamp=datetime.now().isoformat()))
            updated_document_notes[new_coords] = note

            new_notes_coords.remove(new_coords)

    # add the remaining potentially new notes
    for new_coords in list(new_notes_coords):
        node = new_heading_structure[new_coords]
        note = Note(created_at=datetime.now().isoformat(), actions=[], content=node.content,
                    title=node.title, level=node.level, children=node.children)
        updated_document_notes[new_coords] = note

    return updated_document_notes


if __name__ == '__main__':
    # Example usage:
    markdown = """
    ### Main Heading
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
    for heading, heading_node in result.items():
        print(f"Heading: {heading}")
        print(f"Content: {heading_node.content}")
        print(f"Children: {heading_node.children}")
        print()
