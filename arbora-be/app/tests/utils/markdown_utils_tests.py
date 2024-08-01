import pytest
from utils.markdown_utils import parseMarkdownHeadings, HeadingNode


def generateMarkdown(level, title, content=''):
    """Generate markdown text for a given heading level, title, and optional content."""
    heading = '#' * level + ' ' + title + '\n'
    if content:
        content = content + '\n'
    return heading + content


# Helper function to simplify structure checking
def check_heading(heading, title, coords, content='', children=None):
    assert heading.title == title
    assert heading.coords == coords
    assert heading.content == content
    if children is not None:
        assert all([a == b for a, b in zip(children, heading.children)])
    else:
        assert heading.children == []


# Test cases
def test_flat_structure():
    markdown = generateMarkdown(1, "Heading 1", "Content for heading 1") + \
               generateMarkdown(2, "Heading 1.1", "Content for heading 1.1") + \
               generateMarkdown(2, "Heading 1.2", "Content for heading 1.2") + \
               generateMarkdown(1, "Heading 2", "Content for heading 2")
    structure = parseMarkdownHeadings(markdown)
    assert len(structure) == 4
    check_heading(structure['1'], 'Heading 1', '1', 'Content for heading 1', ['1.1', '1.2'])
    check_heading(structure['1.1'], 'Heading 1.1', '1.1', 'Content for heading 1.1')
    check_heading(structure['1.2'], 'Heading 1.2', '1.2', 'Content for heading 1.2')
    check_heading(structure['2'], 'Heading 2', '2', 'Content for heading 2')


def test_deeply_nested_headings():
    markdown = generateMarkdown(1, "Heading 1", "Content for heading 1") + \
               generateMarkdown(2, "Heading 1.1", "Content for heading 1.1") + \
               generateMarkdown(3, "Heading 1.1.1", "Content for heading 1.1.1") + \
               generateMarkdown(4, "Heading 1.1.1.1", "Content for heading 1.1.1.1") + \
               generateMarkdown(5, "Heading 1.1.1.1.1", "Content for heading 1.1.1.1.1")
    structure = parseMarkdownHeadings(markdown)
    assert len(structure) == 5
    check_heading(structure['1'], 'Heading 1', '1', 'Content for heading 1', ['1.1'])
    check_heading(structure['1.1'], 'Heading 1.1', '1.1', 'Content for heading 1.1', ['1.1.1'])
    check_heading(structure['1.1.1'], 'Heading 1.1.1', '1.1.1', 'Content for heading 1.1.1', ['1.1.1.1'])
    check_heading(structure['1.1.1.1'], 'Heading 1.1.1.1', '1.1.1.1', 'Content for heading 1.1.1.1', ['1.1.1.1.1'])
    check_heading(structure['1.1.1.1.1'], 'Heading 1.1.1.1.1', '1.1.1.1.1', 'Content for heading 1.1.1.1.1')


def test_imbalanced_levels():
    markdown = generateMarkdown(1, "Heading 1", "Content for heading 1") + \
               generateMarkdown(3, "Heading 1.1", "Content for heading 1.1") + \
               generateMarkdown(2, "Heading 1.2", "Content for heading 1.2")
    structure = parseMarkdownHeadings(markdown)
    assert len(structure) == 3
    check_heading(structure['1'], 'Heading 1', '1', 'Content for heading 1', ['1.1', '1.2'])
    check_heading(structure['1.1'], 'Heading 1.1', '1.1', 'Content for heading 1.1')
    check_heading(structure['1.2'], 'Heading 1.2', '1.2', 'Content for heading 1.2')


def test_headings_with_no_content():
    markdown = generateMarkdown(1, "Heading 1") + \
               generateMarkdown(2, "Heading 1.1") + \
               generateMarkdown(1, "Heading 2")
    structure = parseMarkdownHeadings(markdown)
    assert len(structure) == 3
    check_heading(structure['1'], 'Heading 1', '1', '', ['1.1'])
    check_heading(structure['1.1'], 'Heading 1.1', '1.1', '')
    check_heading(structure['2'], 'Heading 2', '2', '')


def test_mismatched_headings_levels():
    markdown = generateMarkdown(1, "Heading 1", "Content for heading 1") + \
               generateMarkdown(4, "Heading 1.1", "Content for heading 1.1") + \
               generateMarkdown(2, "Heading 1.2", "Content for heading 1.2")
    structure = parseMarkdownHeadings(markdown)
    assert len(structure) == 3
    check_heading(structure['1'], 'Heading 1', '1', 'Content for heading 1', ['1.1', '1.2'])
    check_heading(structure['1.1'], 'Heading 1.1', '1.1', 'Content for heading 1.1')
    check_heading(structure['1.2'], 'Heading 1.2', '1.2', 'Content for heading 1.2')


if __name__ == "__main__":
    pytest.main()
