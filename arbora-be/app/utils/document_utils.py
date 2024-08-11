import difflib
import secrets


def calculateContentEdit(before: str, after: str) -> tuple[int, int]:
    """
    Returns the number of characters added and deleted in the edit from before to after.

    :param before: Original text
    :param after: Modified text
    :return: Tuple of (added_chars, deleted_chars)
    """
    # Use SequenceMatcher to compare the strings
    matcher = difflib.SequenceMatcher(None, before, after)

    added_chars = 0
    deleted_chars = 0

    # Iterate through the operations
    for opcode, i1, i2, j1, j2 in matcher.get_opcodes():
        if opcode == 'insert':
            added_chars += j2 - j1
        elif opcode == 'delete':
            deleted_chars += i2 - i1
        elif opcode == 'replace':
            added_chars += j2 - j1
            deleted_chars += i2 - i1

    return added_chars, deleted_chars


def extractDocumentTitle(markdown_content: str) -> str:
    """
    Extracts the title of a markdown document from the first heading.

    :param markdown_content:
    :return:
    """
    lines = markdown_content.splitlines()
    for line in lines:
        if line.startswith("# "):
            return line[2:]
    # else just take the first few words of the first line,
    # title should be less than 20 chars
    title = ''
    for word in lines[0].split():
        title += word + ' '
        if len(title) > 20:
            title += '...'
            break
    return title
