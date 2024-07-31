import difflib


def calculateContentEdit(before: str, after: str) -> tuple[int, int]:
    """
     Returns the number of characters added and deleted in the edit from before to after.

    :param before:
    :param after:
    :return:
    """
    before_lines = before.splitlines()
    after_lines = after.splitlines()

    d = difflib.Differ()
    diff = list(d.compare(before_lines, after_lines))

    added_chars = sum(len(x[2:]) for x in diff if x.startswith('+ '))
    deleted_chars = sum(len(x[2:]) for x in diff if x.startswith('- '))

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
    return ""
