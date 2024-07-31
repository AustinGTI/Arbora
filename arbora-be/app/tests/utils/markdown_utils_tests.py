import pytest
from unittest.mock import patch
from datetime import datetime

# Assume the provided code's functions are in a module named markdown_notes
from utils.markdown_utils import parseMarkdownHeadings, generateNewDocumentNotes, generateUpdatedDocumentNotes
from note import Note, Action, ActionType


# Helper function to mock datetime
def mock_datetime(target, dt):
    class DatetimeSubclass(type):
        @classmethod
        def __instancecheck__(mcs, obj):
            return isinstance(obj, datetime)

    class BaseMockedDatetime(datetime):
        @classmethod
        def now(cls):
            return dt

    MockedDatetime = DatetimeSubclass('datetime', (BaseMockedDatetime,), {})
    patcher = patch(target, MockedDatetime)
    patcher.start()
    return patcher


@pytest.fixture
def setup_datetime_mock():
    dt = datetime(2021, 1, 1)
    patcher = mock_datetime('markdown_notes.datetime', dt)
    yield dt
    patcher.stop()


# Test for parseMarkdownHeadings
def test_parse_markdown_headings_empty():
    assert parseMarkdownHeadings("") == {}


def test_parse_markdown_headings_simple():
    markdown = "# Heading\nContent"
    expected = {'Heading': {'content': 'Content', 'children': []}}
    result = parseMarkdownHeadings(markdown)
    assert result.keys() == expected.keys()
    for key in result:
        assert result[key].content == expected[key]['content']
        assert result[key].children == expected[key]['children']


# Tests for generateNewDocumentNotes
def test_generate_new_document_notes_basic(setup_datetime_mock):
    markdown = "# Heading\nContent"
    expected_date = setup_datetime_mock
    result = generateNewDocumentNotes(markdown)
    assert 'Heading' in result
    note = result['Heading']
    assert note.created_at == expected_date.isoformat()
    assert note.content == "Content"
    assert note.children == []

# Continue adding more test cases following the structure above
